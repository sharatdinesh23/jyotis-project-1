import { NextResponse } from 'next/server';
import { extractMedicalData } from '@/lib/adapters/ai-service';
import { clinicStore } from '@/lib/store';

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
      consultation.casePaper.chiefComplaints = extraction.patientSymptomsReported || consultation.casePaper.chiefComplaints;
      consultation.casePaper.historyOfPresentIllness = extraction.durationAndSeverity || consultation.casePaper.historyOfPresentIllness;
      consultation.casePaper.pastMedicalHistory = extraction.relevantMedicalHistory || consultation.casePaper.pastMedicalHistory;
      consultation.casePaper.physicalExamination = extraction.doctorClinicalObservations || consultation.casePaper.physicalExamination;
      consultation.casePaper.clinicalAssessment = {
        suspected: extraction.suspectedDiagnoses?.join('; ') || '',
        confirmed: extraction.confirmedDiagnoses?.join('; ') || ''
      };
      consultation.casePaper.treatmentPlan = extraction.treatmentRecommendations?.join('\n') || consultation.casePaper.treatmentPlan;
      consultation.casePaper.lifestyleDietAdvice = extraction.lifestyleDietInstructions?.join('\n') || consultation.casePaper.lifestyleDietAdvice;
      consultation.casePaper.followUpAdvice = extraction.followUpRecommendation || consultation.casePaper.followUpAdvice;

      // Update prescription draft
      consultation.prescription.medicines = extraction.medicinesMentioned || [];
      consultation.prescription.instructions = extraction.treatmentRecommendations || [];
      consultation.prescription.dietaryAdvice = extraction.lifestyleDietInstructions || [];
      consultation.prescription.followUpDate = extraction.followUpDate || '';
      consultation.prescription.flags = extraction.flags || [];

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

