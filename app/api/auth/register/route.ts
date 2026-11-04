import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByMobile, registerNewUser, createPatientRecord } from '@/lib/db';
import { UserRole } from '@/types';

export async function POST(req: Request) {
  try {
    const { email, password, name, role, branch, mobile, age, gender, bloodGroup, address } = await req.json();

    if (!email || !password || !name || !mobile) {
      return NextResponse.json({ error: 'Please provide full name, mobile phone number, email address, and password' }, { status: 400 });
    }

    // Security Gate: User can ONLY register as a patient and NOT as an admin, doctor, or superadmin
    if (role && role !== 'patient') {
      return NextResponse.json(
        {
          error: 'Security Gate: Public registration is strictly restricted to Patients. Doctor, Receptionist, and Admin accounts are provisioned internally by Clinic Superadmin.'
        },
        { status: 403 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    // 1. Uniqueness check for Email
    const existingEmail = findUserByEmail(cleanEmail);
    if (existingEmail) {
      return NextResponse.json({ error: 'An account with this email address already exists. Please sign in.' }, { status: 409 });
    }

    // 2. Uniqueness check for Phone Number (Mobile)
    const existingPhone = findUserByMobile(cleanMobile);
    if (existingPhone) {
      return NextResponse.json({ error: 'An account with this mobile phone number already exists. Please sign in or use another number.' }, { status: 409 });
    }

    // 3. Register user in SQLite users table
    const newUser = registerNewUser({
      email: cleanEmail,
      password: password.trim(),
      name: name.trim(),
      role: 'patient',
      branch: branch || 'Badlapur Central',
      mobile: cleanMobile,
    });

    // 4. Create or link patient clinical record in SQLite patients table
    const { patient: patientRecord } = createPatientRecord({
      name: name.trim(),
      age: Number(age) || 30,
      gender: gender || 'Male',
      mobile: cleanMobile,
      email: cleanEmail,
      address: address?.trim() || 'Badlapur East',
      bloodGroup: bloodGroup || 'O+',
      branch: branch || 'Badlapur Central',
    });

    const safeUser = {
      id: newUser.id,
      patientId: patientRecord.id,
      email: newUser.email,
      name: newUser.name, // Exact name registered by the user
      role: newUser.role,
      branch: newUser.branch,
      mobile: newUser.mobile,
      age: patientRecord.age,
      gender: patientRecord.gender,
      bloodGroup: patientRecord.bloodGroup,
      address: patientRecord.address,
    };

    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

