'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Patient, FollowUp, HealthQuestionnaire } from '@/types';
import { PatientManagementView } from '@/components/PatientManagementView';
import { FollowUpView } from '@/components/FollowUpView';
import { QuestionnaireModal } from '@/components/QuestionnaireModal';
import {
  ClipboardList,
  UserPlus,
  CalendarClock,
  LogOut,
  Activity,
  Users,
  Lock
} from 'lucide-react';

export default function ReceptionistWorkspacePage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'patients' | 'followups'>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  useEffect(() => {
    // Auth Guard
    const raw = typeof window !== 'undefined' ? localStorage.getItem('parasnath_session_user') : null;
    if (!raw) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(raw);
      if (user.role !== 'receptionist' && user.role !== 'admin') {
        if (user.role === 'doctor') router.replace('/doctor');
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

    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        if (data.patients) setPatients(data.patients);
      });

    // Mock initial follow-ups for receptionist
    setFollowUps([
      {
        id: 'FU-01',
        patientId: 'PSC-2026-0084',
        patientName: 'Ramesh Joshi',
        patientMobile: '+91 98201 23456',
        consultationId: 'CON-2026-0101',
        dueDate: '2026-11-10',
        reason: 'Knee Osteoarthritis check with X-Ray reports',
        reminderCount: 0,
        status: 'due'
      },
      {
        id: 'FU-02',
        patientId: 'PSC-2026-0085',
        patientName: 'Priya Deshmukh',
        patientMobile: '+91 97654 32109',
        consultationId: 'CON-2026-0099',
        dueDate: '2026-11-05',
        reason: 'Postural Lumbar Strain review',
        reminderCount: 1,
        lastReminderAt: '2026-11-04T09:30:00Z',
        status: 'due'
      },
      {
        id: 'FU-03',
        patientId: 'PSC-2026-0086',
        patientName: 'Anand Shinde',
        patientMobile: '+91 98902 11223',
        consultationId: 'CON-2026-0088',
        dueDate: '2026-11-02',
        reason: 'Blood Pressure & routine lab review',
        reminderCount: 2,
        lastReminderAt: '2026-11-01T10:00:00Z',
        status: 'overdue'
      }
    ]);
  }, []);

  const handleRegisterPatient = async (pData: Omit<Patient, 'id' | 'registeredDate'>) => {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pData),
    });
    const result = await res.json();
    if (result.patient) {
      if (!result.isDuplicate) {
        setPatients([result.patient, ...patients]);
      }
    }
    return result;
  };

  const handleSendReminder = (id: string) => {
    const updated = followUps.map(f => {
      if (f.id === id) {
        return {
          ...f,
          reminderCount: f.reminderCount + 1,
          lastReminderAt: new Date().toISOString()
        };
      }
      return f;
    });
    setFollowUps(updated);
  };

  const handleSaveIntake = (intake: HealthQuestionnaire) => {
    alert(`Pre-consultation intake recorded for patient ${intake.patientId} (${intake.category}). Attaching to doctor's queue!`);
    setIsQuestionnaireOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('parasnath_session_user');
    router.push('/login');
  };

  if (isCheckingAuth || !sessionUser) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center shadow-lg shadow-cyan-950">
            <Lock className="w-7 h-7 text-cyan-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-white">Reception Portal Authorization</h2>
            <p className="text-xs text-slate-400">Verifying front desk credentials. Redirecting...</p>
          </div>
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Receptionist Header */}
      <header className="h-16 flex-shrink-0 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white">Front Desk Reception Workspace</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded border border-cyan-800/60">
                Sunita Sharma (Front Desk)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Patient Intake, Unique Patient ID Spine & Follow-Up Reminders
            </p>
          </div>
        </div>

        {/* Reception Navigation Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('patients')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'patients'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Patient Registration ({patients.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('followups')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'followups'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Follow-ups ({followUps.length})</span>
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

      {/* Main Receptionist Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
        <div className="max-w-6xl mx-auto space-y-6">
          {activeTab === 'patients' && (
            <PatientManagementView
              patients={patients}
              onRegisterPatient={handleRegisterPatient}
              onStartConsultationForPatient={(p) => {
                alert(`Patient ${p.name} queued for doctor consultation.`);
              }}
              onOpenQuestionnaireForPatient={(p) => {
                setSelectedPatient(p);
                setIsQuestionnaireOpen(true);
              }}
              onViewPatientTimeline={(pId) => {
                alert(`Viewing profile for ${pId}`);
              }}
              currentRole="receptionist"
              currentLanguage="en"
              currentBranch="Badlapur Central"
            />
          )}

          {activeTab === 'followups' && (
            <FollowUpView
              followUps={followUps}
              onSendReminder={handleSendReminder}
              currentRole="receptionist"
              currentLanguage="en"
            />
          )}
        </div>
      </main>

      <QuestionnaireModal
        patient={selectedPatient || patients[0]}
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onSaveIntake={handleSaveIntake}
        currentLanguage="en"
      />
    </div>
  );
}

