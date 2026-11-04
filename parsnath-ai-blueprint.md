REVON I X SOLUT I ON - HEALTHCARE A I

## PARASNATH AI

Intelligent Medical Voice Assistant & Digital Patient Documentation System

## Full Project Blueprint

The complete plan for the system that turns one doctor-patient consultation into one AI- generated case paper, one doctor-approved prescription, and one permanent digital patient record - in Hindi, Marathi and English.

Organisation: Parasnath Speciality Clinic, Badlapur

Project type: AI-powered healthcare technology

12

Modules specified in this blueprint

The one rule that governs everything: This is a documentation system, not an autonomous doctor. The AI never diagnoses, never invents a medicine or dose, and nothing is finalised or shared until a doctor approves it.

Prepared for Jyoti Bhanushali, Revonix Solution - 30 October 2026. This blueprint is the build reference for the live system and for any developer or AI tool rebuilding it.

Status: Phase 1 MVP built

10

3

Workflow steps from registration to delivery

Languages: Hindi, Marathi, English


## Contents and where the project stands today

| 1. Vision, objectives and design principles | 3 |
| --- | --- |
| 2. End-to-end workflow - the 10 steps | 4 |
| 3. Module specifications 1-6 | 5 |
| 4. Module specifications 7-12, dashboard and roles at a glance | 6 |
| 5. System architecture | 7 |
| 6. Data model - entities, fields and relationships | 8 |
| 7. AI and voice pipeline | 9 |
| 8. Safety, privacy and user roles | 10 |
| 9. Integrations and API contracts | 11 |
| 10. Technology stack, deployment and non-functional requirements | 12 |
| 11. Roadmap - Phases 1 to 4 | 13 |
| 12. Effort estimates and risks | 14 |
| 13. Open items, decisions needed and Phase 1 acceptance criteria | 15 |

## Status snapshot - 30 October 2026

Phase 1 MVP is built and working. The web application (space: parsnath-ai) runs the full flow end to end: patient registration with a unique Patient ID, health questionnaire, consent-first consultation recording from a microphone or an uploaded audio file, transcript, structured case paper and prescription draft, doctor review and approval, PDF generation, and the record saved to the patient's profile. A knee- pain sample consultation sits unapproved in Approvals so the doctor flow can be tried immediately.

| Item | State today |
| --- | --- |
| Transcription & AI extraction | Running on clearly-marked demo (mock) adapters. Pasting an OpenAI or |
|   | Deepgram API key in Settings switches transcription to live. No key has been |
|   | provided yet. |
| Theme & languages | Revonix deep-navy and purple theme. Interface in English, Hindi and Marathi. |
| WhatsApp / SMS delivery | Designed in (Phase 3). Blocked on the clinic's own Meta WhatsApp setup - |
|   | see Open Items, page 15. |
| Production backend | This blueprint specifies the production target (FastAPI + PostgreSQL, Section |
|   | 10). The current MVP is the working web artifact built to the same workflow |
|   | and safety rules. |
| Patient data in testing | Synthetic data only. No real patient data is used in development or demos. |

A note on module count: the brief's module table names 12 modules. Earlier summaries of the brief said 13 - that count is not supported by the table itself, so this blueprint specifies the 12 named modules and treats the dashboard and reports views as part of the Admin Dashboard and Patient CRM modules.


## Vision, objectives and design principles

PARASNATH AI removes the doctor's paperwork, not the doctor's judgement. It listens to a real consultation, drafts the case paper and prescription from what was actually said, and waits for the doctor to approve before anything becomes a record.

## Problem it solves

Doctors at the clinic write case papers and prescriptions by hand after - or during - every consultation. That is slow, inconsistent between doctors, hard to search later, and leaves no central history when a patient returns months later or visits another Parasnath branch. PARASNATH AI replaces the writing, while keeping every clinical decision with the doctor.

## Main objectives (from the approved brief)

- Automate doctor-patient consultation documentation end to end.

- Convert voice conversations in Hindi, Marathi and English - including mixed-language, code-switched speech - into structured medical records.

- Generate a digital case paper and a prescription draft from the actual consultation.

- Maintain a central patient record and medical history under one unique Patient ID.

