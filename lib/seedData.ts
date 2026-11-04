import { Patient, Doctor, Branch, Consultation, FollowUp, AuditLog } from '@/types';

export const initialDoctors: Doctor[] = [
  {
    id: 'DOC-01',
    name: 'Dr. Arvind Patil',
    qualifications: 'MBBS, MS (Orthopaedics), DNB',
    speciality: 'Senior Orthopaedic Consultant & Joint Specialist',
    regNo: 'MMC-2014-08976',
    branch: 'Badlapur Central',
    role: 'doctor',
    avatar: '👨‍⚕️'
  },
  {
    id: 'DOC-02',
    name: 'Dr. Sneha Kulkarni',
    qualifications: 'MBBS, DNB (General Medicine)',
    speciality: 'Consultant Physician & Diabetologist',
    regNo: 'MMC-2016-12450',
    branch: 'Kalyan West',
    role: 'doctor',
    avatar: '👩‍⚕️'
  }
];

export const initialBranches: Branch[] = [
  {
    id: 'BR-01',
    name: 'Badlapur Central',
    address: 'Plot 12, Katrap Road, Badlapur East, Maharashtra 421503',
    contact: '+91 251 269 8800',
    active: true
  },
  {
    id: 'BR-02',
    name: 'Kalyan West',
    address: 'Shivaji Chowk, Station Road, Kalyan West, Maharashtra 421301',
    contact: '+91 251 220 4400',
    active: true
  },
  {
    id: 'BR-03',
    name: 'Thane East',
    address: 'Near Station, Kopri Colony, Thane East, Maharashtra 400603',
    contact: '+91 22 2532 9900',
    active: true
  }
];

export const initialPatients: Patient[] = [
  {
    id: 'PSC-2026-0084',
    name: 'Ramesh Joshi',
    age: 62,
    gender: 'Male',
    mobile: '+91 98201 23456',
    email: 'ramesh.joshi@example.com',
    address: 'Flat 402, Sai Shraddha Heights, Gandhi Chowk, Badlapur East',
    emergencyContact: 'Amit Joshi (Son): +91 98201 98765',
    bloodGroup: 'B+',
    branch: 'Badlapur Central',
    registeredDate: '2026-10-30'
  },
  {
    id: 'PSC-2026-0085',
    name: 'Priya Deshmukh',
    age: 38,
    gender: 'Female',
    mobile: '+91 97654 32109',
    email: 'priya.deshmukh@example.com',
    address: 'B-14, Neelkanth Vihar, Katrap, Badlapur East',
    emergencyContact: 'Rajesh Deshmukh (Husband): +91 97654 00000',
    bloodGroup: 'O+',
    branch: 'Badlapur Central',
    registeredDate: '2026-10-29'
  },
  {
    id: 'PSC-2026-0086',
    name: 'Anand Shinde',
    age: 54,
    gender: 'Male',
    mobile: '+91 98902 11223',
    email: 'anand.shinde@example.com',
    address: 'A-301, Vighnaharta Residency, Station Road, Badlapur',
    emergencyContact: 'Sunita Shinde: +91 98902 33445',
    bloodGroup: 'A+',
    branch: 'Badlapur Central',
    registeredDate: '2026-10-25'
  }
];

