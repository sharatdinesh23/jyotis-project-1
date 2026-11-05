'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Consultation,
  Patient,
  Doctor,
  CasePaper,
  MedicineItem,
  LanguageCode
} from '@/types';
import { VoiceAssistantView } from '@/components/VoiceAssistantView';
import { ApprovalsView } from '@/components/ApprovalsView';
import {
  Stethoscope,
  Mic,
  ShieldCheck,
  FileText,
  Clock,
  LogOut,
  Sparkles,
  User,
  Activity,
  Calendar,
  AlertCircle,
  Lock
} from 'lucide-react';

export default function DoctorWorkspacePage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'queue' | 'voice' | 'approvals' | 'intakes'>('approvals');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientVoiceNotes, setPatientVoiceNotes] = useState<any[]>([]);
  const [activeConsultationId, setActiveConsultationId] = useState<string | null>('CON-2026-0101');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [settings, setSettings] = useState<any>({
    aiProvider: 'gemini',
    aiModel: 'gemini-3.5-flash',
    transcriptionProvider: 'groq'
  });

  const currentDoctor: Doctor = {
    id: sessionUser?.id || 'DOC-01',
    name: sessionUser?.name || 'Dr. Arvind Patil',
    qualifications: 'MBBS, MS (Orthopaedics), DNB',
    speciality: 'Senior Orthopaedic Consultant & Joint Specialist',
    regNo: sessionUser?.regNo || 'MMC-2014-08976',
    branch: sessionUser?.branch || 'Badlapur Central',
    role: 'doctor',
    avatar: '👨‍⚕️'
  };

  useEffect(() => {
    // Auth Guard
    const raw = typeof window !== 'undefined' ? localStorage.getItem('parasnath_session_user') : null;
    if (!raw) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(raw);
      if (user.role !== 'doctor' && user.role !== 'admin') {
        if (user.role === 'receptionist') router.replace('/receptionist');
        else if (user.role === 'patient') router.replace('/patient');
        else router.replace('/login');
        return;
      }
      setSessionUser(user);
      setIsCheckingAuth(false);
    } catch {
      localStorage.removeItem('parasnath_session_user');
      router.replace('/login');
      return;
    }

    fetch('/api/consultations')
      .then(res => res.json())
      .then(data => {
        if (data.consultations) setConsultations(data.consultations);
      });

    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        if (data.patients) {
          setPatients(data.patients);
          setSelectedPatient(data.patients[0]);
        }
      });

    fetch('/api/patient-voice-notes')
      .then(res => res.json())
      .then(data => {
        if (data.voiceNotes) setPatientVoiceNotes(data.voiceNotes);
      });

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          aiProvider: data.aiProvider || 'gemini',
          aiModel: data.aiModel || 'gemini-3.5-flash',
          transcriptionProvider: data.transcriptionProvider || 'groq'
        });
      })
      .catch(() => {});
  }, [router]);

  if (isCheckingAuth || !sessionUser) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center shadow-lg shadow-purple-950">
            <Lock className="w-7 h-7 text-purple-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-white">Doctor Workspace Authorization</h2>
            <p className="text-xs text-slate-400">Verifying clinical credentials. Redirecting...</p>
          </div>
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const handleApprove = async (id: string, docName: string) => {
    const res = await fetch(`/api/consultations/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorName: docName, role: 'doctor' }),
    });

    if (res.ok) {
      alert(`✅ Consultation ${id} approved and signed by ${docName}!\nOfficial Case Paper and Prescription PDFs are now unlocked.`);
      // Refresh
      const refreshRes = await fetch('/api/consultations');
      const data = await refreshRes.json();
      if (data.consultations) setConsultations(data.consultations);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    alert(`Consultation rejected. Reason: ${reason}`);
  };

  const handleUpdateCasePaper = async (id: string, casePaper: Partial<CasePaper>) => {
    await fetch(`/api/consultations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ casePaper }),
    });
  };

  const handleUpdatePrescription = async (id: string, medicines: MedicineItem[]) => {
    await fetch(`/api/consultations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prescription: { medicines } }),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('parasnath_session_user');
    router.push('/login');
  };

  const pendingCount = consultations.filter(c => c.status === 'pending_approval').length;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Doctor Header */}
      <header className="h-16 flex-shrink-0 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white">Doctor Clinical Workspace</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 font-mono font-bold px-2 py-0.5 rounded border border-purple-800/60">
                Dr. Arvind Patil (MS Ortho)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              License: MMC-2014-08976 • Badlapur Central Outpatient Clinic
            </p>
          </div>
        </div>

        {/* Doctor Navigation Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('approvals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'approvals'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approvals Queue</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'voice'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Consultation</span>
            </button>

            <button
              onClick={() => setActiveTab('intakes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'intakes'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Patient Voice Notes</span>
              {patientVoiceNotes.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-400 text-slate-950 font-black">
                  {patientVoiceNotes.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => router.push('/')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            All Modules
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

      {/* Main Doctor Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
        <div className="max-w-6xl mx-auto space-y-6">
          {activeTab === 'approvals' && (
            <ApprovalsView
              consultations={consultations}
              activeConsultationId={activeConsultationId}
              onSelectConsultation={setActiveConsultationId}
              onApproveConsultation={handleApprove}
              onRejectConsultation={handleReject}
              onUpdateCasePaper={handleUpdateCasePaper}
              onUpdatePrescription={handleUpdatePrescription}
              currentDoctor={currentDoctor}
              currentRole="doctor"
              currentLanguage="en"
              onNavigateToView={(tab) => setActiveTab(tab === 'voice_assistant' ? 'voice' : 'approvals')}
            />
          )}

          {activeTab === 'voice' && (
            <VoiceAssistantView
              currentPatient={selectedPatient}
              allPatients={patients}
              onSelectPatient={setSelectedPatient}
              currentDoctor={currentDoctor}
              onSaveConsultationDraft={(c) => {
                setConsultations([c, ...consultations]);
                setActiveConsultationId(c.id);
                setActiveTab('approvals');
              }}
              onProceedToApproval={(id) => {
                setActiveConsultationId(id);
                setActiveTab('approvals');
              }}
              currentRole="doctor"
              currentLanguage="en"
              aiProvider={settings.aiProvider || 'gemini'}
              aiModel={settings.aiModel || 'gemini-3.5-flash'}
              transcriptionProvider={settings.transcriptionProvider || 'groq'}
            />
          )}

          {activeTab === 'intakes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <Mic className="w-5 h-5 text-cyan-400" />
                    <span>Patient Health Voice Notes & Intake Recordings</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Patients recorded these symptom voice notes in Marathi, Hindi, or English prior to consultation.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-800/60">
                  {patientVoiceNotes.length} Voice Notes Received
                </span>
              </div>

              {patientVoiceNotes.length === 0 ? (
                <div className="p-10 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
                  No patient voice notes recorded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {patientVoiceNotes.map((vn) => {
                    const matchedPatient = patients.find((p) => p.id === vn.patientId);

                    return (
                      <div
                        key={vn.id}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                              {vn.patientName?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">
                                  {vn.patientName}
                                </span>
                                <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800/60">
                                  {vn.patientId}
                                </span>
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                  {vn.language}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">
                                Mobile: {vn.patientMobile} • Recorded: {new Date(vn.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (matchedPatient) {
                                setSelectedPatient(matchedPatient);
                              }
                              setActiveTab('voice');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-all active:scale-95 self-start sm:self-auto"
                          >
                            <Mic className="w-3.5 h-3.5" />
                            <span>Start Consultation With Patient</span>
                          </button>
                        </div>

                        {/* Chief Issue */}
                        <div className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
                          <span>Primary Complaint:</span>
                          <span className="text-white font-normal">{vn.chiefIssue}</span>
                        </div>

                        {/* AI Speech Transcript Box */}
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                          <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Speech-to-Text Transcription ({vn.language.toUpperCase()}):</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed italic">
                            "{vn.transcription}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

