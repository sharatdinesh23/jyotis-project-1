import { NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/adapters/stt-service';
import { clinicStore } from '@/lib/store';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const result = await transcribeAudio({
      audioBase64: body.audioBase64,
      mimeType: body.mimeType,
      language: body.language,
      providerOverride: body.providerOverride,
      apiKeyOverride: body.apiKeyOverride,
      isKneePainBenchmark: body.isKneePainBenchmark
    });

    const consultation = clinicStore.getConsultationById(params.id);
    if (consultation) {
      consultation.transcript = result.transcript;
      clinicStore.saveConsultation(consultation);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