export const sampleKneePainConsultation: Consultation = {
  id: 'CON-2026-0101',
  patientId: 'PSC-2026-0084',
  doctorId: 'DOC-01',
  doctorName: 'Dr. Arvind Patil',
  date: '2026-10-30',
  consentRecorded: true,
  consentTimestamp: '2026-10-30T10:15:22Z',
  consentBy: 'Ramesh Joshi (Self)',
  audioDuration: 135,
  status: 'pending_approval', // Sits unapproved in Approvals queue as required by Page 4 & 15 of blueprint!
  branch: 'Badlapur Central',
  language: 'Mixed',
  version: 1,
  deliveryStatus: {
    whatsapp: 'not_sent',
    sms: 'not_sent',
    portal: 'available'
  },
  transcript: [
    {
      id: 't-1',
      speaker: 'Doctor',
      timestamp: '00:02',
      text: 'नमस्ते रमेशजी, बैठिए। बताइए आज क्या तकलीफ हो रही है?',
      language: 'hi'
    },
    {
      id: 't-2',
      speaker: 'Patient',
      timestamp: '00:08',
      text: 'डॉक्टर साहब, पिछले 6 महीने से सीधे घुटने में (Right knee) बहुत दर्द है। सीढ़ियां चढ़ते-उतरते वक्त बहुत ज्यादा दर्द होता है। सुबह उठने पर 20-25 मिनट घुटना अकड़ा रहता है।',
      language: 'hi'
    },
    {
      id: 't-3',
      speaker: 'Doctor',
      timestamp: '00:24',
      text: 'सीढ़ियों के अलावा क्या जमीन पर पालथी मारकर बैठने में भी दिक्कत होती है? क्या घुटने में सूजन या कट-कट की आवाज आती है?',
      language: 'hi'
    },
    {
      id: 't-4',
      speaker: 'Patient',
      timestamp: '00:33',
      text: 'हां डॉक्टर, जमीन पर तो बिल्कुल बैठा नहीं जाता। चलते वक्त कभी-कभी कट-कट आवाज आती है और शाम को हल्की सूजन आ जाती है।',
      language: 'hi'
    },
    {
      id: 't-5',
      speaker: 'Doctor',
      timestamp: '00:44',
      text: 'ठीक है, मैं आपकी जांच कर लेता हूं। लेटिए जरा... यहां दबाने पर दर्द है?',
      language: 'hi'
    },
    {
      id: 't-6',
      speaker: 'Patient',
      timestamp: '00:52',
      text: 'आह! हां डॉक्टर साहब, अंदर की तरफ बहुत ज्यादा दर्द होता है।',
      language: 'hi'
    },
    {
      id: 't-7',
      speaker: 'Doctor',
      timestamp: '01:05',
      text: 'Examination: Crepitus is palpable in right knee joint. Tenderness along medial joint line. Flexion is restricted to approximately 110 degrees. No active gross effusion or heat.',
      language: 'en'
    },
    {
      id: 't-8',
      speaker: 'Patient',
      timestamp: '01:21',
      text: 'डॉक्टर साहब, मुझे तेज पेनकिलर से कभी-कभी पेट में गैस और एसिडिटी होती है, तो ध्यान रखिएगा।',
      language: 'hi'
    },
    {
      id: 't-9',
      speaker: 'Doctor',
      timestamp: '01:28',
      text: 'जी बिल्कुल। मैं दर्द के लिए केवल Tab Paracetamol 650mg लिख रहा हूं, 5 दिन के लिए, इसे हमेशा खाना खाने के बाद ही लेना है। साथ में दर्द कम करने के लिए Diclofenac Topical Gel दिन में दो बार हल्के हाथ से लगाना है। और हड्डियों की ताकत के लिए Calcium plus Vitamin D3 रोज एक गोली 30 दिन तक।',
      language: 'hi'
    },
    {
      id: 't-10',
      speaker: 'Doctor',
      timestamp: '01:46',
      text: 'जमीन पर पालथी मारकर बैठना और सीढ़ियां चढ़ना कम से कम करें। भारी वजन न उठाएं। मैं दोनों घुटनों का एक्स-रे लिख रहा हूं। 10 दिन बाद एक्स-रे रिपोर्ट के साथ फॉलो-अप के लिए आइएगा।',
      language: 'hi'
    }
  ],
  extraction: {
    patientSymptomsReported: 'Patient reports persistent right knee pain for 6 months. Pain severely worsens while climbing up or descending stairs. Associated with morning joint stiffness lasting 20 to 25 minutes, inability to sit cross-legged on the floor, joint clicking sensation, and mild evening swelling.',
    durationAndSeverity: 'Duration: 6 months. Severity: Moderate to severe on weight-bearing activities and stair negotiation.',
    relevantMedicalHistory: 'Known hypertensive on Tab Amlodipine 5mg OD. Reports history of gastric irritation and acidity with strong NSAID painkillers.',
    doctorClinicalObservations: 'Right Knee Joint: Palpable joint crepitus on passive range of motion. Point tenderness localized along the medial joint line. Active flexion restricted to ~110 degrees. No erythema, warmth, or gross joint effusion noted.',
    suspectedDiagnoses: [
      'Grade 2 Osteoarthritis - Right Knee (Medial Compartment)'
    ],
    confirmedDiagnoses: [],
    treatmentRecommendations: [
      'Avoid squatting, sitting on the floor, and strenuous stair climbing',
      'Apply ice pack or warm fermentation for 15 minutes twice daily',
      'Quadriceps isometric strengthening exercises once acute soreness eases',
      'Investigation advised: Digital X-Ray Bilateral Knees (AP and Lateral standing views)'
    ],
    medicinesMentioned: [
      {
        id: 'med-1',
        name: 'Tab. Paracetamol (Dolo 650)',
        form: 'Tablet',
        dosage: '650 mg',
        frequency: '1-0-1 (TDS as needed)',
        timing: 'After Food',
        duration: '5 days',
        instructions: 'Take strictly after meals with plenty of water. Stop once pain subsides.',
        flagged: false
      },
      {
        id: 'med-2',
        name: 'Diclofenac Topical Gel 1% (Volini)',
        form: 'Gel/Ointment',
        dosage: 'Topical application',
        frequency: 'Twice daily (BD)',
        timing: 'As Needed',
        duration: '10 days',
        instructions: 'Apply gently over the medial right knee. Do not rub vigorously.',
        flagged: false
      },
      {
        id: 'med-3',
        name: 'Tab. Calcium Carbonate 500mg + Vitamin D3 (Shelcal)',
        form: 'Tablet',
        dosage: '500 mg + 250 IU',
        frequency: 'Once daily (OD)',
        timing: 'After Food',
        duration: '30 days',
        instructions: 'Take after dinner with a glass of water.',
        flagged: false
      }
    ],
    lifestyleDietInstructions: [
      'Weight management to reduce biomechanical stress on knee joints',
      'Use western commode / raised toilet seat',
      'Wear cushioned supportive footwear',
      'Incorporate calcium-rich food items (milk, curd, sesame, green leafy vegetables)'
    ],
    followUpRecommendation: 'Follow-up in 10 days with digital X-Ray report of both knees (AP & Lateral views).',
    followUpDate: '2026-11-10',
    flags: [
      {
        id: 'fl-1',
        type: 'allergy_risk',
        message: 'Patient sensitive to NSAID gastric irritation. Doctor safely restricted oral pain medication to Paracetamol after food.',
        field: 'medicinesMentioned',
        resolved: true
      },
      {
        id: 'fl-2',
        type: 'suspected_vs_confirmed',
        message: 'Clinical suspicion of Grade 2 Osteoarthritis recorded. Final confirmation requires weight-bearing X-Ray bilateral knees.',
        field: 'assessment',
        resolved: false
      }
    ],
    providerUsed: 'Mock AI Adapter (Knee Pain Blueprint Benchmark)'
  },
  casePaper: {
    clinicDetails: {
      name: 'PARASNATH SPECIALITY CLINIC',
      tagline: 'Super Speciality Orthopaedics, Joint Care & General Health',
      address: 'Plot 12, Katrap Road, Badlapur East, Maharashtra 421503',
      contact: '+91 251 269 8800 / +91 98201 00000',
      email: 'care@parasnathclinic.com',
      branch: 'Badlapur Central',
      regNo: 'MH-THN-CLI-2020-0441'
    },
    patientDetails: {
      id: 'PSC-2026-0084',
      name: 'Ramesh Joshi',
      age: 62,
      gender: 'Male',
      contact: '+91 98201 23456',
      bloodGroup: 'B+'
    },
    visitDetails: {
      date: '30 October 2026',
      time: '10:15 AM',
      doctorName: 'Dr. Arvind Patil, MS (Ortho)',
      doctorReg: 'MMC-2014-08976',
      visitType: 'Outpatient Follow-up'
    },
    chiefComplaints: 'Right knee pain for 6 months, severe on stairs, morning stiffness ~20 minutes.',
    historyOfPresentIllness: 'A 62-year-old male presents with gradual onset right knee discomfort over the last 6 months. Pain has intensified over the last 4 weeks, specifically while ascending and descending stairs and attempting to sit on the floor. Accompanied by joint stiffness upon waking up for 20-25 mins and mild crepitus. No history of recent acute trauma or fall.',
    pastMedicalHistory: 'Hypertension for 5 years on Tab Amlodipine 5mg. History of NSAID-induced gastric burning. No diabetes or ischemic heart disease.',
    physicalExamination: 'Vitals: BP 130/84 mmHg, Pulse 76/min. Right Knee: No gross effusion or erythema. Crepitus palpable on passive flexion/extension. Significant joint line tenderness localized over medial compartment. Knee flexion restricted to 110 degrees. Cruciate and collateral ligament tests stable.',
    clinicalAssessment: {
      suspected: 'Grade 2 Primary Osteoarthritis - Right Knee (Medial Joint Space Narrowing suspected)',
      confirmed: 'None at present. (Requires bilateral knee weight-bearing X-ray confirmation).'
    },
    treatmentPlan: '1. Tab Paracetamol 650mg TDS x 5 days (strictly after food)\n2. Diclofenac Topical Gel 1% BD x 10 days\n3. Tab Calcium + Vit D3 OD x 30 days\n4. Digital X-Ray Bilateral Knees AP & Lateral standing\n5. Physiotherapy & quadriceps isometric strengthening after acute pain decreases',
    lifestyleDietAdvice: 'Avoid squatting and cross-legged sitting. Use western toilet. Restrict strenuous stairs. Balanced diet with adequate calcium and hydration.',
    followUpAdvice: 'Review in 10 days (by 10-Nov-2026) with fresh bilateral knee X-ray film and report. If severe sudden swelling or redness occurs, review immediately.',
    approvalSignature: {
      approved: false, // Locked until doctor clicks Approve in Approval Gate!
      doctorName: 'Dr. Arvind Patil',
      timestamp: undefined,
      digitalSignature: undefined
    }
  },
  prescription: {
    id: 'RX-2026-0101',
    consultationId: 'CON-2026-0101',
    patientId: 'PSC-2026-0084',
    medicines: [
      {
        id: 'med-1',
        name: 'Tab. Paracetamol (Dolo 650)',
        form: 'Tablet',
        dosage: '650 mg',
        frequency: '1-0-1 (TDS as needed)',
        timing: 'After Food',
        duration: '5 days',
        instructions: 'Take strictly after meals with warm water. Discontinue if pain subsides.'
      },
      {
        id: 'med-2',
        name: 'Diclofenac Topical Gel 1% (Volini)',
        form: 'Gel/Ointment',
        dosage: 'Topical application',
        frequency: 'Twice daily (BD)',
        timing: 'As Needed',
        duration: '10 days',
        instructions: 'Apply gently over right knee. Do not rub vigorously.'
      },
      {
        id: 'med-3',
        name: 'Tab. Calcium Carbonate 500mg + Vitamin D3 (Shelcal)',
        form: 'Tablet',
        dosage: '500 mg + 250 IU',
        frequency: 'Once daily (OD)',
        timing: 'After Food',
        duration: '30 days',
        instructions: 'Take after dinner with water.'
      }
    ],
    instructions: [
      'Take all oral medicines strictly with or after meals.',
      'Apply gel gently without rough massage; wash hands after application.',
      'Get Digital X-Ray Bilateral Knees (AP and Lateral standing view) before next visit.'
    ],
    dietaryAdvice: [
      'Avoid high-purine foods if uric acid is elevated.',
      'Drink 2.5-3 litres of water daily.',
      'Include milk, paneer, sprouts, and leafy greens for calcium intake.'
    ],
    followUpDate: '2026-11-10',
    status: 'draft',
    flags: [
      {
        id: 'fl-1',
        type: 'allergy_risk',
        message: 'Patient has history of gastric discomfort with NSAIDs. Oral NSAIDs avoided; advised Paracetamol strictly after food.',
        field: 'medicines',
        resolved: true
      }
    ]
  }
};