- Deliver approved documents to patients digitally (WhatsApp, SMS link, portal or print).

- Connect patient records with the clinic CRM and support Excel / Google Sheets exports and management reports.

- Scale across multiple Parasnath branches without redesigning the core.

## Design principles

| Principle | What it means in practice |
| --- | --- |
| Doctor-in-the-loop, always | Every AI output is a draft. Only a doctor's approval can finalise, generate a PDF or |
|   | trigger delivery. |
| Nothing invented | The AI extracts only what was said or confirmed. Unclear medicine names, doses |
|   | or findings are flagged, never guessed. |
| Patient voice vs doctor voice | Patient-reported symptoms are stored separately from doctor-confirmed findings, |
|   | and suspected diagnoses separately from confirmed ones. |
| Consent before capture | Recording cannot start until patient consent for audio recording and processing is |
|   | recorded. |
| Providers are swappable | Transcription, AI extraction, WhatsApp/SMS and storage sit behind adapters, so a |
|   | provider can change without rebuilding modules. |
| Works without keys, honestly | Where no live API credential exists, a clearly-marked mock adapter keeps the |
|   | whole flow testable - and is labelled as a mock everywhere it appears. |

## Success measures for Phase 1

These are targets to measure in the clinic pilot, not results: a consultation documented in minutes rather than written up afterwards; every approved consultation producing both PDFs without re-typing; zero documents shared before approval; and a returning patient found by Patient ID, name or mobile in seconds. Targets are confirmed with the clinic during the pilot - see Open Items.


## End-to-end workflow - the 10 steps

for correction.

| # | Step | What happens and what is produced |
| --- | --- | --- |
| 1 | Patient registration | Register a new patient or search for an existing one. The system generates a |
|   |   | unique Patient ID and stores name, age, gender and contact details. |
| 2 | Digital health | Before the consultation: chief complaint, symptoms and duration, past history, |
|   | questionnaire | current medicines, previous treatment, allergies and lifestyle. The questionnaire |
|   |   | adapts to the complaint. |
| 3 | Live voice recording | With consent recorded, the doctor starts recording in the app. Speech is captured |
|   |   | in Hindi, Marathi, English or mixed, with doctor and patient separated wherever |
|   |   | technically possible. |
| 4 | Transcription | Audio becomes a readable transcript that recognises medical terminology. The |
|   |   | doctor can review and correct it. |
| 5 | AI extraction | The transcript is organised into structured sections (detailed in Section 7), |
|   |   | separating patient statements from doctor-confirmed findings. |
| 6 | Digital case paper | A 12-part case paper is generated: clinic and patient details, complaints, history, |
|   |   | examination, assessment, treatment plan, advice, follow-up and the doctor's |
|   |   | approval / signature area. |
| 7 | Prescription draft | Built only from doctor-stated or confirmed items: medicine, dosage, frequency, |
|   |   | timing, duration, instructions and follow-up date. Anything unclear is flagged. |
| 8 | Doctor review & | The doctor edits the transcript, extraction, case paper and prescription, then |
|   | approval | approves or rejects. This is the safety gate: nothing finalises before this step. |
| 9 | PDF generation | On approval, a professional case paper PDF and prescription PDF are generated, |
|   |   | saved to the patient's profile, and available to print or download. |
| 10 | Delivery & CRM update | Approved documents go to the patient via WhatsApp, an SMS link, the patient |
|   |   | portal or a printed copy. The consultation, medicines and follow-up date update the |
|   |   | patient's CRM record automatically. |

Worked example - knee pain: a patient reports six months of knee pain, worse on stairs, in mixed Hindi and English. The system records it, extracts the six-month history, captures only the examination findings and diagnosis the doctor actually states, drafts the case paper and prescription, and holds both for approval before saving them against the Patient ID. The same flow applies to back, neck and shoulder pain, joint pain, arthritis and other clinic complaints. This example is the Phase 1 acceptance test (page 15) and is pre-loaded in the built MVP as an unapproved sample.


## Module specifications - modules 1 to 6

Each module has one job, defined inputs and outputs, and a named owner role. Modules talk through the API layer (Section 5); none of them calls an AI or messaging provider directly - that always goes through an adapter.

