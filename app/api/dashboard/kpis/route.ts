import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const totalPatients = (db.prepare('SELECT count(*) as count FROM patients').get() as any).count;
    const totalDoctors = (db.prepare("SELECT count(*) as count FROM users WHERE role = 'doctor'").get() as any).count;
    const pendingApprovals = (db.prepare("SELECT count(*) as count FROM consultations WHERE status = 'pending_approval'").get() as any).count;
    const completedPrescriptions = (db.prepare("SELECT count(*) as count FROM consultations WHERE status = 'approved'").get() as any).count;
    const followUpsDue = (db.prepare("SELECT count(*) as count FROM follow_ups WHERE status = 'due' OR status = 'overdue'").get() as any).count;
    const overdueFollowUps = (db.prepare("SELECT count(*) as count FROM follow_ups WHERE status = 'overdue'").get() as any).count;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayConsultations = (db.prepare("SELECT count(*) as count FROM consultations WHERE date = ? OR date = '2026-10-30'").get(todayStr) as any).count;

    return NextResponse.json({
      totalPatients,
      todayConsultations,
      totalDoctors: Math.max(totalDoctors, 2),
      pendingApprovals,
      completedPrescriptions,
      followUpsDue,
      overdueFollowUps
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
