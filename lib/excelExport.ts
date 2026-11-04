import * as XLSX from 'xlsx';
import { Consultation, Patient, FollowUp } from '@/types';

export function exportCRMToExcel(
  patients: Patient[],
  consultations: Consultation[],
  followUps: FollowUp[]
) {
  const wb = XLSX.utils.book_new();

  // 1. Patients Sheet
  const patientsData = patients.map(p => ({
    'Patient ID': p.id,
    'Full Name': p.name,
    'Age': p.age,
    'Gender': p.gender,
    'Mobile Number': p.mobile,
    'Email': p.email || 'N/A',
    'Blood Group': p.bloodGroup || 'N/A',
    'Clinic Branch': p.branch,
    'Registration Date': p.registeredDate,
    'Address': p.address
  }));
  const wsPatients = XLSX.utils.json_to_sheet(patientsData);
  XLSX.utils.book_append_sheet(wb, wsPatients, 'Patients Directory');

  // 2. Consultations & Case Papers Sheet
  const consultData = consultations.map(c => ({
    'Consultation ID': c.id,
    'Patient ID': c.patientId,
    'Patient Name': c.casePaper.patientDetails.name,
    'Attending Doctor': c.doctorName,
    'Date': c.date,
    'Status': c.status.toUpperCase(),
    'Chief Complaints': c.casePaper.chiefComplaints,
    'Suspected Diagnoses': c.extraction.suspectedDiagnoses.join('; ') || 'None',
    'Confirmed Diagnoses': c.extraction.confirmedDiagnoses.join('; ') || 'None',
    'Approved By': c.approvedBy || 'Pending',
    'Approved At': c.approvedAt ? new Date(c.approvedAt).toLocaleString() : 'N/A',
    'Prescribed Medicines Count': c.prescription.medicines.length,
    'Follow-up Date': c.prescription.followUpDate || 'None'
  }));
  const wsConsult = XLSX.utils.json_to_sheet(consultData);
  XLSX.utils.book_append_sheet(wb, wsConsult, 'Consultations Log');

  // 3. Medicines & Prescriptions Sheet
  const medicinesData: any[] = [];
  consultations.forEach(c => {
    c.prescription.medicines.forEach(m => {
      medicinesData.push({
        'Prescription ID': c.prescription.id,
        'Patient ID': c.patientId,
        'Patient Name': c.casePaper.patientDetails.name,
        'Medicine Name': m.name,
        'Form': m.form,
        'Dosage': m.dosage,
        'Frequency': m.frequency,
        'Timing': m.timing,
        'Duration': m.duration,
        'Special Instructions': m.instructions,
        'Status': c.status.toUpperCase()
      });
    });
  });
  const wsMeds = XLSX.utils.json_to_sheet(medicinesData);
  XLSX.utils.book_append_sheet(wb, wsMeds, 'Prescribed Medicines');

  // 4. Follow-up Tracking Sheet
  const fuData = followUps.map(f => ({
    'Follow-up ID': f.id,
    'Patient ID': f.patientId,
    'Patient Name': f.patientName,
    'Mobile': f.patientMobile,
    'Due Date': f.dueDate,
    'Reason': f.reason,
    'Reminders Sent': f.reminderCount,
    'Status': f.status.toUpperCase(),
    'Last Reminder At': f.lastReminderAt ? new Date(f.lastReminderAt).toLocaleString() : 'Never'
  }));
  const wsFu = XLSX.utils.json_to_sheet(fuData);
  XLSX.utils.book_append_sheet(wb, wsFu, 'Follow-up Schedule');

  // Write file
  XLSX.writeFile(wb, `Parasnath_AI_Clinic_CRM_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
}