| Module | Function & key behaviour | Inputs - Outputs |
| --- | --- | --- |
| 1. Patient | Registration, unique Patient ID generation, | In: registration details. Out: Patient ID, |
| Management | patient profile. Duplicate check on mobile | profile record. |
| Owner: Receptionist | number before a new ID is issued. Search by |   |
|   | ID, name or mobile. |   |
| 2. Health | Pre-consultation intake: complaint, symptoms | In: patient answers. Out: structured intake |
| Questionnaire | and duration, history, current medicines, prior | attached to the visit. |
| Owner: Receptionist / | treatment, allergies, lifestyle. Question set |   |
| Patient | adapts to the chief complaint. |   |
| 3. AI Voice Assistant | Starts and stops consultation recording | In: live / uploaded audio + consent flag. |
| Owner: Doctor | (microphone or uploaded audio), only after | Out: stored audio, recording metadata. |
|   | consent is recorded. Streams audio over |   |
|   | WebSockets in the production build; shows |   |
|   | recording state clearly at all times. |   |
| 4. Multilingual AI | Speech recognition for Hindi, Marathi and | In: audio. Out: timestamped, speaker- |
| Owner: System | English with in-sentence code-switching and | labelled transcript. |
|   | medical terminology. Speaker separation |   |
|   | (doctor / patient) wherever technically |   |
|   | possible. Doctor can correct the transcript. |   |
| 5. Medical AI | Converts the transcript into the structured | In: corrected transcript. Out: structured |
| Extraction | schema in Section 7. Separates reported vs | extraction (JSON) + flag list. |
| Owner: System | confirmed information; flags unclear or |   |
|   | missing items instead of filling them in. |   |
| 6. Digital Case Paper | Renders the extraction into the 12-part case | In: extraction. Out: editable case paper |
| Owner: Doctor | paper format (clinic details, patient and ID, | draft. |
|   | date and doctor, complaints, history of |   |
|   | present illness, past history, examination, |   |
|   | assessment, treatment plan, lifestyle and diet |   |
|   | advice, follow-up, approval / signature area). |   |
|   | Fully editable before approval. |   |

Build status: All six modules are present in the Phase 1 MVP. Modules 4 and 5 run on mock adapters until live transcription and extraction keys are connected (Open Items, page 15).


## Module specifications - modules 7 to 12

| Module | Function & key behaviour | Inputs - Outputs |
| --- | --- | --- |
| 7. AI Prescription | Prescription draft from doctor-confirmed items | In: confirmed extraction items. Out: editable |
| Owner: Doctor | only: medicine name, dosage, frequency, | prescription draft + flags. |
|   | timing, duration, instructions, treatment |   |
|   | recommendations, follow-up date. Never |   |
|   | invents a medicine or dose; unclear names |   |
|   | are flagged for confirmation. |   |
| 8. Doctor Approval | Review surface for transcript, extraction, case | In: drafts. Out: approved documents or |
| Owner: Doctor | paper and prescription. Edit, correct | rejection with corrections. |
|   | terminology, confirm diagnosis, verify |   |
|   | medicines, approve or reject. Approval is a |   |
|   | recorded, auditable action - it is what unlocks |   |
|   | PDF generation and delivery. |   |
| 9. PDF Generator | Produces the professional case paper PDF | In: approved documents. Out: two PDFs, |
| Owner: System | and prescription PDF from approved content | filed under Patient ID. |
|   | only, stores both in the patient profile, and |   |
|   | supports print and download. Previous |   |
|   | consultation documents remain on the record. |   |
| 10. Patient CRM | The patient's complete history in one view: | In: every approved consultation. Out: |
| Owner: Admin / Doctor | details, consultation history, case papers, | patient timeline, exports. |
|   | prescriptions, medicine and treatment history, |   |
|   | follow-up dates, treating doctor and next visit. |   |
|   | Supports Excel / Google Sheets export and |   |
|   | management reports. |   |
| 11. Follow-up | Tracks next appointments and follow-up dates | In: follow-up dates. Out: due list, reminders. |
| Management | set at approval, surfaces who is due, and |   |
| Owner: Receptionist | (Phase 3) sends reminders through the |   |
|   | delivery adapter. Reminder counters advance |   |
|   | only after a message is confirmed sent. |   |
| 12. Admin Dashboard | Clinic overview and control: total registered | In: all module data. Out: KPIs, reports, |
| Owner: Admin / Head | patients, today's consultations, total doctors, | settings. |
| Office | pending approvals, completed prescriptions, |   |
|   | follow-up appointments, recent records, |   |
|   | search by Patient ID / name / mobile, branch- |   |
|   | wise reporting, doctor and branch |   |
|   | management, settings and permissions. |   |

