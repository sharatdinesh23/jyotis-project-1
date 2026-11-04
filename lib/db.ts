import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import {
  Patient,
  Consultation,
  FollowUp,
  AuditLog,
  Doctor,
  UserRole
} from '@/types';
import {
  sampleKneePainConsultation,
  sampleApprovedConsultation,
  initialPatients,
  initialFollowUps,
  initialAuditLogs,
  initialDoctors
} from '@/lib/seedData';

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  branch: string;
  regNo?: string;
  mobile?: string;
}

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'parasnath.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Ensure users table schema has mobile
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    branch TEXT NOT NULL,
    regNo TEXT,
    mobile TEXT
  );
`);

try {
  db.exec(`ALTER TABLE users ADD COLUMN mobile TEXT;`);
} catch {}

try {
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);`);
} catch {}

// Seed mobile numbers for existing seeded users
try {
  db.prepare("UPDATE users SET mobile = '+91 98201 23456' WHERE email = 'patient@parasnath.com' AND (mobile IS NULL OR mobile = '')").run();
  db.prepare("UPDATE users SET mobile = '+91 98111 22334' WHERE email = 'doctor@parasnath.com' AND (mobile IS NULL OR mobile = '')").run();
  db.prepare("UPDATE users SET mobile = '+91 98222 33445' WHERE email = 'reception@parasnath.com' AND (mobile IS NULL OR mobile = '')").run();
  db.prepare("UPDATE users SET mobile = '+91 98333 44556' WHERE email = 'admin@parasnath.com' AND (mobile IS NULL OR mobile = '')").run();
  db.prepare("UPDATE users SET mobile = '+91 98444 55667' WHERE email = 'superadmin@parasnath.com' AND (mobile IS NULL OR mobile = '')").run();
} catch {}