export const sampleApprovedConsultation: Consultation = {
  id: 'CON-2026-0099',
  patientId: 'PSC-2026-0085',
  doctorId: 'DOC-01',
  doctorName: 'Dr. Arvind Patil',
  date: '2026-10-29',
  consentRecorded: true,
  consentTimestamp: '2026-10-29T11:00:00Z',
  consentBy: 'Priya Deshmukh (Self)',
  audioDuration: 90,
  status: 'approved',
  branch: 'Badlapur Central',
  language: 'Mixed',
  version: 1,
  approvedBy: 'Dr. Arvind Patil',
  approvedAt: '2026-10-29T11:20:00Z',
  deliveryStatus: {
    whatsapp: 'sent',
    sms: 'sent',
    portal: 'available',
    sentAt: '2026-10-29T11:25:00Z'
  },
  transcript: [
    { id: 't-1', speaker: 'Doctor', timestamp: '00:05', text: 'Good morning Priya. What brings you in today?', language: 'en' },
    { id: 't-2', speaker: 'Patient', timestamp: '00:12', text: 'Doctor, I have had lower back stiffness for 2 weeks from continuous desk work.', language: 'en' },
    { id: 't-3', speaker: 'Doctor', timestamp: '00:25', text: 'Any leg numbness or radiating shooting pain?', language: 'en' },
    { id: 't-4', speaker: 'Patient', timestamp: '00:30', text: 'No numbness, just muscle soreness around the lumbar area.', language: 'en' }
  ],
  extraction: {
    patientSymptomsReported: 'Lower back stiffness and muscular ache for 2 weeks following prolonged desk work. No radiculopathy.',
    durationAndSeverity: 'Duration: 2 weeks. Severity: Mild to moderate.',
    relevantMedicalHistory: 'Sedentary desk job (8-10 hours/day). No previous spine trauma.',
    doctorClinicalObservations: 'Lumbar paraspinal muscle spasm noted. SLRT negative bilateral (90 deg). Neurological exam normal.',
    suspectedDiagnoses: ['Mechanical Low Back Strain (Postural)'],
    confirmedDiagnoses: ['Acute Lumbar Muscle Strain'],
    treatmentRecommendations: ['Ergonomic lumbar support', 'Core strengthening exercises', 'Avoid slouching'],
    medicinesMentioned: [
      { id: 'm-1', name: 'Tab. Thiocolchicoside 4mg + Paracetamol 325mg', form: 'Tablet', dosage: '4mg/325mg', frequency: '1-0-1', timing: 'After Food', duration: '3 days', instructions: 'Take after meals.' }
    ],
    lifestyleDietInstructions: ['Take a 5-minute walking break every 45 minutes of sitting.', 'Sleep on firm mattress.'],
    followUpRecommendation: 'Review in 7 days if soreness persists.',
    followUpDate: '2026-11-05',
    flags: [],
    providerUsed: 'Mock AI Adapter'
  },
  casePaper: {
    clinicDetails: {
      name: 'PARASNATH SPECIALITY CLINIC',
      tagline: 'Super Speciality Orthopaedics, Joint Care & General Health',
      address: 'Plot 12, Katrap Road, Badlapur East, Maharashtra 421503',
      contact: '+91 251 269 8800',
      email: 'care@parasnathclinic.com',
      branch: 'Badlapur Central',
      regNo: 'MH-THN-CLI-2020-0441'
    },
    patientDetails: {
      id: 'PSC-2026-0085',
      name: 'Priya Deshmukh',
      age: 38,
      gender: 'Female',
      contact: '+91 97654 32109',
      bloodGroup: 'O+'
    },
    visitDetails: {
      date: '29 October 2026',
      time: '11:00 AM',
      doctorName: 'Dr. Arvind Patil, MS (Ortho)',
      doctorReg: 'MMC-2014-08976',
      visitType: 'First Consultation'
    },
    chiefComplaints: 'Lower back muscle soreness and stiffness for 2 weeks.',
    historyOfPresentIllness: '38-year-old software engineer reports lumbar stiffness worsening towards evening. Relieved by lying flat.',
    pastMedicalHistory: 'No chronic medical illness.',
    physicalExamination: 'Spine alignment normal. Paraspinal lumbar muscle tenderness present. Full spine flexion with mild tightness.',
    clinicalAssessment: {
      suspected: '',
      confirmed: 'Mechanical Postural Lumbar Strain'
    },
    treatmentPlan: 'Short course muscle relaxant with analgesic. Ergonomic postural adjustments.',
    lifestyleDietAdvice: 'Ergonomic chair with lumbar support. Dynamic stretching breaks.',
    followUpAdvice: 'Follow-up in 7 days if symptoms do not improve.',
    approvalSignature: {
      approved: true,
      doctorName: 'Dr. Arvind Patil',
      timestamp: '2026-10-29T11:20:00Z',
      digitalSignature: 'VERIFIED_DOC_PATIL_08976'
    }
  },
  prescription: {
    id: 'RX-2026-0099',
    consultationId: 'CON-2026-0099',
    patientId: 'PSC-2026-0085',
    medicines: [
      { id: 'm-1', name: 'Tab. Thiocolchicoside 4mg + Paracetamol 325mg', form: 'Tablet', dosage: '4mg/325mg', frequency: '1-0-1', timing: 'After Food', duration: '3 days', instructions: 'Take after meals.' }
    ],
    instructions: ['Take after food for 3 days only.'],
    dietaryAdvice: ['Stay hydrated, adequate water intake.'],
    followUpDate: '2026-11-05',
    status: 'approved',
    flags: []
  }
};

export const initialFollowUps: FollowUp[] = [
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
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-01',
    actor: 'Dr. Arvind Patil',
    role: 'doctor',
    action: 'approve',
    entity: 'Consultation CON-2026-0099',
    timestamp: '2026-10-29T11:20:00Z',
    details: 'Approved case paper and generated digital prescription for Priya Deshmukh (PSC-2026-0085).'
  },
  {
    id: 'LOG-02',
    actor: 'Sunita Sharma',
    role: 'receptionist',
    action: 'share',
    entity: 'Prescription RX-2026-0099',
    timestamp: '2026-10-29T11:25:00Z',
    details: 'Dispatched approved PDF link via WhatsApp to +91 97654 32109.'
  },
  {
    id: 'LOG-03',
    actor: 'Dr. Arvind Patil',
    role: 'doctor',
    action: 'create',
    entity: 'Consultation CON-2026-0101',
    timestamp: '2026-10-30T10:15:00Z',
    details: 'Patient consent confirmed. Recorded voice consultation for Ramesh Joshi (PSC-2026-0084).'
  }
];