## Dashboard KPI definitions

Every number on the dashboard is counted from live records, never typed in: total patients = registered profiles; today's consultations = consultations dated today; pending approvals = drafts awaiting a doctor decision (the queue that must never silently grow); completed prescriptions = approved prescriptions with a generated PDF; follow-ups = patients with a future follow-up date, with overdue ones shown first.

Build status: Modules 7-10 and the dashboard KPIs are live in the Phase 1 MVP. Follow-up reminders (Module 11) and WhatsApp delivery activate in Phase 3, once the clinic's Meta WhatsApp setup exists.


## System architecture

## How the layers work together

| Layer | Responsibility and rules |
| --- | --- |
| Presentation | One responsive web app with role-specific views (doctor, receptionist, admin, patient). It |
|   | holds no clinical logic - it displays drafts and captures edits and approvals. |
| API & services | FastAPI service layer: authentication, role checks on every request, WebSocket channel |
|   | for live recording, the PDF service, and the audit log writer. Every state change (create, |
|   | edit, approve, share) passes through here and is logged. |
| Domain modules | The 12 modules of Sections 3-4. They own the workflow rules - including the approval |
|   | gate - and call providers only through adapters. |
| Provider adapters | One adapter per external capability: transcription, LLM extraction, delivery (WhatsApp / |
|   | SMS), storage and export. Each adapter has a live implementation and a clearly-marked |
|   | mock. Switching providers is a settings change, not a rebuild. |
| Data | PostgreSQL for structured records; encrypted object storage for audio files and PDFs. |
|   | Audio and documents are linked to consultations, never stored loose. |

## Key architectural decisions

- Approval is enforced in the service layer, not just hidden in the UI - the PDF and delivery services refuse any document whose status is not "approved".

- Drafts are versioned. Doctor edits create a new version; the AI's original draft and the approved version are both retained for audit.

- Branch-ready from day one. Every patient, doctor and consultation carries a branch field, so Phase 4 multi-branch reporting needs no data migration.

- Offline-tolerant recording. If connectivity drops mid-consultation, audio is held locally on the device and uploaded when the connection returns; a consultation is never lost silently.


## Data model - one Patient ID is the spine

Every consultation, document and follow-up hangs off a single patient record. If it cannot be traced back to a Patient ID, it does not belong in the system.

| Entity | Key fields | Relationships |
| --- | --- | --- |
| Patient | Patient ID (unique, system-generated), name, age, | Has many consultations, questionnaires, |
|   | gender, mobile, contact details, branch, registered | documents and follow-ups |
|   | date |   |
| Doctor | Doctor ID, name, qualifications, speciality, branch, | Conducts many consultations; approves |
|   | login role | documents |
| Branch | Branch ID, clinic name, address, logo, contact | Has many patients, doctors and |
|   |   | consultations |
| Questionnaire | Visit link, chief complaint, symptoms, duration, | Belongs to one patient and one visit |
|   | history, current medicines, prior treatment, |   |
|   | allergies, lifestyle |   |
| Consultation | Consultation ID, Patient ID, Doctor ID, date and | Has one transcript, one extraction, one |
|   | time, consent record (who, when), audio | case paper, one prescription |
|   | reference, status (draft / pending approval / |   |
|   | approved / rejected) |   |
| Transcript | Consultation link, speaker-labelled segments, | Belongs to one consultation; versioned |
|   | language tags, doctor-corrected version, provider |   |
|   | used (live or mock) |   |
| Extraction | Structured JSON per the Section 7 schema, flag | Belongs to one consultation; versioned |
|   | list (unclear / missing items), provider used |   |
| Case Paper | 12-part document content, version, status, | Belongs to one consultation; produces |
|   | approved-by, approved-at | one PDF on approval |
| Prescription | Medicine lines (name, dosage, frequency, timing, | Belongs to one consultation; produces |
|   | duration, instructions), recommendations, follow- | one PDF on approval |
|   | up date, status |   |
| Document (PDF) | File reference, type (case paper / prescription), | Belongs to one patient and one |
|   | consultation link, generated-at, delivery status | consultation |
| Follow-up | Patient link, due date, reason, reminder count, last | Belongs to one patient; created at |
|   | reminder confirmed-at | approval |
| Audit Log | Actor, role, action, entity, timestamp, before / after | Records every create, edit, approval, |
|   | reference | export and share |
| User & Role | User ID, name, role (Admin / Doctor / Receptionist | Controls access per Section 8 |
|   | / Patient), branch scope, active status |   |

