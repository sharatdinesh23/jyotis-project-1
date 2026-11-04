'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Consultation,
  Patient,
  FollowUp,
  AppSettings,
  AuditLog
} from '@/types';
import { DashboardView } from '@/components/DashboardView';
import { PatientCRMView } from '@/components/PatientCRMView';
import { SettingsView } from '@/components/SettingsView';
import {
  LayoutDashboard,
  Users2,
  Settings,
  ShieldCheck,
  LogOut,
  Building,
  FileSpreadsheet,
  FileText,
  Lock
} from 'lucide-react';
import { exportCRMToExcel } from '@/lib/excelExport';

export default function AdminWorkspacePage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'settings'>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [kpis, setKpis] = useState({
    totalPatients: 3,
    todayConsultations: 1,
    totalDoctors: 2,
    pendingApprovals: 1,
    completedPrescriptions: 1,
    followUpsDue: 3,
    overdueFollowUps: 1
  });
  const [settings, setSettings] = useState<AppSettings>({
    aiProvider: 'mock',
    aiModel: 'gpt-4o',
    transcriptionProvider: 'mock',
    hasOpenAIKey: false,
    hasOpenRouterKey: false,
    hasDeepgramKey: false,
    hasGeminiKey: false,
    activeBranch: 'Badlapur Central',
    language: 'en'
  });

  useEffect(() => {
    // Auth Guard
    const raw = typeof window !== 'undefined' ? localStorage.getItem('parasnath_session_user') : null;
    if (!raw) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(raw);
      if (user.role !== 'admin') {
        if (user.role === 'doctor') router.replace('/doctor');
        else if (user.role === 'receptionist') router.replace('/receptionist');
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

    fetch('/api/dashboard/kpis')
      .then(res => res.json())
      .then(data => { if (data) setKpis(data); });

    fetch('/api/patients')
      .then(res => res.json())
      .then(data => { if (data.patients) setPatients(data.patients); });

    fetch('/api/consultations')
      .then(res => res.json())
      .then(data => { if (data.consultations) setConsultations(data.consultations); });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('parasnath_session_user');
    router.push('/login');
  };

  if (isCheckingAuth || !sessionUser) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center shadow-lg shadow-indigo-950">
            <Lock className="w-7 h-7 text-indigo-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-white">Administrator Authorization</h2>
            <p className="text-xs text-slate-400">Verifying administrative credentials. Redirecting...</p>
          </div>
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Admin Header */}
      <header className="h-16 flex-shrink-0 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white">Head Office Command Center</span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded border border-indigo-800/60">
                {sessionUser?.name || 'Administrator'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Revonix Solution • Multi-Branch Governance, CRM & SQLite Database
            </p>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>KPI Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'crm'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>Clinic CRM & Export</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>AI Models & .env</span>
            </button>
          </div>

          <button
            onClick={() => exportCRMToExcel(patients, consultations, followUps)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>

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

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
        <div className="max-w-6xl mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentRole="admin"
              currentLanguage="en"
              kpis={kpis}
              recentConsultations={consultations}
              patients={patients}
              followUps={followUps}
              onNavigate={(tab) => {
                if (tab === 'crm') setActiveTab('crm');
                else if (tab === 'settings') setActiveTab('settings');
                else router.push('/doctor');
              }}
              onSelectConsultation={() => router.push('/doctor')}
            />
          )}

          {activeTab === 'crm' && (
            <PatientCRMView
              patients={patients}
              consultations={consultations}
              followUps={followUps}
              currentRole="admin"
              currentLanguage="en"
              onSelectConsultation={() => router.push('/doctor')}
              onNavigateToView={(tab) => setActiveTab(tab === 'dashboard' ? 'dashboard' : 'crm')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSet) => setSettings({ ...settings, ...newSet })}
              currentLanguage="en"
            />
          )}
        </div>
      </main>
    </div>
  );
}

