import { NextResponse } from 'next/server';
import { getAllPatients, createPatientRecord } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    let patients = getAllPatients();

    if (search) {
      patients = patients.filter(
        p => p.id.toLowerCase().includes(search) ||
             p.name.toLowerCase().includes(search) ||
             p.mobile.includes(search)
      );
    }

    return NextResponse.json({ patients });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = createPatientRecord(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
