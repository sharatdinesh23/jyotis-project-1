export type UserRole = 'doctor' | 'receptionist' | 'admin' | 'patient';

export type LanguageCode = 'en' | 'hi' | 'mr';

export interface Patient {
  id: string; // Unique, e.g. PSC-2026-0084
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email?: string;
  address: string;
  emergencyContact?: string;
  bloodGroup?: string;
  branch: string;
  registeredDate: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualifications: string;
  speciality: string;
  regNo: string;
  branch: string;
  role: 'doctor';
  avatar?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  contact: string;
  active: boolean;
}

export interface HealthQuestionnaire {
  id: string;
  patientId: string;
  visitDate: string;
  chiefComplaint: string;
  symptomsAndDuration: string;
  pastHistory: string;
  currentMedicines: string;
  priorTreatment: string;
  allergies: string;
  lifestyle: string;
  category: 'knee_joint' | 'back_spine' | 'fever_viral' | 'cardiac' | 'general';
}

export interface TranscriptSegment {
  id: string;
  speaker: 'Doctor' | 'Patient';
  timestamp: string;
  text: string;
  language?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Gel/Ointment' | 'Drops';
  dosage: string;
  frequency: string; // e.g. 1-0-1 or TDS
  timing: 'Before Food' | 'After Food' | 'With Food' | 'At Bedtime' | 'As Needed';
  duration: string;
  instructions: string;
  flagged?: boolean;
  flagReason?: string;
}

export interface ExtractionFlag {
  id: string;
  type: 'unclear_name' | 'missing_dose' | 'missing_frequency' | 'missing_duration' | 'suspected_vs_confirmed' | 'allergy_risk' | 'low_confidence';
  message: string;
  field: string;
  resolved: boolean;
}

export interface MedicalExtraction {
  patientSymptomsReported: string;
  durationAndSeverity: string;
  relevantMedicalHistory: string;
  doctorClinicalObservations: string;
  suspectedDiagnoses: string[];
  confirmedDiagnoses: string[];
  treatmentRecommendations: string[];
  medicinesMentioned: MedicineItem[];
  lifestyleDietInstructions: string[];
  followUpRecommendation: string;
  followUpDate: string;
  flags: ExtractionFlag[];
  providerUsed: string;
}

export interface CasePaper {
  clinicDetails: {
    name: string;
    tagline: string;
    address: string;
    contact: string;
    email: string;
    branch: string;
    regNo: string;
  };
  patientDetails: {
    id: string;
    name: string;
    age: number;
    gender: string;
    contact: string;
    bloodGroup?: string;
  };
  visitDetails: {
    date: string;
    time: string;
    doctorName: string;
    doctorReg: string;
    visitType: string;
  };
  chiefComplaints: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  physicalExamination: string;
  clinicalAssessment: {
    suspected: string;
    confirmed: string;
  };
  treatmentPlan: string;
  lifestyleDietAdvice: string;
  followUpAdvice: string;
  approvalSignature: {
    approved: boolean;
    doctorName?: string;
    timestamp?: string;
    digitalSignature?: string;
  };
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  medicines: MedicineItem[];
  instructions: string[];
  dietaryAdvice: string[];
  followUpDate: string;
  status: 'draft' | 'approved';
  flags: ExtractionFlag[];
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  consentRecorded: boolean;
  consentTimestamp?: string;
  consentBy?: string;
  audioDuration?: number;
  audioUrl?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  branch: string;
  language: 'Hindi' | 'Marathi' | 'English' | 'Mixed';
  transcript: TranscriptSegment[];
  extraction: MedicalExtraction;
  casePaper: CasePaper;
  prescription: Prescription;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  version: number;
  deliveryStatus: {
    whatsapp: 'not_sent' | 'simulated' | 'sent' | 'failed';
    sms: 'not_sent' | 'simulated' | 'sent' | 'failed';
    portal: 'available';
    sentAt?: string;
  };
}

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  consultationId: string;
  dueDate: string;
  reason: string;
  reminderCount: number;
  lastReminderAt?: string;
  status: 'due' | 'overdue' | 'completed' | 'cancelled';
}

export interface AuditLog {
  id: string;
  actor: string;
  role: string;
  action: 'create' | 'edit' | 'approve' | 'reject' | 'export' | 'share' | 'login';
  entity: string;
  timestamp: string;
  details: string;
}

export interface AppSettings {
  aiProvider: 'openai' | 'openrouter' | 'gemini' | 'groq' | 'mock';
  aiModel: string;
  transcriptionProvider: 'openai' | 'deepgram' | 'groq' | 'mock';
  hasOpenAIKey: boolean;
  hasOpenRouterKey: boolean;
  hasDeepgramKey: boolean;
  hasGeminiKey: boolean;
  hasGroqKey?: boolean;
  activeBranch: string;
  language: LanguageCode;
}

