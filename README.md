# PARASNATH AI — Medical Voice Assistant & Patient Documentation System

> **Client:** Parasnath Speciality Clinic, Badlapur  
> **Prepared for:** Jyoti Bhanushali, Revonix Solution  
> **Blueprint Reference:** Full 15-Page Specification (30 October 2026)  
> **Brand Identity:** Revonix Deep-Navy & Rich Purple Theme (`#0B132B`, `#1C2541`, `#3A506B`, `#4F46E5`, `#7C3AED`)  
> **Database:** Persistent SQLite Database (`data/parasnath.db`)  
> **Core Clinical Rule:** *"This is a documentation system, not an autonomous doctor. The AI never diagnoses, never invents a medicine or dose, and nothing is finalised or shared until a doctor approves it."*

---

## 🚀 Quick Start (Running the Website)

```bash
# Start development server
npm run dev

# Or build & run production server
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔐 Dedicated Login & Registration Pages

The application includes dedicated authentication and role registration at:
- **Login Portal:** **[http://localhost:3000/login](http://localhost:3000/login)**
- **Registration Portal:** **[http://localhost:3000/register](http://localhost:3000/register)**

### Pre-Seeded Demo User Accounts (Stored in SQLite `data/parasnath.db`):
| Role | Name | Email | Password | Dedicated Page |
|---|---|---|---|---|
| **🩺 Doctor** | Dr. Arvind Patil (MS Ortho) | `doctor@parasnath.com` | `doctor123` | [`/doctor`](http://localhost:3000/doctor) |
| **📋 Receptionist** | Sunita Sharma | `reception@parasnath.com` | `reception123` | [`/receptionist`](http://localhost:3000/receptionist) |
| **🛡️ Admin** | Jyoti Bhanushali (Head Office) | `admin@parasnath.com` | `admin123` | [`/admin`](http://localhost:3000/admin) |
| **👤 Patient** | Ramesh Joshi (Patient ID: PSC-2026-0084) | `patient@parasnath.com` | `patient123` | [`/patient`](http://localhost:3000/patient) |

> On the login page, you can use the **1-Click Demo Login buttons** to jump directly into any role's workspace instantly during your presentation!

---

## 🖥️ Role-Specific Dedicated Workspaces

1. **Doctor Clinical Workspace ([`/doctor`](http://localhost:3000/doctor)):**
   - Doctor's queue & outpatient consults.
   - Live Voice Assistant (Mic recording with waveform, timer, Hindi/Marathi/English speech recognition).
   - Doctor Approvals & Safety Gate (The Hard Gate: review and sign case papers & prescriptions).
   - Rejection dialog with clinical feedback.
   - Unlocked PDF downloads.
2. **Receptionist Workspace ([`/receptionist`](http://localhost:3000/receptionist)):**
   - Patient Registration & Unique Patient ID (`PSC-2026-XXXX`) generation.
   - Real-time **duplicate mobile number verification**.
   - Adaptive Pre-Consultation Health Questionnaire.
   - Follow-Up Management (Calendar, Overdue tracking, WhatsApp & SMS reminder message simulator).
3. **Head Office Admin Workspace ([`/admin`](http://localhost:3000/admin)):**
   - Executive Dashboard with live KPI counters from SQLite.
   - Multi-Branch Monitoring (Badlapur Central, Kalyan West, Thane East).
   - Full Patient CRM with **1-click Excel (`.xlsx`) export**.
   - Medical Audit Logs.
   - AI Models & `.env` Configuration Manager.
4. **Patient Digital Health Portal ([`/patient`](http://localhost:3000/patient)):**
   - Patient personal medical profile.
   - My Approved Prescriptions & Case Papers (1-click PDF download for approved records).
   - Clear protection: unapproved consultations remain locked and hidden from patients until doctor approval.
   - Next follow-up appointment tracking.

---

## 🗄️ Database Architecture (`data/parasnath.db`)

The application runs on a dedicated, persistent **SQLite** database via `better-sqlite3`:
- `users`: User authentication, credentials, roles, branches, doctor license registration numbers.
- `patients`: Demographic data, blood group, contact, emergency contact, unique `PSC-2026-XXXX` spine.
- `consultations`: Date, consent flags, audio duration, status, diarised transcript, AI extraction, 12-part case paper, prescription draft, approval metadata.
- `follow_ups`: Doctor-scheduled return dates, overdue tracking, reminder counts, delivery logs.
- `audit_logs`: Auditable logs of every create, edit, approval, reject, export, and share.

---

## 📄 Overlap-Free PDF Table Generator

The PDF generator uses `jspdf-autotable` with strict column bounds and multi-line cell wrapping:
- **#**: 10 mm
- **Medicine & Formulation**: 70 mm (auto-wraps long generic & brand names)
- **Dosage**: 26 mm
- **Frequency**: 26 mm
- **Timing**: 26 mm
- **Duration**: 24 mm
Text collisions between long medicine names (e.g. *Tab. Thiocolchicoside 4mg + Paracetamol 325mg*) and dosage values are completely eliminated.
