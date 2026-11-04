'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Patient,
  Consultation,
  FollowUp,
  UserRole,
  LanguageCode,
  Doctor,
  CasePaper,
  Prescription,
  MedicineItem,
  HealthQuestionnaire,
  AppSettings
} from '@/types';
import { clinicStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Sidebar, NavItemKey } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { PatientManagementView } from '@/components/PatientManagementView';
import { VoiceAssistantView } from '@/components/VoiceAssistantView';
import { ApprovalsView } from '@/components/ApprovalsView';
import { PatientCRMView } from '@/components/PatientCRMView';
import { FollowUpView } from '@/components/FollowUpView';
import { SettingsView } from '@/components/SettingsView';
import { QuestionnaireModal } from '@/components/QuestionnaireModal';
import { Lock, ShieldAlert } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Store state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [currentBranch, setCurrentBranch] = useState('Badlapur Central');
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

  // Navigation
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [activeConsultationId, setActiveConsultationId] = useState<string | null>('CON-2026-0101');
  const [selectedPatientForAction, setSelectedPatientForAction] = useState<Patient | null>(null);

  // Modal
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  // Current logged in doctor profile
  const currentDoctor: Doctor = {
    id: 'DOC-01',
    name: sessionUser?.name || 'Dr. Arvind Patil',
    qualifications: 'MBBS, MS (Orthopaedics), DNB',
    speciality: 'Senior Orthopaedic Consultant & Joint Specialist',
    regNo: sessionUser?.regNo || 'MMC-2014-08976',
    branch: sessionUser?.branch || currentBranch,
    role: 'doctor',
    avatar: '👨‍⚕️'
  };

  useEffect(() => {
    setIsClient(true);

    // Authentication Guard: strictly verify session before showing any medical views
    const rawSession = typeof window !== 'undefined' ? localStorage.getItem('parasnath_session_user') : null;
    if (!rawSession) {
      setIsCheckingAuth(false);
      setIsAuthenticated(false);
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(rawSession);
      if (!user || !user.role) {
        throw new Error('Invalid session format');
      }

      setSessionUser(user);
      setIsAuthenticated(true);
      setIsCheckingAuth(false);

      // Route non-admin roles to their dedicated role portals
      if (user.role === 'doctor') {
        router.replace('/doctor');
        return;
      } else if (user.role === 'receptionist') {
        router.replace('/receptionist');
        return;
      } else if (user.role === 'patient') {
        router.replace('/patient');
        return;
      }

      // For Admin/Superadmin: set up master multi-module workspace
      clinicStore.setRole('admin');
      setCurrentRole('admin');
      if (user.branch && !user.branch.includes('All Branches')) {
        setCurrentBranch(user.branch);
      }

      const syncStore = () => {
        setPatients([...clinicStore.getPatients()]);
        setConsultations([...clinicStore.getConsultations()]);
        setFollowUps([...clinicStore.getFollowUps()]);
        setCurrentLanguage(clinicStore.getCurrentLanguage());
        setSettings({ ...clinicStore.getSettings() });
      };

      syncStore();
      const unsubscribe = clinicStore.subscribe(syncStore);
      return () => {
        unsubscribe();
      };
    } catch {
      localStorage.removeItem('parasnath_session_user');
      setIsCheckingAuth(false);
      setIsAuthenticated(false);
      router.replace('/login');
    }
  }, [router]);

  // If unauthenticated or checking auth: NEVER render navbar, sidebar, or dashboard
  if (!isClient || isCheckingAuth || !isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center shadow-lg shadow-purple-950">
            <Lock className="w-7 h-7 text-purple-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-white">Parasnath AI Security Gate</h2>
            <p className="text-xs text-slate-400">
              Unauthenticated access blocked. Redirecting to clinical sign in portal...
            </p>
          </div>
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Live counted KPIs
  const kpis = clinicStore.getDashboardKPIs();

  // Handlers
  const handleRoleChange = (role: UserRole) => {
    clinicStore.setRole(role);
    setCurrentRole(role);
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    clinicStore.setLanguage(lang);
    setCurrentLanguage(lang);
  };

  const handleBranchChange = (branch: string) => {
    setCurrentBranch(branch);
  };

  const handleRegisterPatient = (patientData: Omit<Patient, 'id' | 'registeredDate'>) => {
    return clinicStore.registerPatient(patientData);
  };

  const handleStartConsultationForPatient = (patient: Patient) => {
    setSelectedPatientForAction(patient);
    setActiveTab('voice_assistant');
  };

  const handleOpenQuestionnaireForPatient = (patient: Patient) => {
    setSelectedPatientForAction(patient);
    setIsQuestionnaireOpen(true);
  };

  const handleSaveIntake = (intake: HealthQuestionnaire) => {
    clinicStore.addAuditLog('create', `Saved pre-consultation intake for ${intake.patientId} (${intake.category})`);
    alert(`Health questionnaire attached to patient ${intake.patientId}. You can now start voice consultation!`);
    setActiveTab('voice_assistant');
  };

  const handleViewPatientTimeline = (patientId: string) => {
    const p = patients.find(item => item.id === patientId);
    if (p) setSelectedPatientForAction(p);
    setActiveTab('crm');
  };

  const handleSaveConsultationDraft = (consultation: Consultation) => {
    clinicStore.saveConsultation(consultation);
    setActiveConsultationId(consultation.id);
  };

  const handleApproveConsultation = (id: string, docName: string) => {
    const res = clinicStore.approveConsultation(id, docName);
    if (res.success) {
      alert(`✅ Consultation approved by ${docName}!\nOfficial Case Paper and Prescription PDFs are now unlocked and stored in the patient's record.`);
    } else {
      alert(res.message);
    }
  };

  const handleRejectConsultation = (id: string, reason: string) => {
    clinicStore.rejectConsultation(id, reason);
    alert(`Consultation rejected and flagged for doctor review.`);
  };

  const handleUpdateCasePaper = (id: string, casePaper: Partial<CasePaper>) => {
    clinicStore.updateCasePaper(id, casePaper);
  };

  const handleUpdatePrescription = (id: string, medicines: MedicineItem[], instructions: string[], followUpDate: string) => {
    clinicStore.updatePrescription(id, medicines, instructions, followUpDate);
  };

  const handleSendReminder = (followUpId: string) => {
    clinicStore.recordFollowUpReminder(followUpId);
  };

  const handleResetDemo = () => {
    if (confirm('Reset demo data to initial state? The unapproved knee-pain consultation will be restored in Approvals queue.')) {
      clinicStore.resetDemoData();
      setActiveConsultationId('CON-2026-0101');
      alert('Demo data reset! Ramesh Joshi knee-pain case is ready in Approvals queue.');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        currentLanguage={currentLanguage}
        onRoleChange={handleRoleChange}
        onLanguageChange={handleLanguageChange}
        onOpenSettings={() => setActiveTab('settings')}
        aiProvider={settings.aiProvider}
        aiModel={settings.aiModel}
        currentBranch={currentBranch}
        onBranchChange={handleBranchChange}
        sessionUserName={sessionUser?.name}
        sessionUserEmail={sessionUser?.email}
      />

      {/* Main Workspace: Fixed Sidebar + Scrollable Content View */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full">
        {/* Module Sidebar (Permanently Stationary) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentRole={currentRole}
          currentLanguage={currentLanguage}
          pendingApprovalsCount={kpis.pendingApprovals}
          followUpsCount={kpis.followUpsDue}
          onResetDemo={handleResetDemo}
        />

        {/* Dynamic Content Panel (Independently Scrollable) */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentRole={currentRole}
              currentLanguage={currentLanguage}
              kpis={kpis}
              recentConsultations={consultations}
              patients={patients}
              followUps={followUps}
              onNavigate={setActiveTab}
              onSelectConsultation={(id) => {
                setActiveConsultationId(id);
              }}
            />
          )}

          {activeTab === 'patients' && (
            <PatientManagementView
              patients={patients}
              onRegisterPatient={handleRegisterPatient}
              onStartConsultationForPatient={handleStartConsultationForPatient}
              onOpenQuestionnaireForPatient={handleOpenQuestionnaireForPatient}
              onViewPatientTimeline={handleViewPatientTimeline}
              currentRole={currentRole}
              currentLanguage={currentLanguage}
              currentBranch={currentBranch}
            />
          )}

          {activeTab === 'questionnaire' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-revonix-850 border border-revonix-700/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Module 2: Health Questionnaire</h3>
                  <p className="text-xs text-slate-400">
                    Patient pre-consultation intake. Select a patient to record intake questionnaire.
                  </p>
                </div>
                <button
                  onClick={() => setIsQuestionnaireOpen(true)}
                  className="px-4 py-2 rounded-xl bg-revonix-purple-600 hover:bg-revonix-500 text-white font-bold text-xs"
                >
                  Open Adaptive Questionnaire
                </button>
              </div>

              <PatientManagementView
                patients={patients}
                onRegisterPatient={handleRegisterPatient}
                onStartConsultationForPatient={handleStartConsultationForPatient}
                onOpenQuestionnaireForPatient={handleOpenQuestionnaireForPatient}
                onViewPatientTimeline={handleViewPatientTimeline}
                currentRole={currentRole}
                currentLanguage={currentLanguage}
                currentBranch={currentBranch}
              />
            </div>
          )}

          {activeTab === 'voice_assistant' && (
            <VoiceAssistantView
              currentPatient={selectedPatientForAction}
              allPatients={patients}
              onSelectPatient={setSelectedPatientForAction}
              currentDoctor={currentDoctor}
              onSaveConsultationDraft={handleSaveConsultationDraft}
              onProceedToApproval={(id) => {
                setActiveConsultationId(id);
                setActiveTab('approvals');
              }}
              currentRole={currentRole}
              currentLanguage={currentLanguage}
              aiProvider={settings.aiProvider}
              aiModel={settings.aiModel}
            />
          )}

          {(activeTab === 'approvals' || activeTab === 'case_paper' || activeTab === 'prescription') && (
            <ApprovalsView
              consultations={consultations}
              activeConsultationId={activeConsultationId}
              onSelectConsultation={setActiveConsultationId}
              onApproveConsultation={handleApproveConsultation}
              onRejectConsultation={handleRejectConsultation}
              onUpdateCasePaper={handleUpdateCasePaper}
              onUpdatePrescription={handleUpdatePrescription}
              currentDoctor={currentDoctor}
              currentRole={currentRole}
              currentLanguage={currentLanguage}
              onNavigateToView={setActiveTab}
            />
          )}

          {activeTab === 'crm' && (
            <PatientCRMView
              patients={patients}
              consultations={consultations}
              followUps={followUps}
              currentRole={currentRole}
              currentLanguage={currentLanguage}
              onSelectConsultation={setActiveConsultationId}
              onNavigateToView={setActiveTab}
            />
          )}

          {activeTab === 'followups' && (
            <FollowUpView
              followUps={followUps}
              onSendReminder={handleSendReminder}
              currentRole={currentRole}
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSettings) => {
                clinicStore.updateSettings(newSettings);
                setSettings({ ...clinicStore.getSettings() });
              }}
              currentLanguage={currentLanguage}
            />
          )}
          </div>
        </main>
      </div>

      {/* Health Questionnaire Modal */}
      <QuestionnaireModal
        patient={selectedPatientForAction || patients[0]}
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onSaveIntake={handleSaveIntake}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}
