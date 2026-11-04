import { NextResponse } from 'next/server';
import { findUserByEmailOrMobile, findPatientByEmailOrMobile } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, identifier, password } = await req.json();
    const loginId = (identifier || email || '').trim();

    if (!loginId || !password) {
      return NextResponse.json({ error: 'Email or Mobile number and password are required' }, { status: 400 });
    }

    const user = findUserByEmailOrMobile(loginId);
    if (!user || user.password !== password.trim()) {
      return NextResponse.json({ error: 'Invalid credentials. Please verify your email/mobile and password.' }, { status: 401 });
    }

    // If user is a patient, load their clinical patient profile
    let patientData: any = null;
    if (user.role === 'patient') {
      patientData = findPatientByEmailOrMobile(user.email, user.mobile);
    }

    const safeUser = {
      id: user.id,
      patientId: patientData?.id || (user.id.startsWith('PSC') ? user.id : 'PSC-2026-0084'),
      email: user.email,
      name: user.name, // The exact name registered
      role: user.role,
      branch: user.branch,
      mobile: user.mobile || patientData?.mobile || '',
      regNo: user.regNo,
      age: patientData?.age || 30,
      gender: patientData?.gender || 'Male',
      bloodGroup: patientData?.bloodGroup || 'O+',
      address: patientData?.address || '',
    };

    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

