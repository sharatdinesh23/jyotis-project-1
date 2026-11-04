import { NextResponse } from 'next/server';
import { getAllConsultations, saveConsultationRecord } from '@/lib/db';

export async function GET() {
  try {
    const consultations = getAllConsultations();
    return NextResponse.json({ consultations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // STRICT SAFETY RULE 8: Consent is required before consultation capture
    if (!body.consentRecorded) {
      return NextResponse.json(
        { error: 'SAFETY VIOLATION: Patient consent must be recorded prior to consultation capture.' },
        { status: 400 }
      );
    }

    saveConsultationRecord(body);
    return NextResponse.json({ success: true, consultation: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
