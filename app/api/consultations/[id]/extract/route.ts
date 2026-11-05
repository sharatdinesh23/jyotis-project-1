import { NextResponse } from 'next/server';
import { extractMedicalData } from '@/lib/adapters/ai-service';
import { clinicStore } from '@/lib/store';

function toText(val: any): string {
  if (!val) return '';
  if (Array.isArray(val)) return val.filter(Boolean).join('; ');
  return String(val);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const consultation = clinicStore.getConsultationById(params.id);
    
    const transcript = body.transcript || consultation?.transcript || [];
    if (!transcript || transcript.length === 0) {
      return NextResponse.json({ error: 'No transcript provided for extraction' }, { status: 400 });
    }

    const extraction = await extractMedicalData({
      transcript,
      patientName: body.patientName || consultation?.casePaper?.patientDetails?.name,
      patientAge: body.patientAge || consultation?.casePaper?.patientDetails?.age,
      patientGender: body.patientGender || consultation?.casePaper?.patientDetails?.gender,
      providerOverride: body.providerOverride,
      modelOverride: body.modelOverride,
      apiKeyOverride: body.apiKeyOverride,
    });

    if (consultation) {
      consultation.extraction = extraction;
      
      // Update case paper fields from extraction
      consultation.casePaper.chiefComplaints = toText(extraction.patientSymptomsReported) || consultation.casePaper.chiefComplaints;
      consultation.casePaper.historyOfPresentIllness = toText(extraction.durationAndSeverity) || consultation.casePaper.historyOfPresentIllness;
      consultation.casePaper.pastMedicalHistory = toText(extraction.relevantMedicalHistory) || consultation.casePaper.pastMedicalHistory;
      consultation.casePaper.physicalExamination = toText(extraction.doctorClinicalObservations) || consultation.casePaper.physicalExamination;
      consultation.casePaper.clinicalAssessment = {
        suspected: toText(extraction.suspectedDiagnoses),
        confirmed: toText(extraction.confirmedDiagnoses)
      };
      consultation.casePaper.treatmentPlan = toText(extraction.treatmentRecommendations) || consultation.casePaper.treatmentPlan;
      consultation.casePaper.lifestyleDietAdvice = toText(extraction.lifestyleDietInstructions) || consultation.casePaper.lifestyleDietAdvice;
      consultation.casePaper.followUpAdvice = toText(extraction.followUpRecommendation) || consultation.casePaper.followUpAdvice;

      // Normalize medicines draft
      consultation.prescription.medicines = (extraction.medicinesMentioned || []).map((m: any, idx: number) => ({
        id: m.id || `med-${idx + 1}`,
        name: m.name || 'Unnamed Medicine',
        form: m.form || 'Tablet',
        dosage: m.dosage || '',
        frequency: m.frequency || 'As advised',
        timing: m.timing || 'After Food',
        duration: m.duration || '5 days',
        instructions: m.instructions || '',
        flagged: Boolean(m.flagged || !m.frequency || !m.dosage),
        flagReason: m.flagReason || (!m.frequency ? 'Frequency not stated in consultation' : '')
      }));

      consultation.prescription.instructions = Array.isArray(extraction.treatmentRecommendations) 
        ? extraction.treatmentRecommendations 
        : [toText(extraction.treatmentRecommendations)].filter(Boolean);

      consultation.prescription.dietaryAdvice = Array.isArray(extraction.lifestyleDietInstructions)
        ? extraction.lifestyleDietInstructions
        : [toText(extraction.lifestyleDietInstructions)].filter(Boolean);

      consultation.prescription.followUpDate = extraction.followUpDate || '';

      // Normalize flags
      consultation.prescription.flags = (extraction.flags || []).map((f: any, idx: number) => {
        if (typeof f === 'string') {
          return {
            id: `fl-${idx + 1}`,
            type: 'missing_frequency' as const,
            message: f,
            field: 'medicinesMentioned',
            resolved: false
          };
        }
        return f;
      });

      clinicStore.saveConsultation(consultation);
    }

    return NextResponse.json({
      success: true,
      extraction,
      providerUsed: extraction.providerUsed
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