Data rules: Patient IDs are never reused or deleted. Medical documents are never hard-deleted - corrections create versions. Development and demos use synthetic patients only.


## AI and voice pipeline

The pipeline has four stages - capture, transcribe, extract, draft - and one hard rule between every stage: uncertainty is flagged for the doctor, never smoothed over.

## Stage by stage

| Stage | What happens, and what can go wrong |
| --- | --- |
| 1. Capture | Browser microphone recording in the app, or an uploaded audio file. Consent is checked |
|   | before recording can start. Recording state is always visible; pausing and resuming keep one |
|   | continuous consultation file. |
| 2. Transcription | Speech-to-text via the transcription adapter (OpenAI or Deepgram when a key is connected; |
|   | mock otherwise). Must handle Hindi, Marathi and English, code-switching inside a sentence, |
|   | and medical terms. Speaker diarisation labels doctor and patient segments wherever |
|   | technically possible. |
| 3. Extraction | An AI language model reads the (doctor-correctable) transcript and returns structured JSON in |
|   | the fixed schema below - no free-form summaries. Every field must trace to something said in |
|   | the consultation. |
| 4. Drafting | The extraction fills the case paper and prescription templates. Fields with no source in the |
|   | transcript stay empty and appear on the flag list - they are never completed from general |
|   | medical knowledge. |

## Extraction schema - what the AI must return

- Symptoms as reported by the patient

- Duration and severity of symptoms

- Relevant medical history

- Doctor's clinical observations

- Doctor's assessment - suspected vs confirmed, kept separate

## The validation that comes before everything else

Mixed-language accuracy is the project's top technical risk. The brief requires the technology choices to be validated through a prototype, specifically on Hindi-Marathi-English mixed medical conversation. Before live rollout: record a set of synthetic test consultations (including the knee-pain example), run them through each candidate transcription provider, and compare medicine names, doses and findings against the known script. The provider that survives that test gets the key - not before.

Medicine catalogue (Phase 2): extracted medicine names are matched against a clinic-approved medicine catalogue. A name that matches nothing is flagged, never auto-corrected to a similar-sounding medicine - in a prescription, a confident wrong guess is worse than an honest blank.

- Treatment recommendations

- Medicines mentioned, with dosage and frequency only if explicitly stated

- Lifestyle and dietary instructions

- Follow-up recommendation and date

- Flag list: unclear names, missing dose / duration, low-confidence segments


## Safety, privacy and user roles

## The ten compulsory safety rules (from the brief, unedited in intent)

- 1. The AI must not independently diagnose patients.

- 2. The AI must not invent symptoms, clinical findings, medicines or dosages.

- 3. Patient-reported information is kept separate from the doctor's observations.

- 4. Suspected diagnoses are distinguished from confirmed diagnoses.

- 5. Unclear or missing information is flagged for doctor review.

- 6. All AI-generated case papers and prescriptions stay in draft status until doctor approval.

- 7. Unapproved medical documents are never shared - with anyone, on any channel.

- 8. Appropriate patient consent is obtained for audio recording and processing, before recording.

- 9. Patient information is protected with encryption, access controls, audit logs and secure storage.

- 10. The system follows applicable Indian data-protection and healthcare requirements, and uses synthetic patient information during development and testing.

## Who can do what