db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    mobile TEXT UNIQUE NOT NULL,
    email TEXT,
    address TEXT,
    emergencyContact TEXT,
    bloodGroup TEXT,
    branch TEXT NOT NULL,
    registeredDate TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    doctorId TEXT NOT NULL,
    doctorName TEXT NOT NULL,
    date TEXT NOT NULL,
    consentRecorded INTEGER NOT NULL,
    consentTimestamp TEXT,
    consentBy TEXT,
    audioDuration INTEGER DEFAULT 0,
    status TEXT NOT NULL,
    branch TEXT NOT NULL,
    language TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    approvedBy TEXT,
    approvedAt TEXT,
    rejectionReason TEXT,
    transcript TEXT NOT NULL,
    extraction TEXT NOT NULL,
    casePaper TEXT NOT NULL,
    prescription TEXT NOT NULL,
    deliveryStatus TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS follow_ups (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    patientName TEXT NOT NULL,
    patientMobile TEXT NOT NULL,
    consultationId TEXT,
    dueDate TEXT NOT NULL,
    reason TEXT NOT NULL,
    reminderCount INTEGER DEFAULT 0,
    lastReminderAt TEXT,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor TEXT NOT NULL,
    role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    details TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS patient_voice_notes (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    patientName TEXT NOT NULL,
    patientMobile TEXT NOT NULL,
    audioData TEXT,
    audioDuration INTEGER DEFAULT 0,
    language TEXT NOT NULL,
    transcription TEXT,
    chiefIssue TEXT,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`);

// Seed default users if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password, name, role, branch, regNo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialUsers: UserRecord[] = [
    {
      id: 'USR-SUPER-01',
      email: 'superadmin@parasnath.com',
      password: 'superadmin123',
      name: 'Jyoti Bhanushali (Superadmin)',
      role: 'admin',
      branch: 'Head Office (All Branches)',
      regNo: 'HO-SUPER-01'
    },
    {
      id: 'USR-ADM-01',
      email: 'admin@parasnath.com',
      password: 'admin123',
      name: 'Clinic Admin',
      role: 'admin',
      branch: 'Badlapur Central'
    },
    {
      id: 'USR-DOC-01',
      email: 'doctor@parasnath.com',
      password: 'doctor123',
      name: 'Dr. Arvind Patil',
      role: 'doctor',
      branch: 'Badlapur Central',
      regNo: 'MMC-2014-08976'
    },
    {
      id: 'USR-REC-01',
      email: 'reception@parasnath.com',
      password: 'reception123',
      name: 'Sunita Sharma',
      role: 'receptionist',
      branch: 'Badlapur Central'
    },
    {
      id: 'USR-PAT-01',
      email: 'patient@parasnath.com',
      password: 'patient123',
      name: 'Ramesh Joshi',
      role: 'patient',
      branch: 'Badlapur Central'
    }
  ];

  for (const u of initialUsers) {
    insertUser.run(u.id, u.email, u.password, u.name, u.role, u.branch, u.regNo || null);
  }
} else {
  // Ensure Superadmin exists even if database was initialized before
  const existingSuper = db.prepare('SELECT id FROM users WHERE email = ?').get('superadmin@parasnath.com');
  if (!existingSuper) {
    db.prepare(`
      INSERT INTO users (id, email, password, name, role, branch, regNo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('USR-SUPER-01', 'superadmin@parasnath.com', 'superadmin123', 'Jyoti Bhanushali (Superadmin)', 'admin', 'Head Office (All Branches)', 'HO-SUPER-01');
  }
}

// Seed patients if empty
const patientCount = db.prepare('SELECT count(*) as count FROM patients').get() as { count: number };
if (patientCount.count === 0) {
  const insertPatient = db.prepare(`
    INSERT INTO patients (id, name, age, gender, mobile, email, address, emergencyContact, bloodGroup, branch, registeredDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of initialPatients) {
    insertPatient.run(
      p.id, p.name, p.age, p.gender, p.mobile,
      p.email || null, p.address, p.emergencyContact || null,
      p.bloodGroup || null, p.branch, p.registeredDate
    );
  }
}

// Seed consultations if empty
const consultCount = db.prepare('SELECT count(*) as count FROM consultations').get() as { count: number };
if (consultCount.count === 0) {
  const insertConsult = db.prepare(`
    INSERT INTO consultations (
      id, patientId, doctorId, doctorName, date, consentRecorded,
      consentTimestamp, consentBy, audioDuration, status, branch, language,
      version, approvedBy, approvedAt, rejectionReason, transcript,
      extraction, casePaper, prescription, deliveryStatus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialConsults = [sampleKneePainConsultation, sampleApprovedConsultation];
  for (const c of initialConsults) {
    insertConsult.run(
      c.id, c.patientId, c.doctorId, c.doctorName, c.date,
      c.consentRecorded ? 1 : 0, c.consentTimestamp || null, c.consentBy || null,
      c.audioDuration || 0, c.status, c.branch, c.language, c.version || 1,
      c.approvedBy || null, c.approvedAt || null, c.rejectionReason || null,
      JSON.stringify(c.transcript), JSON.stringify(c.extraction),
      JSON.stringify(c.casePaper), JSON.stringify(c.prescription),
      JSON.stringify(c.deliveryStatus)
    );
  }
}

// Seed follow ups if empty
const fuCount = db.prepare('SELECT count(*) as count FROM follow_ups').get() as { count: number };
if (fuCount.count === 0) {
  const insertFU = db.prepare(`
    INSERT INTO follow_ups (id, patientId, patientName, patientMobile, consultationId, dueDate, reason, reminderCount, lastReminderAt, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const fu of initialFollowUps) {
    insertFU.run(
      fu.id, fu.patientId, fu.patientName, fu.patientMobile,
      fu.consultationId, fu.dueDate, fu.reason,
      fu.reminderCount || 0, fu.lastReminderAt || null, fu.status
    );
  }
}

// Seed audit logs if empty
const logCount = db.prepare('SELECT count(*) as count FROM audit_logs').get() as { count: number };
if (logCount.count === 0) {
  const insertLog = db.prepare(`
    INSERT INTO audit_logs (id, actor, role, action, entity, timestamp, details)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const l of initialAuditLogs) {
    insertLog.run(l.id, l.actor, l.role, l.action, l.entity, l.timestamp, l.details);
  }
}

// Seed patient voice notes if empty
const vnCount = db.prepare('SELECT count(*) as count FROM patient_voice_notes').get() as { count: number };
if (vnCount.count === 0) {
  db.prepare(`
    INSERT INTO patient_voice_notes (id, patientId, patientName, patientMobile, audioData, audioDuration, language, transcription, chiefIssue, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'VN-2026-001',
    'PSC-2026-0084',
    'Ramesh Joshi',
    '+91 98201 23456',
    null,
    18,
    'hi',
    'Doctor sahab, pichle do hafte se daayein ghutne mein bahut tez dard ho raha hai. Khaas kar subah uthte waqt aur seedhiyan chadhne-utarte waqt ghutna akad jata hai.',
    'Severe right knee pain & morning stiffness since 2 weeks, exacerbated by stair climbing',
    'pending_doctor_review',
    '2026-11-04T09:15:00Z'
  );
}

// ==========================================
// DB HELPER FUNCTIONS
// ==========================================

export function findUserByEmail(email: string): UserRecord | undefined {
  return db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim()) as UserRecord | undefined;
}

export function findUserByMobile(mobile: string): UserRecord | undefined {
  const digits = mobile.replace(/[^0-9]/g, '');
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    return db.prepare(`SELECT * FROM users WHERE mobile LIKE '%' || ?`).get(last10) as UserRecord | undefined;
  }
  return db.prepare('SELECT * FROM users WHERE mobile = ?').get(mobile.trim()) as UserRecord | undefined;
}

export function findUserByEmailOrMobile(identifier: string): UserRecord | undefined {
  const clean = identifier.trim();
  const digits = clean.replace(/[^0-9]/g, '');
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    const userByPhone = db.prepare(`SELECT * FROM users WHERE mobile LIKE '%' || ?`).get(last10) as UserRecord | undefined;
    if (userByPhone) return userByPhone;
  }
  return db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(clean) as UserRecord | undefined;
}

export function findUserById(id: string): UserRecord | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRecord | undefined;
}

export function registerNewUser(user: Omit<UserRecord, 'id'>): UserRecord {
  const id = `USR-${Date.now().toString().slice(-5)}`;
  db.prepare(`
    INSERT INTO users (id, email, password, name, role, branch, regNo, mobile)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, user.email, user.password, user.name, user.role, user.branch, user.regNo || null, user.mobile || null);

  return { id, ...user };
}

export function findPatientByEmailOrMobile(email?: string, mobile?: string): Patient | undefined {
  if (mobile) {
    const digits = mobile.replace(/[^0-9]/g, '');
    if (digits.length >= 10) {
      const p = db.prepare(`SELECT * FROM patients WHERE mobile LIKE '%' || ?`).get(digits.slice(-10)) as Patient | undefined;
      if (p) return p;
    }
  }
  if (email && email.trim()) {
    const p = db.prepare(`SELECT * FROM patients WHERE LOWER(email) = LOWER(?)`).get(email.trim()) as Patient | undefined;
    if (p) return p;
  }
  return undefined;
}

export function getAllPatients(): Patient[] {
  return db.prepare('SELECT * FROM patients ORDER BY registeredDate DESC').all() as Patient[];
}

export function getPatient(id: string): Patient | undefined {
  return db.prepare('SELECT * FROM patients WHERE id = ?').get(id) as Patient | undefined;
}

export function createPatientRecord(p: Omit<Patient, 'id' | 'registeredDate'>): { patient: Patient; isDuplicate: boolean } {
  // Mobile duplicate check
  const clean = p.mobile.replace(/[^0-9]/g, '');
  const existing = db.prepare(`
    SELECT * FROM patients WHERE mobile LIKE '%' || ?
  `).get(clean.slice(-10)) as Patient | undefined;

  if (existing) {
    return { patient: existing, isDuplicate: true };
  }

  const count = (db.prepare('SELECT count(*) as count FROM patients').get() as { count: number }).count;
  const newId = `PSC-2026-00${87 + count}`;
  const registeredDate = new Date().toISOString().split('T')[0];

  const newPatient: Patient = {
    ...p,
    id: newId,
    registeredDate
  };

  db.prepare(`
    INSERT INTO patients (id, name, age, gender, mobile, email, address, emergencyContact, bloodGroup, branch, registeredDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    newPatient.id, newPatient.name, newPatient.age, newPatient.gender, newPatient.mobile,
    newPatient.email || null, newPatient.address, newPatient.emergencyContact || null,
    newPatient.bloodGroup || null, newPatient.branch, newPatient.registeredDate
  );

  addAuditLog('Receptionist', 'receptionist', 'create', `Registered patient ${newPatient.name} (${newPatient.id})`);

  return { patient: newPatient, isDuplicate: false };
}

export function getAllConsultations(): Consultation[] {
  const rows = db.prepare('SELECT * FROM consultations ORDER BY date DESC').all() as any[];
  return rows.map(r => ({
    ...r,
    consentRecorded: Boolean(r.consentRecorded),
    transcript: JSON.parse(r.transcript),
    extraction: JSON.parse(r.extraction),
    casePaper: JSON.parse(r.casePaper),
    prescription: JSON.parse(r.prescription),
    deliveryStatus: JSON.parse(r.deliveryStatus),
  }));
}

export function getConsultation(id: string): Consultation | undefined {
  const r = db.prepare('SELECT * FROM consultations WHERE id = ?').get(id) as any;
  if (!r) return undefined;
  return {
    ...r,
    consentRecorded: Boolean(r.consentRecorded),
    transcript: JSON.parse(r.transcript),
    extraction: JSON.parse(r.extraction),
    casePaper: JSON.parse(r.casePaper),
    prescription: JSON.parse(r.prescription),
    deliveryStatus: JSON.parse(r.deliveryStatus),
  };
}

export function saveConsultationRecord(c: Consultation) {
  const exists = db.prepare('SELECT id FROM consultations WHERE id = ?').get(c.id);
  if (exists) {
    db.prepare(`
      UPDATE consultations SET
        doctorName = ?, status = ?, version = ?, approvedBy = ?, approvedAt = ?,
        rejectionReason = ?, transcript = ?, extraction = ?, casePaper = ?,
        prescription = ?, deliveryStatus = ?
      WHERE id = ?
    `).run(
      c.doctorName, c.status, (c.version || 1) + 1, c.approvedBy || null,
      c.approvedAt || null, c.rejectionReason || null, JSON.stringify(c.transcript),
      JSON.stringify(c.extraction), JSON.stringify(c.casePaper),
      JSON.stringify(c.prescription), JSON.stringify(c.deliveryStatus),
      c.id
    );
  } else {
    db.prepare(`
      INSERT INTO consultations (
        id, patientId, doctorId, doctorName, date, consentRecorded,
        consentTimestamp, consentBy, audioDuration, status, branch, language,
        version, approvedBy, approvedAt, rejectionReason, transcript,
        extraction, casePaper, prescription, deliveryStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      c.id, c.patientId, c.doctorId, c.doctorName, c.date,
      c.consentRecorded ? 1 : 0, c.consentTimestamp || null, c.consentBy || null,
      c.audioDuration || 0, c.status, c.branch, c.language, c.version || 1,
      c.approvedBy || null, c.approvedAt || null, c.rejectionReason || null,
      JSON.stringify(c.transcript), JSON.stringify(c.extraction),
      JSON.stringify(c.casePaper), JSON.stringify(c.prescription),
      JSON.stringify(c.deliveryStatus)
    );
  }
}

export function approveConsultationInDB(id: string, doctorName: string) {
  const now = new Date().toISOString();
  const c = getConsultation(id);
  if (!c) throw new Error('Consultation not found');

  c.status = 'approved';
  c.approvedBy = doctorName;
  c.approvedAt = now;
  c.casePaper.approvalSignature = {
    approved: true,
    doctorName,
    timestamp: now,
    digitalSignature: `VERIFIED_${doctorName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_${Date.now()}`
  };
  c.prescription.status = 'approved';

  saveConsultationRecord(c);

  // Auto-schedule follow-up if date present
  if (c.prescription.followUpDate) {
    const existing = db.prepare('SELECT id FROM follow_ups WHERE consultationId = ?').get(c.id);
    if (!existing) {
      const patient = getPatient(c.patientId);
      const fuId = `FU-${Date.now().toString().slice(-4)}`;
      db.prepare(`
        INSERT INTO follow_ups (id, patientId, patientName, patientMobile, consultationId, dueDate, reason, reminderCount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'due')
      `).run(
        fuId, c.patientId, patient?.name || 'Patient', patient?.mobile || '',
        c.id, c.prescription.followUpDate, c.casePaper.chiefComplaints || 'Clinical Follow-up'
      );
    }
  }

  addAuditLog(doctorName, 'doctor', 'approve', `Approved consultation ${c.id} for ${c.casePaper.patientDetails.name}`);
}

export function getAllFollowUps(): FollowUp[] {
  return db.prepare('SELECT * FROM follow_ups ORDER BY dueDate ASC').all() as FollowUp[];
}

export function incrementFollowUpReminder(id: string) {
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE follow_ups SET reminderCount = reminderCount + 1, lastReminderAt = ? WHERE id = ?
  `).run(now, id);
}

export function getAllAuditLogs(): AuditLog[] {
  return db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50').all() as AuditLog[];
}

export function addAuditLog(actor: string, role: string, action: string, details: string) {
  const id = `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  db.prepare(`
    INSERT INTO audit_logs (id, actor, role, action, entity, timestamp, details)
    VALUES (?, ?, ?, ?, 'Clinical Record', ?, ?)
  `).run(id, actor, role, action, new Date().toISOString(), details);
}

export interface PatientVoiceNote {
  id: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  audioData?: string;
  audioDuration: number;
  language: string;
  transcription: string;
  chiefIssue: string;
  status: 'pending_doctor_review' | 'reviewed';
  createdAt: string;
}

export function savePatientVoiceNote(note: Omit<PatientVoiceNote, 'id' | 'createdAt'>): PatientVoiceNote {
  const id = `VN-${Date.now().toString().slice(-6)}`;
  const createdAt = new Date().toISOString();
  db.prepare(`
    INSERT INTO patient_voice_notes (id, patientId, patientName, patientMobile, audioData, audioDuration, language, transcription, chiefIssue, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, note.patientId, note.patientName, note.patientMobile,
    note.audioData || null, note.audioDuration || 0, note.language || 'en',
    note.transcription || '', note.chiefIssue || '', note.status || 'pending_doctor_review',
    createdAt
  );

  return { id, createdAt, ...note };
}

export function getPatientVoiceNotes(patientId?: string): PatientVoiceNote[] {
  if (patientId) {
    return db.prepare('SELECT * FROM patient_voice_notes WHERE patientId = ? ORDER BY createdAt DESC').all(patientId) as PatientVoiceNote[];
  }
  return db.prepare('SELECT * FROM patient_voice_notes ORDER BY createdAt DESC').all() as PatientVoiceNote[];
}

export function updateVoiceNoteStatus(id: string, status: 'pending_doctor_review' | 'reviewed') {
  db.prepare('UPDATE patient_voice_notes SET status = ? WHERE id = ?').run(status, id);
}

export function resetDatabase() {
  db.exec(`
    DELETE FROM users;
    DELETE FROM patients;
    DELETE FROM consultations;
    DELETE FROM follow_ups;
    DELETE FROM audit_logs;
  `);

  // Re-seed
  // (Calling file again or re-inserting)
}

export default db;

