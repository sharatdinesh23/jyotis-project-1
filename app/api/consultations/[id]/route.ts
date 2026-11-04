import { NextResponse } from 'next/server';
import { getConsultation, saveConsultationRecord } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const consultation = getConsultation(params.id);
    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }
    return NextResponse.json({ consultation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const c = getConsultation(params.id);
    if (!c) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    if (body.casePaper) {
      c.casePaper = { ...c.casePaper, ...body.casePaper };
    }
    if (body.prescription) {
      c.prescription = { ...c.prescription, ...body.prescription };
    }

    c.version = (c.version || 1) + 1;
    saveConsultationRecord(c);

    return NextResponse.json({ success: true, consultation: c });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
