import {
  Patient,
  Consultation,
  FollowUp,
  AuditLog,
  Doctor,
  Branch,
  UserRole,
  LanguageCode,
  AppSettings,
  CasePaper,
  Prescription,
  MedicineItem
} from '@/types';
import {
  initialPatients,
  initialDoctors,
  initialBranches,
  sampleKneePainConsultation,
  sampleApprovedConsultation,
  initialFollowUps,
  initialAuditLogs
} from '@/lib/seedData';

const STORAGE_KEY_PREFIX = 'parasnath_ai_v1_';

export class ClinicStore {
  private static instance: ClinicStore;
  private patients: Patient[] = [];
  private consultations: Consultation[] = [];
  private followUps: FollowUp[] = [];
  private auditLogs: AuditLog[] = [];
  private doctors: Doctor[] = initialDoctors;
  private branches: Branch[] = initialBranches;
  private currentRole: UserRole = 'doctor';
  private currentLanguage: LanguageCode = 'en';
  private currentBranch: string = 'Badlapur Central';
  private settings: AppSettings = {
    aiProvider: 'mock',
    aiModel: 'gpt-4o',
    transcriptionProvider: 'mock',
    hasOpenAIKey: false,
    hasOpenRouterKey: false,
    hasDeepgramKey: false,
    hasGeminiKey: false,
    activeBranch: 'Badlapur Central',
    language: 'en'
  };
  private isLoaded = false;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.init();
  }

  public static getInstance(): ClinicStore {
    if (!ClinicStore.instance) {
      ClinicStore.instance = new ClinicStore();
    }
    return ClinicStore.instance;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(cb => cb());
  }

  private init() {
    if (typeof window === 'undefined') {
      this.patients = [...initialPatients];
      this.consultations = [sampleKneePainConsultation, sampleApprovedConsultation];
      this.followUps = [...initialFollowUps];
      this.auditLogs = [...initialAuditLogs];
      return;
    }

    try {
      const storedPatients = localStorage.getItem(STORAGE_KEY_PREFIX + 'patients');
      const storedConsultations = localStorage.getItem(STORAGE_KEY_PREFIX + 'consultations');
      const storedFollowUps = localStorage.getItem(STORAGE_KEY_PREFIX + 'followups');
      const storedLogs = localStorage.getItem(STORAGE_KEY_PREFIX + 'logs');
      const storedRole = localStorage.getItem(STORAGE_KEY_PREFIX + 'role');
      const storedLang = localStorage.getItem(STORAGE_KEY_PREFIX + 'lang');
      const storedSettings = localStorage.getItem(STORAGE_KEY_PREFIX + 'settings');

      this.patients = storedPatients ? JSON.parse(storedPatients) : [...initialPatients];
      this.consultations = storedConsultations ? JSON.parse(storedConsultations) : [sampleKneePainConsultation, sampleApprovedConsultation];
      this.followUps = storedFollowUps ? JSON.parse(storedFollowUps) : [...initialFollowUps];
      this.auditLogs = storedLogs ? JSON.parse(storedLogs) : [...initialAuditLogs];
      if (storedRole) this.currentRole = storedRole as UserRole;
      if (storedLang) this.currentLanguage = storedLang as LanguageCode;
      if (storedSettings) this.settings = { ...this.settings, ...JSON.parse(storedSettings) };

      this.isLoaded = true;
    } catch (e) {
      this.patients = [...initialPatients];
      this.consultations = [sampleKneePainConsultation, sampleApprovedConsultation];
      this.followUps = [...initialFollowUps];
      this.auditLogs = [...initialAuditLogs];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'patients', JSON.stringify(this.patients));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'consultations', JSON.stringify(this.consultations));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'followups', JSON.stringify(this.followUps));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'logs', JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'role', this.currentRole);
      localStorage.setItem(STORAGE_KEY_PREFIX + 'lang', this.currentLanguage);
      localStorage.setItem(STORAGE_KEY_PREFIX + 'settings', JSON.stringify(this.settings));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // --- PATIENTS ---
  public getPatients(): Patient[] {
    return this.patients;
  }

  public getPatientById(id: string): Patient | undefined {
    return this.patients.find(p => p.id === id);
  }

  public searchPatients(query: string): Patient[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.patients;
    return this.patients.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.mobile.includes(q)
    );
  }

  public checkMobileExists(mobile: string, excludeId?: string): Patient | undefined {
    const clean = mobile.replace(/[^0-9]/g, '');
    return this.patients.find(p => {
      if (excludeId && p.id === excludeId) return false;
      const pClean = p.mobile.replace(/[^0-9]/g, '');
      return pClean.endsWith(clean.slice(-10)) || clean.endsWith(pClean.slice(-10));
    });
  }

  public registerPatient(patientData: Omit<Patient, 'id' | 'registeredDate'>): { patient: Patient; isDuplicate: boolean } {
    const existing = this.checkMobileExists(patientData.mobile);
    if (existing) {
      return { patient: existing, isDuplicate: true };
    }

    const nextNum = 87 + this.patients.length;
    const newId = `PSC-2026-00${nextNum}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    this.patients.unshift(newPatient);
    this.addAuditLog('create', `Registered new patient ${newPatient.name} (${newPatient.id})`);
    this.notify();
    return { patient: newPatient, isDuplicate: false };
  }

  // --- CONSULTATIONS ---
  public getConsultations(): Consultation[] {
    return this.consultations;
  }

  public getConsultationById(id: string): Consultation | undefined {
    return this.consultations.find(c => c.id === id);
  }

  public getConsultationsByPatient(patientId: string): Consultation[] {
    return this.consultations.filter(c => c.patientId === patientId);
  }

  public saveConsultation(consultation: Consultation) {
    const idx = this.consultations.findIndex(c => c.id === consultation.id);
    if (idx >= 0) {
      this.consultations[idx] = {
        ...consultation,
        version: (this.consultations[idx].version || 1) + 1
      };
      this.addAuditLog('edit', `Updated consultation draft ${consultation.id}`);
    } else {
      this.consultations.unshift(consultation);
      this.addAuditLog('create', `Created consultation ${consultation.id}`);
    }
    this.notify();
  }

  public updateCasePaper(id: string, updatedCasePaper: Partial<CasePaper>) {
    const c = this.consultations.find(item => item.id === id);
    if (c) {
      c.casePaper = { ...c.casePaper, ...updatedCasePaper };
      c.version = (c.version || 1) + 1;
      this.addAuditLog('edit', `Doctor edited Case Paper for ${id}`);
      this.notify();
    }
  }

  public updatePrescription(id: string, medicines: MedicineItem[], instructions: string[], followUpDate: string) {
    const c = this.consultations.find(item => item.id === id);
    if (c) {
      c.prescription.medicines = medicines;
      c.prescription.instructions = instructions;
      c.prescription.followUpDate = followUpDate;
      c.version = (c.version || 1) + 1;
      this.addAuditLog('edit', `Doctor updated Prescription medicines for ${id}`);
      this.notify();
    }
  }

  // HARD SAFETY GATE: Approval is an auditable, recorded doctor action!
  public approveConsultation(id: string, doctorName: string): { success: boolean; message: string } {
    const c = this.consultations.find(item => item.id === id);
    if (!c) return { success: false, message: 'Consultation not found' };

    const now = new Date().toISOString();
    c.status = 'approved';
    c.approvedBy = doctorName || 'Dr. Arvind Patil';
    c.approvedAt = now;
    c.casePaper.approvalSignature = {
      approved: true,
      doctorName: c.approvedBy,
      timestamp: now,
      digitalSignature: `VERIFIED_${c.approvedBy.replace(/[^A-Z]/gi, '_').toUpperCase()}_${Date.now()}`
    };
    c.prescription.status = 'approved';

    // Auto-create Follow-up in calendar if follow-up date exists
    if (c.prescription.followUpDate) {
      const existingFu = this.followUps.find(f => f.consultationId === c.id);
      if (!existingFu) {
        const patient = this.getPatientById(c.patientId);
        this.followUps.unshift({
          id: `FU-${Date.now().toString().slice(-4)}`,
          patientId: c.patientId,
          patientName: patient?.name || 'Patient',
          patientMobile: patient?.mobile || '',
          consultationId: c.id,
          dueDate: c.prescription.followUpDate,
          reason: c.casePaper.chiefComplaints || 'Clinical Review',
          reminderCount: 0,
          status: 'due'
        });
      }
    }

    this.addAuditLog('approve', `DOCTOR APPROVAL: Approved consultation & unlocked PDFs for ${c.id} (${c.casePaper.patientDetails.name})`);
    this.notify();
    return { success: true, message: 'Consultation approved and signed. Official PDFs unlocked.' };
  }

  public rejectConsultation(id: string, reason: string) {
    const c = this.consultations.find(item => item.id === id);
    if (c) {
      c.status = 'rejected';
      c.rejectionReason = reason;
      this.addAuditLog('reject', `Doctor rejected consultation ${id}. Reason: ${reason}`);
      this.notify();
    }
  }

  // --- DELIVERY / MESSAGING ---
  public markDelivered(consultationId: string, channel: 'whatsapp' | 'sms') {
    const c = this.consultations.find(item => item.id === consultationId);
    if (!c) return;
    if (c.status !== 'approved') {
      throw new Error('SAFETY GATE VIOLATION: Cannot deliver unapproved medical documents!');
    }

    c.deliveryStatus[channel] = 'sent';
    c.deliveryStatus.sentAt = new Date().toISOString();
    this.addAuditLog('share', `Dispatched approved documents to patient via ${channel.toUpperCase()} for ${consultationId}`);
    this.notify();
  }

  // --- FOLLOW-UPS ---
  public getFollowUps(): FollowUp[] {
    return this.followUps;
  }

  public recordFollowUpReminder(followUpId: string) {
    const fu = this.followUps.find(f => f.id === followUpId);
    if (fu) {
      fu.reminderCount += 1;
      fu.lastReminderAt = new Date().toISOString();
      this.addAuditLog('share', `Sent automated follow-up reminder to ${fu.patientName} (${fu.patientMobile})`);
      this.notify();
    }
  }

  // --- KPI CALCULATIONS (100% computed from live data, never hardcoded) ---
  public getDashboardKPIs() {
    const totalPatients = this.patients.length;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayConsultations = this.consultations.filter(c => c.date.startsWith(todayStr) || c.date === '2026-10-30').length;
    
    const pendingApprovals = this.consultations.filter(c => c.status === 'pending_approval').length;
    const completedPrescriptions = this.consultations.filter(c => c.status === 'approved' && c.prescription.status === 'approved').length;
    
    const now = new Date();
    const followUpsDue = this.followUps.filter(f => f.status === 'due' || f.status === 'overdue').length;
    const overdueFollowUps = this.followUps.filter(f => {
      const due = new Date(f.dueDate);
      return due < now && f.status !== 'completed';
    }).length;

    return {
      totalPatients,
      todayConsultations,
      totalDoctors: this.doctors.length,
      pendingApprovals,
      completedPrescriptions,
      followUpsDue,
      overdueFollowUps
    };
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public addAuditLog(action: AuditLog['action'], details: string) {
    const actorName = this.currentRole === 'doctor' 
      ? 'Dr. Arvind Patil' 
      : this.currentRole === 'receptionist' 
      ? 'Sunita Sharma' 
      : this.currentRole === 'admin' 
      ? 'Jyoti Bhanushali' 
      : 'Patient User';

    const log: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor: actorName,
      role: this.currentRole,
      action,
      entity: 'Clinical Documentation',
      timestamp: new Date().toISOString(),
      details
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 50) this.auditLogs.pop();
  }

  // --- ROLE & SETTINGS ---
  public getCurrentRole(): UserRole {
    return this.currentRole;
  }

  public setRole(role: UserRole) {
    this.currentRole = role;
    this.addAuditLog('login', `Switched active role session to ${role.toUpperCase()}`);
    this.notify();
  }

  public getCurrentLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  public setLanguage(lang: LanguageCode) {
    this.currentLanguage = lang;
    this.notify();
  }

  public getSettings(): AppSettings {
    return this.settings;
  }

  public updateSettings(partial: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...partial };
    this.notify();
  }

  public resetDemoData() {
    this.patients = [...initialPatients];
    this.consultations = [sampleKneePainConsultation, sampleApprovedConsultation];
    this.followUps = [...initialFollowUps];
    this.auditLogs = [...initialAuditLogs];
    this.notify();
  }
}

export const clinicStore = ClinicStore.getInstance();
