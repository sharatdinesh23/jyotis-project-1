'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Patient, Consultation, FollowUp } from '@/types';
import {
  User,
  FileText,
  Pill,
  Calendar,
  FileDown,
  LogOut,
  ShieldCheck,
  Clock,
  HeartPulse,
  Activity,
  AlertCircle,
  Lock,
  Phone,
  Building,
  Mic,
  Sparkles,
  Volume2,
  CheckCircle2,
  Play
} from 'lucide-react';
import { generateCasePaperPDF, generatePrescriptionPDF } from '@/lib/pdfGenerator';
import { PatientVoiceNoteRecorder } from '@/components/PatientVoiceNoteRecorder';

export default function PatientPortalPage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<any[]>([]);

  useEffect(() => {
    // Auth Guard
    const raw = typeof window !== 'undefined' ? localStorage.getItem('parasnath_session_user') : null;
    if (!raw) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(raw);
      setSessionUser(user);
      setIsCheckingAuth(false);

      // Search for the patient's record by patientId, mobile, or email
      const searchQuery = user.patientId || user.mobile || user.email || user.name;
      fetch(`/api/patients?search=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (data.patients && data.patients.length > 0) {
            // Pick exact match by id, mobile or email
            const matched = data.patients.find((p: any) =>
              (user.patientId && p.id === user.patientId) ||
              (user.mobile && p.mobile && p.mobile.replace(/[^0-9]/g, '').slice(-10) === user.mobile.replace(/[^0-9]/g, '').slice(-10)) ||
              (user.email && p.email && p.email.toLowerCase() === user.email.toLowerCase())
            ) || data.patients[0];

            setPatient(matched);

            // Fetch voice notes for this matched patient
            if (matched.id) {
              fetch(`/api/patient-voice-notes?patientId=${encodeURIComponent(matched.id)}`)
                .then(r => r.json())
                .then(vData => {
                  if (vData.voiceNotes) setVoiceNotes(vData.voiceNotes);
                });
            }
          }
        });

      // Also initial fetch by session patientId
      const initPid = user.patientId || 'PSC-2026-0084';
      fetch(`/api/patient-voice-notes?patientId=${encodeURIComponent(initPid)}`)
        .then(r => r.json())
        .then(vData => {
          if (vData.voiceNotes && vData.voiceNotes.length > 0) {
            setVoiceNotes(vData.voiceNotes);
          }
        });

      // Fetch all consultations and strictly filter by this logged-in patient's identity
      fetch('/api/consultations')
        .then(res => res.json())
        .then(data => {
          if (data.consultations) {
            const userPhoneClean = user.mobile ? user.mobile.replace(/[^0-9]/g, '').slice(-10) : '';
            const own = data.consultations.filter((c: any) => {
              const byId = user.patientId && c.patientId === user.patientId;
              const byPhone = userPhoneClean && c.casePaper?.patientDetails?.mobile && c.casePaper.patientDetails.mobile.replace(/[^0-9]/g, '').slice(-10) === userPhoneClean;
              const byName = user.name && c.casePaper?.patientDetails?.name && c.casePaper.patientDetails.name.trim().toLowerCase() === user.name.trim().toLowerCase();
              return byId || byPhone || byName;
            });
            setConsultations(own);
          }
        });
    } catch {
      localStorage.removeItem('parasnath_session_user');
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('parasnath_session_user');
    router.push('/login');
  };

  const handleDownloadCasePaper = (c: Consultation) => {
    try {
      const doc = generateCasePaperPDF(c);
      doc.save(`My_CasePaper_${c.id}.pdf`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDownloadRx = (c: Consultation) => {
    try {
      const doc = generatePrescriptionPDF(c);
      doc.save(`My_Prescription_${c.id}.pdf`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isCheckingAuth || !sessionUser) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center shadow-lg shadow-emerald-950">
            <Lock className="w-7 h-7 text-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-white">Patient Health Portal Authorization</h2>
            <p className="text-xs text-slate-400">Verifying patient identity. Redirecting to login...</p>
          </div>
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Display user identity: prioritize dynamically registered values over fallback
  const displayName = patient?.name || sessionUser?.name || 'Registered Patient';
  const displayId = patient?.id || sessionUser?.patientId || 'PSC-2026-REGISTERED';
  const displayAge = patient?.age || sessionUser?.age || '—';
  const displayGender = patient?.gender || sessionUser?.gender || '—';
  const displayBlood = patient?.bloodGroup || sessionUser?.bloodGroup || '—';
  const displayMobile = patient?.mobile || sessionUser?.mobile || '—';
  const displayBranch = patient?.branch || sessionUser?.branch || 'Badlapur Central';

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Patient Header */}
      <header className="h-16 flex-shrink-0 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white">Patient Digital Health Portal</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 font-mono font-bold px-2 py-0.5 rounded border border-purple-800/60">
                {displayName} ({displayId})
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Parasnath Speciality Clinic • Personal Health Record & Prescriptions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            Staff Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Patient Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Card - Completely Dynamic to Registered Patient */}
          <div className="rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                Patient Medical Profile
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Namaste, {displayName}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                Your permanent medical record is stored safely under Patient ID <strong className="text-white font-mono">{displayId}</strong>. Access doctor-approved digital prescriptions and case papers below.
              </p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800 shrink-0">
              <div className="text-slate-400">Age: <span className="text-white font-bold">{displayAge} Yrs</span> • {displayGender}</div>
              <div className="text-slate-400">Blood Group: <span className="text-white font-bold">{displayBlood}</span></div>
              <div className="text-slate-400">Mobile: <span className="text-purple-300 font-mono">{displayMobile}</span></div>
              <div className="text-slate-400">Branch: <span className="text-slate-300">{displayBranch}</span></div>
            </div>
          </div>

          {/* Patient Voice Note Recorder (Module 2 Pre-Consultation Intake) */}
          <PatientVoiceNoteRecorder
            patientId={displayId}
            patientName={displayName}
            patientMobile={displayMobile}
            onVoiceNoteSubmitted={(newVN) => setVoiceNotes([newVN, ...voiceNotes])}
          />

          {/* Submitted Voice Notes History */}
          {voiceNotes.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-white text-sm">
                    My Submitted Health Voice Notes ({voiceNotes.length})
                  </h3>
                </div>
                <span className="text-[10px] text-purple-400 font-mono bg-purple-950 px-2 py-0.5 rounded border border-purple-800/60">
                  Transmitted to Outpatient OPD
                </span>
              </div>

              <div className="space-y-3">
                {voiceNotes.map((vn) => (
                  <div
                    key={vn.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{vn.chiefIssue || 'Health Symptom Voice Note'}</span>
                        <span className="text-[10px] font-mono text-purple-400">({vn.id})</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {vn.language}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(vn.createdAt).toLocaleDateString()}
                        </span>
                        {vn.status === 'reviewed' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Reviewed by Doctor</span>
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Sent to Dr. Patil (Pending Review)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                      <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Speech Transcription:</span>
                      </div>
                      "{vn.transcription}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Alert Card */}
          {displayId === 'PSC-2026-0084' ? (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 flex items-start gap-3 text-xs">
              <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-200">
                  Next Follow-Up Scheduled: 10 November 2026
                </div>
                <p className="text-slate-300">
                  Reason: Knee Osteoarthritis review with bilateral standing X-Ray reports.
                </p>
                <p className="text-[11px] text-amber-400/80 font-mono">
                  Attending Doctor: Dr. Arvind Patil, MS (Ortho) • Parasnath Clinic Badlapur
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  No upcoming follow-up appointments scheduled at this moment.
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Parasnath Clinic • OPD Badlapur
              </span>
            </div>
          )}

          {/* My Consultations & Approved Prescriptions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">
                  My Prescriptions & Clinical Documents
                </h3>
                <p className="text-xs text-slate-400">
                  Per Indian DPDP Act rules, only documents approved and signed by your attending doctor are unlocked.
                </p>
              </div>
            </div>

            {consultations.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-purple-950/80 border border-purple-800/40 text-purple-400 flex items-center justify-center mx-auto">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white">No Consultations Recorded Yet</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Namaste {displayName}! Your registration is active in the clinic database. When you visit Parasnath Speciality Clinic, your doctor's clinical case papers and approved prescriptions will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map(c => {
                  const isApproved = c.status === 'approved';

                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              Consultation on {c.date}
                            </span>
                            <span className="text-[10px] font-mono text-purple-400">
                              ({c.id})
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Doctor: {c.doctorName} • Complaint: {c.casePaper?.chiefComplaints || 'Outpatient Examination'}
                          </p>
                        </div>

                        <div>
                          {isApproved ? (
                            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Doctor Signed & Approved</span>
                            </span>
                          ) : (
                            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>In Review with Doctor</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Prescribed Medicines Summary */}
                      {c.prescription?.medicines && c.prescription.medicines.length > 0 && (
                        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                          <div className="font-bold text-emerald-400 text-[11px] uppercase">
                            Prescribed Medications ({c.prescription.medicines.length}):
                          </div>
                          <div className="space-y-1">
                            {c.prescription.medicines.map(m => (
                              <div key={m.id} className="text-slate-300 flex items-center justify-between text-[11px]">
                                <span>• <strong>{m.name}</strong> ({m.dosage})</span>
                                <span className="text-slate-400 font-mono">{m.frequency} • {m.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Download PDF Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <span className="text-slate-400 text-[11px]">
                          {isApproved ? 'Official clinic documents ready' : 'PDF locked until doctor approval'}
                        </span>

                        <div className="flex items-center gap-2">
                          {isApproved ? (
                            <>
                              <button
                                onClick={() => handleDownloadCasePaper(c)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span>Download Case Paper</span>
                              </button>

                              <button
                                onClick={() => handleDownloadRx(c)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span>Download Prescription</span>
                              </button>
                            </>
                          ) : (
                            <div className="text-amber-400 text-xs font-medium italic">
                              ⏳ Locked (Awaiting Doctor sign-off)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
