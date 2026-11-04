import { LanguageCode } from '@/types';

export const translations = {
  en: {
    clinicName: 'Parasnath Speciality Clinic',
    tagline: 'Intelligent Medical Voice Assistant & Digital Documentation',
    location: 'Badlapur Central',
    poweredBy: 'Revonix Solution - Healthcare AI',
    coreDoctrine: 'Documentation system, not an autonomous doctor. AI never diagnoses or invents medicines. Doctor approval required.',
    
    // Roles
    roleDoctor: 'Doctor',
    roleReceptionist: 'Receptionist',
    roleAdmin: 'Admin / Head Office',
    rolePatient: 'Patient',
    switchRole: 'Switch Role',
    
    // Modules
    navDashboard: 'Dashboard & Analytics',
    navPatientManagement: 'Patient Registration',
    navQuestionnaire: 'Health Questionnaire',
    navVoiceAssistant: 'Voice Assistant & Record',
    navApprovals: 'Doctor Approvals Queue',
    navCasePaper: 'Digital Case Paper',
    navPrescription: 'AI Prescription',
    navPatientCRM: 'Patient CRM & Timeline',
    navFollowUps: 'Follow-up Management',
    navReports: 'Excel & Data Export',
    navSettings: 'AI Models & .env Settings',
    
    // Status badges
    statusDraft: 'Draft',
    statusPending: 'Pending Approval',
    statusApproved: 'Approved & Signed',
    statusRejected: 'Rejected',
    mockActive: 'DEMO MOCK ADAPTER ACTIVE',
    liveActive: 'LIVE AI ADAPTER CONNECTED',
    
    // Dashboard KPIs
    kpiTotalPatients: 'Total Patients',
    kpiTodayConsultations: 'Today\'s Consultations',
    kpiTotalDoctors: 'Active Doctors',
    kpiPendingApprovals: 'Pending Approvals',
    kpiCompletedPrescriptions: 'Completed Prescriptions',
    kpiFollowUpsDue: 'Follow-ups Due',
    
    // Actions
    btnRegisterPatient: 'Register Patient',
    btnStartConsultation: 'Start Consultation',
    btnRecordAudio: 'Record Audio',
    btnUploadAudio: 'Upload Audio',
    btnApprove: 'Approve & Generate PDF',
    btnReject: 'Reject / Request Edit',
    btnDownloadPDF: 'Download PDF',
    btnPrint: 'Print Document',
    btnSendWhatsApp: 'Send WhatsApp',
    btnSendSMS: 'Send SMS Link',
    btnExportExcel: 'Export Excel',
    btnSaveDraft: 'Save Changes',
    
    // Clinical terms
    chiefComplaint: 'Chief Complaint',
    hpi: 'History of Present Illness',
    pastHistory: 'Past Medical History',
    examination: 'Physical & Clinical Examination',
    assessment: 'Clinical Assessment',
    suspectedDx: 'Suspected Diagnoses',
    confirmedDx: 'Confirmed Diagnoses',
    treatmentPlan: 'Treatment Plan',
    advice: 'Lifestyle & Dietary Advice',
    followUpDate: 'Follow-up Date',
    medicines: 'Prescribed Medicines',
    dosage: 'Dosage',
    frequency: 'Frequency',
    duration: 'Duration',
    timing: 'Timing',
    instructions: 'Instructions',
    flags: 'Safety Flags & Ambiguities',
    consentStatement: 'I confirm patient has given explicit informed consent for audio recording & AI-assisted clinical documentation under Indian DPDP Act.'
  },
  hi: {
    clinicName: 'पारसनाथ स्पेशालिटी क्लिनिक',
    tagline: 'इंटेलिजेंट मेडिकल वॉइस असिस्टेंट और डिजिटल मरीज दस्तावेज़ीकरण',
    location: 'बदलापूर मध्य',
    poweredBy: 'रेवोनिक्स सोल्यूशन - हेल्थकेयर एआई',
    coreDoctrine: 'यह दस्तावेज़ीकरण प्रणाली है, स्वायत्त डॉक्टर नहीं। एआई कभी निदान नहीं करता या दवाइयां नहीं बनाता। डॉक्टर की मंजूरी अनिवार्य है।',
    
    // Roles
    roleDoctor: 'डॉक्टर',
    roleReceptionist: 'रिसेप्शनिस्ट',
    roleAdmin: 'एडमिन / मुख्य कार्यालय',
    rolePatient: 'मरीज',
    switchRole: 'भूमिका बदलें',
    
    // Modules
    navDashboard: 'डैशबोर्ड और एनालिटिक्स',
    navPatientManagement: 'मरीज पंजीकरण',
    navQuestionnaire: 'स्वास्थ्य प्रश्नावली',
    navVoiceAssistant: 'वॉइस असिस्टेंट और रिकॉर्डिंग',
    navApprovals: 'डॉक्टर मंजूरी कतार',
    navCasePaper: 'डिजिटल केस पेपर',
    navPrescription: 'एआई पर्चा (प्रिस्क्रिप्शन)',
    navPatientCRM: 'मरीज सीआरएम और टाइमलाइन',
    navFollowUps: 'फॉलो-अप प्रबंधन',
    navReports: 'एक्सेल और डेटा निर्यात',
    navSettings: 'एआई मॉडल और .env सेटिंग्स',
    
    // Status badges
    statusDraft: 'ड्राफ्ट',
    statusPending: 'मंजूरी प्रतीक्षारत',
    statusApproved: 'स्वीकृत और हस्ताक्षरित',
    statusRejected: 'अस्वीकृत',
    mockActive: 'डेमो मॉक एडेप्टर सक्रिय',
    liveActive: 'लाइव एआई एडेप्टर कनेक्टेड',
    
    // Dashboard KPIs
    kpiTotalPatients: 'कुल पंजीकृत मरीज',
    kpiTodayConsultations: 'आज के परामर्श',
    kpiTotalDoctors: 'सक्रिय डॉक्टर',
    kpiPendingApprovals: 'लंबित स्वीकृतियां',
    kpiCompletedPrescriptions: 'पूर्ण पर्चे',
    kpiFollowUpsDue: 'आगामी फॉलो-अप्स',
    
    // Actions
    btnRegisterPatient: 'नया मरीज जोड़ें',
    btnStartConsultation: 'परामर्श शुरू करें',
    btnRecordAudio: 'ऑडियो रिकॉर्ड करें',
    btnUploadAudio: 'ऑडियो अपलोड करें',
    btnApprove: 'मंजूर करें और पीडीएफ बनाएं',
    btnReject: 'अस्वीकार / सुधार अनुरोध',
    btnDownloadPDF: 'पीडीएफ डाउनलोड करें',
    btnPrint: 'प्रिंट करें',
    btnSendWhatsApp: 'व्हाट्सएप भेजें',
    btnSendSMS: 'एसएमएस लिंक भेजें',
    btnExportExcel: 'एक्सेल निर्यात',
    btnSaveDraft: 'बदलाव सहेजें',
    
    // Clinical terms
    chiefComplaint: 'मुख्य शिकायत',
    hpi: 'वर्तमान बीमारी का इतिहास',
    pastHistory: 'पिछला चिकित्सीय इतिहास',
    examination: 'शारीरिक व चिकित्सीय परीक्षण',
    assessment: 'चिकित्सीय मूल्यांकन',
    suspectedDx: 'संभावित निदान (Suspected)',
    confirmedDx: 'पुष्ट निदान (Confirmed)',
    treatmentPlan: 'उपचार योजना',
    advice: 'जीवनशैली व आहार सलाह',
    followUpDate: 'अगली भेंट की तिथि (फॉलो-अप)',
    medicines: 'निर्धारित दवाइयां',
    dosage: 'मात्रा (खुराक)',
    frequency: 'बारंबारता',
    duration: 'अवधि',
    timing: 'समय (खाने से पहले/बाद)',
    instructions: 'विशेष निर्देश',
    flags: 'सुरक्षा अलर्ट और अस्पष्टताएं',
    consentStatement: 'मैं पुष्टि करता हूं कि मरीज ने ऑडियो रिकॉर्डिंग और एआई दस्तावेज़ीकरण के लिए स्पष्ट सहमति प्रदान की है।'
  },
  mr: {
    clinicName: 'पारसनाथ स्पेशालिटी क्लिनिक',
    tagline: 'इंटेलिजंट मेडिकल व्हॉईस असिस्टंट आणि डिजिटल रुग्ण दस्तऐवजीकरण',
    location: 'बदलापूर मध्य',
    poweredBy: 'रेव्होनिक्स सोल्यूशन - हेल्थकेअर एआय',
    coreDoctrine: 'ही दस्तऐवजीकरण प्रणाली आहे, स्वतंत्र डॉक्टर नाही. एआय कधीही निदान करत नाही किंवा औषधे सुचवत नाही. डॉक्टरांची मंजुरी आवश्यक आहे.',
    
    // Roles
    roleDoctor: 'डॉक्टर',
    roleReceptionist: 'रिसेप्शनिस्ट',
    roleAdmin: 'प्रशासक / मुख्य कार्यालय',
    rolePatient: 'रुग्ण',
    switchRole: 'भूमिका बदला',
    
    // Modules
    navDashboard: 'डॅशबोर्ड आणि विश्लेषण',
    navPatientManagement: 'रुग्ण नोंदणी',
    navQuestionnaire: 'आरोग्य प्रश्नावली',
    navVoiceAssistant: 'व्हॉईस असिस्टंट व रेकॉर्डिंग',
    navApprovals: 'डॉक्टर मंजुरी रांग',
    navCasePaper: 'डिजिटल केस पेपर',
    navPrescription: 'एआय प्रिस्क्रिप्शन (औषध पत्र)',
    navPatientCRM: 'रुग्ण सीआरएम आणि इतिहास',
    navFollowUps: 'फॉलो-अप व्यवस्थापन',
    navReports: 'एक्सेल आणि डेटा निर्यात',
    navSettings: 'एआय मॉडेल्स आणि .env सेटिंग्ज',
    
    // Status badges
    statusDraft: 'मसुदा',
    statusPending: 'मंजुरी प्रलंबित',
    statusApproved: 'मंजूर आणि स्वाक्षरीकृत',
    statusRejected: 'नाकारले',
    mockActive: 'डेमो मॉक अडॅप्टर सक्रिय',
    liveActive: 'लाईव्ह एआय अडॅप्टर जोडले आहे',
    
    // Dashboard KPIs
    kpiTotalPatients: 'एकूण नोंदणीकृत रुग्ण',
    kpiTodayConsultations: 'आजचे समुपदेशन',
    kpiTotalDoctors: 'कार्यरत डॉक्टर',
    kpiPendingApprovals: 'प्रलंबित मंजुऱ्या',
    kpiCompletedPrescriptions: 'पूर्ण प्रिस्क्रिप्शन',
    kpiFollowUpsDue: 'फॉलो-अप देय',
    
    // Actions
    btnRegisterPatient: 'नवीन रुग्ण नोंदणी',
    btnStartConsultation: 'समुपदेशन सुरू करा',
    btnRecordAudio: 'ऑडिओ रेकॉर्ड करा',
    btnUploadAudio: 'ऑडिओ अपलोड करा',
    btnApprove: 'मंजूर करा व पीडीएफ तयार करा',
    btnReject: 'नाकारा / दुरुस्ती सांगा',
    btnDownloadPDF: 'पीडीएफ डाउनलोड करा',
    btnPrint: 'प्रिंट करा',
    btnSendWhatsApp: 'व्हॉट्सॲप पाठवा',
    btnSendSMS: 'एसएमएस पाठवा',
    btnExportExcel: 'एक्सेल निर्यात',
    btnSaveDraft: 'बदल जतन करा',
    
    // Clinical terms
    chiefComplaint: 'मुख्य तक्रार',
    hpi: 'सध्याच्या आजाराचा इतिहास',
    pastHistory: 'मागील वैद्यकीय इतिहास',
    examination: 'शारीरिक तपासणी',
    assessment: 'वैद्यकीय मूल्यांकन',
    suspectedDx: 'संशयित निदान (Suspected)',
    confirmedDx: 'निश्चित निदान (Confirmed)',
    treatmentPlan: 'उपचार योजना',
    advice: 'जीवनशैली व आहार सल्ला',
    followUpDate: 'पुढील भेट तारीख',
    medicines: 'औषधांची यादी',
    dosage: 'डोस (मात्रा)',
    frequency: 'वारंवारता',
    duration: 'कालावधी',
    timing: 'वेळ (जेवणापूर्वी/नंतर)',
    instructions: 'सूचना',
    flags: 'सुरक्षा सूचना व संदिग्धता',
    consentStatement: 'मी पुष्टी करतो की रुग्णाने ऑडिओ रेकॉर्डिंग आणि एआय दस्तऐवजीकरणासाठी संमती दिली आहे.'
  }
};

export function getTranslation(lang: LanguageCode = 'en') {
  return translations[lang] || translations.en;
}