| Capability | Admin / Head Office | Doctor | Receptionist | Patient |
| --- | --- | --- | --- | --- |
| Manage branches, | Yes | No | No | No |
| doctors, settings, |   |   |   |   |
| permissions |   |   |   |   |
| Register patients, issue | Yes | No | Yes | No |
| Patient IDs, manage |   |   |   |   |
| appointments |   |   |   |   |
| Collect health | Yes | Yes | Yes | Own only |
| questionnaire |   |   |   |   |
| Start / stop consultation | No | Yes | No | No |
| recording |   |   |   |   |
| Review, edit and | No | Yes | No | No |
| approve case papers & |   |   |   |   |
| prescriptions |   |   |   |   |
| View patient history | Per permissions, all | Own patients Permitted records |   | Own documents |
|   | branches |   | only | only |
| Receive approved | - | - | - | Yes |
| documents |   |   |   |   |
| View reports & | Yes, incl. branch-wise | Own | No | No |
| analytics |   | summary |   |   |

Privacy in practice: role checks run on the server for every request, not just in the interface. Audio and PDFs are encrypted in storage. Every view, edit, approval, export and share writes an audit log entry. A patient only ever receives documents that a doctor has approved.


## Integrations and API contracts

Every external service sits behind an adapter with the same contract: a live implementation when credentials exist, and a clearly-marked mock when they do not. Modules never know which one is running - but the interface always shows which one is.

| Integration | Contract | Live provider | Mock behaviour today |
| --- | --- | --- | --- |
| Transcription | Audio in -> speaker-labelled, | OpenAI speech-to-text or | Returns a labelled sample |
|   | timestamped transcript out, with | Deepgram (key pasted in | transcript so the full flow |
|   | language tags | Settings) | can be tested |
| AI extraction | Transcript in -> structured JSON | AI language model with | Returns a structured |
|   | in the Section 7 schema + flag list | structured JSON outputs | sample extraction (the |
|   | out |   | knee-pain case) |
| WhatsApp delivery | Approved document + patient | Official Meta WhatsApp | Marks delivery as |
|   | mobile in -> delivery confirmation | API, clinic's own app and | "simulated" - nothing is |
|   | out | number (Phase 3) | sent |
| SMS delivery | Patient mobile + secure | SMS provider, to be | Simulated send, logged as |
|   | document link in -> send | selected | mock |
|   | confirmation out |   |   |
| Export | Date range / branch filter in -> | Sheet generation from | Same export, from sample |
|   | Excel or Google Sheets file out | CRM data | data in the MVP |
| Storage | File + consultation link in -> | Cloud object storage | Local artifact storage in the |
|   | encrypted stored reference out |   | MVP |

## Core API surface (production build)

| Endpoint group | Purpose |
| --- | --- |
| POST /patients | Register a patient (returns Patient ID); search by ID, name or mobile |
| GET /patients?search= |   |
| POST /consultations | Open a consultation (consent required in the payload); attach or stream |
| POST /consultations/{id}/audio | audio |
| POST /consultations/{id}/transcribe | Run the transcription and extraction adapters; results stored as drafts |
| /extract |   |
| PUT /consultations/{id}/case-paper | Doctor edits; each save creates a new version |
| /prescription |   |
| POST /consultations/{id}/approve | The gate: validates the approver is a doctor, locks the approved version, |
|   | triggers PDF generation |
| GET /patients/{id}/history | Full patient timeline for the CRM; live-counted dashboard numbers |
| GET /dashboard/kpis |   |
| POST /documents/{id}/deliver | Send an approved document via WhatsApp / SMS; refuses non- |
|   | approved documents |

All endpoints require authentication and enforce the role matrix on page 10. Provider keys live in Settings as secrets: never shown after entry, never in exports or logs.


## Technology stack, deployment and quality requirements

## Recommended stack (from the brief, adopted)

## Frontend

- Next.js, React, TypeScript

- Tailwind CSS, Shadcn UI

- Revonix deep-navy and purple theme, English / Hindi / Marathi interface

## Data & AI

- PostgreSQL

- OpenAI speech-to-text / real-time transcription APIs, or Deepgram

- AI language model with structured JSON outputs

- Medical terminology and medicine catalogue (Phase 2)

- Speaker identification / diarisation

## Backend

- Python, FastAPI

- SQLAlchemy, Pydantic (schema validation on every extraction)

