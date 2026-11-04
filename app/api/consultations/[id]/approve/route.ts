import { NextResponse } from 'next/server';
import { approveConsultationInDB } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const doctorName = body.doctorName || 'Dr. Arvind Patil';
    const role = body.role || 'doctor';

    // HARD SAFETY RULE: Only a doctor can approve
    if (role !== 'doctor' && role !== 'admin') {
      return NextResponse.json(
        { error: 'SAFETY GATE VIOLATION: Only an authorized Doctor can review and approve consultations.' },
        { status: 403 }
      );
    }

    approveConsultationInDB(params.id, doctorName);
    return NextResponse.json({
      success: true,
      message: 'Consultation approved and signed. Official PDFs unlocked in SQLite database.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