- WebSockets for live recording

## Integrations

- PDF generation, WhatsApp API, SMS

- Excel / Google Sheets export, cloud storage

- Authentication and role-based access

Honest note on the current MVP: the Phase 1 application already delivered is a working web artifact that implements this workflow, data shape and safety model. The stack above is the production target for hardening and scale (Phases 2-3); moving to it does not change the workflow, the screens or the safety rules in this blueprint.

## Non-functional requirements

| Requirement | Standard |
| --- | --- |
| Responsive use | Full workflow usable on a phone, tablet and desktop - consultations are recorded at the |
|   | desk or bedside, not only in an office. |
| Draft safety | No approval, no PDF, no delivery - enforced in the service layer and covered by tests |
|   | (page 15). |
| Auditability | Every create, edit, approval, export and share is logged with actor, role and time. |
| Data protection | Encryption in storage and in transit, role-based access, secrets held outside the |
|   | codebase, synthetic data in all non-production environments. |
| Recovery | Regular database and file backups; a lost connection during recording never loses the |
|   | consultation audio. |
| Provider independence | Any adapter can be replaced without touching module code; the system runs end to |
|   | end on mocks for demos and training. |


## Roadmap - Phases 1 to 4

| Phase | Status | Scope |
| --- | --- | --- |
| Phase 1 - | BUILT | Patient registration and unique Patient ID; health questionnaire; audio recording |
| Working MVP |   | and transcription; multilingual support; AI extraction; digital case paper; |
|   |   | prescription draft; doctor approval; PDF generation; patient record storage. |
|   |   | Delivered as the parsnath-ai web app with demo adapters and the knee-pain |
|   |   | sample waiting in Approvals. |
| Phase 2 - | Next | Live transcription and extraction keys connected and validated on synthetic mixed- |
| Advanced AI |   | language tests; improved medical terminology recognition; better speaker |
|   |   | identification; context-aware extraction; dynamic questionnaires; medicine |
|   |   | catalogue matching; follow-up automation groundwork. |
| Phase 3 - | Planned | WhatsApp delivery of approved documents (clinic's own Meta setup); CRM |
| Clinic |   | integration; Excel / Google Sheets reporting; full admin and doctor dashboards on |
| Management |   | the production backend; SMS delivery. |
| Integration |   |   |
| Phase 4 - | Planned | Centralised head-office dashboard; branch-wise analytics; advanced patient |
| Scalable |   | history; integration with other clinic management systems; expandable architecture |
| Healthcare |   | for additional Parasnath branches. |
| Platform |   |   |

## What "done" means at each phase

- Phase 1 is done when the acceptance criteria on page 15 pass in the built app.

- Phase 2 is done when live transcription beats the agreed accuracy bar on the synthetic test set - especially medicine names and doses - with flags catching the rest.

- Phase 3 is done when a patient actually receives an approved prescription on WhatsApp from the clinic's number, and the delivery is confirmed in the record.

- Phase 4 is done when a second branch runs on the same system and head office sees branch-wise reports without manual consolidation.


## Effort estimates and risks

Estimates below are planning ranges for the remaining work after the built Phase 1 MVP, assuming one builder with AI assistance and timely clinic inputs. They are planning aids, not commitments - the open items on page 15 move them more than the coding does.

| Work package | Estimate | Depends on |
| --- | --- | --- |
| Phase 2: connect live transcription + | 1-2 weeks | API key (OpenAI or Deepgram); clinic time to review |
| extraction, synthetic test set, accuracy |   | test outputs |
| validation |   |   |
| Phase 2: medicine catalogue + | 1-2 weeks | Clinic-approved medicine list from the doctors |
| dynamic questionnaires |   |   |
| Phase 3: production backend | 2-3 weeks | Hosting decision and accounts |
| hardening (FastAPI + PostgreSQL, |   |   |
| auth, audit, backups) |   |   |
| Phase 3: WhatsApp delivery + follow- | 1-2 weeks | Clinic's Meta app, WhatsApp number and template |
| up reminders |   | approvals |
| Phase 3: Sheets / Excel reporting | 3-5 days | Report formats the clinic wants |
| pack |   |   |
| Phase 4: multi-branch + head-office | 2-4 weeks | Second branch's doctors, data and rollout plan |
| analytics |   |   |
| Clinic pilot, training and fixes (runs | 1-2 weeks elapsed | Doctor and receptionist availability for feedback |
| alongside Phases 2-3) |   |   |

## Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Mixed Hindi-Marathi-English | High | Prototype validation before rollout (page 9); medicine catalogue |
| transcription mis-hears a |   | matching; every uncertain item flagged; doctor approval gate means |
| medicine name or dose |   | an error must survive a human check to reach a patient |
| A draft is shared before approval | High | Gate enforced in the service layer, not just the UI; delivery API |
| (process or software slip) |   | refuses non-approved documents; audit log on every share |
| Patient privacy breach or consent | High | Consent recorded before capture; encryption, role-based access, |
| gap |   | audit logs; synthetic data outside production; consent wording |
|   |   | approved by the clinic (Open Item 5) |
| Live features stall waiting for API | Medium | Mock adapters keep demos, training and the full workflow running; |
| keys / Meta setup |   | open items list names exactly who provides what |
| Doctors find review slower than | Medium | Pilot with real consultations early; measure review time; improve |
| writing |   | extraction prompts and templates from doctor corrections |
| Scope grows before Phase 1 is | Medium | Acceptance criteria fixed on page 15; new ideas go to Phases 2-4, |
| accepted |   | not into the MVP |


## Open items, decisions needed and acceptance criteria

## Open items - what is needed, and from whom

| # | Item | Needed from | Unlocks |
| --- | --- | --- | --- |
| 1 | Live transcription / AI API key - OpenAI | Jyoti / clinic account | Real transcription and extraction (Phase |
|   | or Deepgram - pasted into the app's | owner | 2) |
|   | Settings (never by chat or email) |   |   |
| 2 | Meta WhatsApp setup: clinic's Meta app, | Clinic, with guided | WhatsApp delivery and reminders |
|   | WhatsApp Business number, and | setup support | (Phase 3) |
|   | message template approval |   |   |
| 3 | Real clinic data to replace samples: | Jyoti / clinic | Clinic-ready PDFs and dashboards |
|   | doctors list, timings, branches, logo and |   |   |
|   | letterhead details |   |   |
| 4 | Clinic-approved medicine catalogue | Doctors | Catalogue matching and safer drafts |
|   | (names and standard doses actually |   | (Phase 2) |
|   | prescribed) |   |   |
| 5 | Patient consent wording for recording | Clinic | Live recording with real patients |
|   | and processing, approved for clinic use |   |   |
| 6 | Hosting and domain decision for the | Jyoti / clinic | Production deployment (Phase 3) |
|   | production system |   |   |
| 7 | Pilot plan: which doctor(s), which days, | Clinic | Accuracy measurement and Phase 2 |
|   | and how feedback is collected |   | sign-off |

## Phase 1 acceptance criteria - the MVP passes when all of these hold

- 1. A new patient can be registered and receives a unique Patient ID; searching by that ID, name or mobile finds them.

- 2. The pre-loaded knee-pain consultation can be opened in Approvals, edited, and approved - and only then does its PDF exist.

- 3. Before approval, the same consultation produces no PDF and cannot be delivered on any channel.

- 4. Recording cannot start without the consent box ticked; audio upload works as an alternative to the microphone.

- 5. The case paper shows all 12 sections; the prescription shows medicine, dosage, frequency, timing, duration, instructions and follow-up date - unclear items flagged, not filled in.

- 6. After approval, the consultation, its PDFs, medicines and follow-up date appear in the patient's history and in the dashboard counts.

- 7. Wherever the demo adapters are active, the screen says so - nothing mock is presented as live.

- 8. The full flow works in the Revonix theme in English, Hindi and Marathi, on phone and desktop.

Next step: Jyoti reviews this blueprint and the built MVP together. Approving the blueprint freezes Phase 1 scope; the first build action after that is Open Item 1 - connecting a live transcription key and running the synthetic accuracy test on page 9.

PARASNATH AI - one consultation, one AI-generated case paper, one approved prescription, one permanent digital patient record. Blueprint prepared 30 October 2026 for Parasnath Speciality Clinic, Badlapur - Revonix Solution.
