'use client';

import React, { useState } from 'react';
import {
  Consultation,
  UserRole,
  LanguageCode,
  Doctor,
  CasePaper,
  Prescription,
  MedicineItem
} from '@/types';
import { getTranslation } from '@/lib/translations';
import {
  ShieldCheck,
  FileCheck2,
  FileX2,
  CheckCircle2,
  Clock,
  FileText,
  Pill,
  MessageSquare,
  AlertCircle,
  FileDown,
  Edit3,
  User,
  Calendar,
  Lock,
  Unlock
} from 'lucide-react';
import { generateCasePaperPDF, generatePrescriptionPDF } from '@/lib/pdfGenerator';

interface ApprovalsViewProps {
  consultations: Consultation[];
  activeConsultationId: string | null;
  onSelectConsultation: (id: string) => void;
  onApproveConsultation: (id: string, doctorName: string) => void;
  onRejectConsultation: (id: string, reason: string) => void;
  onUpdateCasePaper: (id: string, casePaper: Partial<CasePaper>) => void;
  onUpdatePrescription: (id: string, medicines: MedicineItem[], instructions: string[], followUpDate: string) => void;
  currentDoctor: Doctor;
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  onNavigateToView: (tab: any) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  consultations,
  activeConsultationId,
  onSelectConsultation,
  onApproveConsultation,
  onRejectConsultation,
  onUpdateCasePaper,
  onUpdatePrescription,
  currentDoctor,
  currentRole,
  currentLanguage,
  onNavigateToView,
}) => {
  const t = getTranslation(currentLanguage);

  const pendingConsultations = consultations.filter((c) => c.status === 'pending_approval');
  const selectedConsultation =
    consultations.find((c) => c.id === activeConsultationId) ||
    pendingConsultations[0] ||
    consultations[0];

  const [activeTab, setActiveTab] = useState<'case_paper' | 'prescription' | 'transcript' | 'flags'>('case_paper');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable Case paper state
  const [editableChiefComplaints, setEditableChiefComplaints] = useState(selectedConsultation?.casePaper?.chiefComplaints || '');
  const [editableHPI, setEditableHPI] = useState(selectedConsultation?.casePaper?.historyOfPresentIllness || '');
  const [editableExam, setEditableExam] = useState(selectedConsultation?.casePaper?.physicalExamination || '');
  const [editableSuspected, setEditableSuspected] = useState(selectedConsultation?.casePaper?.clinicalAssessment?.suspected || '');
  const [editableTreatment, setEditableTreatment] = useState(selectedConsultation?.casePaper?.treatmentPlan || '');
  const [editableAdvice, setEditableAdvice] = useState(selectedConsultation?.casePaper?.lifestyleDietAdvice || '');

  React.useEffect(() => {
    if (selectedConsultation) {
      setEditableChiefComplaints(selectedConsultation.casePaper?.chiefComplaints || '');
      setEditableHPI(selectedConsultation.casePaper?.historyOfPresentIllness || '');
      setEditableExam(selectedConsultation.casePaper?.physicalExamination || '');
      setEditableSuspected(selectedConsultation.casePaper?.clinicalAssessment?.suspected || '');
      setEditableTreatment(selectedConsultation.casePaper?.treatmentPlan || '');
      setEditableAdvice(selectedConsultation.casePaper?.lifestyleDietAdvice || '');
    }
  }, [selectedConsultation?.id]);

  if (!selectedConsultation) {
    return (
      <div className="bg-slate-900/60 p-12 text-center rounded-2xl border border-slate-800 text-slate-400">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Consultations Pending Review</h3>
        <p className="text-xs mt-1">All clinical drafts have been reviewed and approved.</p>
      </div>
    );
  }

  const isApproved = selectedConsultation.status === 'approved';
  const isPending = selectedConsultation.status === 'pending_approval';

  const handleSaveChanges = () => {
    onUpdateCasePaper(selectedConsultation.id, {
      chiefComplaints: editableChiefComplaints,
      historyOfPresentIllness: editableHPI,
      physicalExamination: editableExam,
      clinicalAssessment: {
        suspected: editableSuspected,
        confirmed: selectedConsultation.casePaper.clinicalAssessment.confirmed || '',
      },
      treatmentPlan: editableTreatment,
      lifestyleDietAdvice: editableAdvice,
    });
    setIsEditing(false);
  };

  const handleApprove = () => {
    if (currentRole !== 'doctor' && currentRole !== 'admin') {
      alert('SAFETY RULE: Only an authorized Doctor or Admin can approve clinical records.');
      return;
    }
    onApproveConsultation(selectedConsultation.id, currentDoctor.name);
  };

  const handleDownloadCasePaper = () => {
    try {
      const doc = generateCasePaperPDF(selectedConsultation);
      doc.save(`CasePaper_${selectedConsultation.patientId}_${selectedConsultation.id}.pdf`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDownloadPrescription = () => {
    try {
      const doc = generatePrescriptionPDF(selectedConsultation);
      doc.save(`Prescription_${selectedConsultation.patientId}_${selectedConsultation.id}.pdf`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Friendly Top Header with Low Cognitive Load */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-white">
              Doctor Review & Approval
            </h2>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
              Module 8
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review the AI-drafted consultation. Approved records unlock official PDFs for the patient.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isPending ? (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <FileX2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Reject Draft</span>
              </button>

              <button
                onClick={handleApprove}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Sign Clinical Record</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Approved & Signed</span>
              </span>

              <button
                onClick={handleDownloadCasePaper}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition-colors"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Case Paper PDF</span>
              </button>

              <button
                onClick={handleDownloadPrescription}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-colors"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Prescription PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Redesigned Calm Status Card (Replaces the screaming amber box) */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border transition-all ${
          isApproved
            ? 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
            : 'bg-indigo-950/25 border-indigo-500/30 text-indigo-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
              }`}
            >
              {isApproved ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {isApproved ? 'Record Finalized & Approved' : 'Draft Awaiting Doctor Approval'}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isApproved
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {selectedConsultation.id} (v{selectedConsultation.version})
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1">
                {isApproved
                  ? `Signed by ${selectedConsultation.approvedBy} on ${new Date(selectedConsultation.approvedAt || '').toLocaleDateString()}. Official PDFs are unlocked.`
                  : 'This consultation is in draft status. Official PDFs and digital delivery unlock once approved.'}
              </p>
            </div>
          </div>

          {/* Consultation Switcher (Clean, intuitive) */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400 whitespace-nowrap">Queue:</span>
            <select
              value={selectedConsultation.id}
              onChange={(e) => onSelectConsultation(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {consultations.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.casePaper.patientDetails.name} ({c.id}) - {c.status === 'approved' ? 'Approved' : 'Pending'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patient Summary Strip */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">Patient Name:</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              <span>{selectedConsultation.casePaper.patientDetails.name}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Patient ID:</span>
            <span className="font-mono text-purple-300 font-semibold">
              {selectedConsultation.casePaper.patientDetails.id}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Age / Gender:</span>
            <span className="text-slate-200">
              {selectedConsultation.casePaper.patientDetails.age} Yrs / {selectedConsultation.casePaper.patientDetails.gender}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Date:</span>
            <span className="text-slate-200 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{selectedConsultation.casePaper.visitDetails.date}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Clean Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('case_paper')}
          className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'case_paper'
              ? 'border-purple-500 text-white bg-slate-900/60 rounded-t-xl font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Case Paper Draft (12 Parts)</span>
        </button>

        <button
          onClick={() => setActiveTab('prescription')}
          className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'prescription'
              ? 'border-purple-500 text-white bg-slate-900/60 rounded-t-xl font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill className="w-4 h-4 text-emerald-400" />
          <span>Prescription Rx ({selectedConsultation.prescription.medicines.length} Medicines)</span>
        </button>

        <button
          onClick={() => setActiveTab('transcript')}
          className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'transcript'
              ? 'border-purple-500 text-white bg-slate-900/60 rounded-t-xl font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Voice Transcript</span>
        </button>

        <button
          onClick={() => setActiveTab('flags')}
          className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'flags'
              ? 'border-purple-500 text-white bg-slate-900/60 rounded-t-xl font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>Clinical Notes & Flags ({selectedConsultation.extraction?.flags?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: 12-PART CASE PAPER */}
      {activeTab === 'case_paper' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">
                12-Part Clinical Case Paper
              </h3>
              <p className="text-xs text-slate-400">
                Clinic header, history of present illness, examination findings, and management plan.
              </p>
            </div>

            {isPending && (
              <button
                onClick={() => {
                  if (isEditing) handleSaveChanges();
                  else setIsEditing(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                <span>{isEditing ? 'Save Edits' : 'Edit Sections'}</span>
              </button>
            )}
          </div>

          {/* Letterhead Header Preview */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col sm:flex-row justify-between gap-3 text-xs">
            <div>
              <h4 className="font-extrabold text-white text-sm">
                {selectedConsultation.casePaper.clinicDetails.name}
              </h4>
              <p className="text-purple-300 text-[11px]">
                {selectedConsultation.casePaper.clinicDetails.tagline}
              </p>
              <p className="text-slate-400 text-[10px] mt-0.5">
                {selectedConsultation.casePaper.clinicDetails.address}
              </p>
            </div>
            <div className="text-left sm:text-right font-mono text-[11px] text-slate-300">
              <div>Reg: {selectedConsultation.casePaper.clinicDetails.regNo}</div>
              <div>Doctor: {selectedConsultation.casePaper.visitDetails.doctorName}</div>
              <div>License: {selectedConsultation.casePaper.visitDetails.doctorReg}</div>
            </div>
          </div>

          {/* Clinical Sections */}
          <div className="space-y-4 text-xs">
            {/* Chief Complaints & HPI */}
            <div className="space-y-1.5">
              <span className="font-bold text-purple-300 uppercase text-[11px] block">
                Chief Complaints & History of Present Illness (HPI)
              </span>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editableChiefComplaints}
                    onChange={(e) => setEditableChiefComplaints(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  />
                  <textarea
                    rows={3}
                    value={editableHPI}
                    onChange={(e) => setEditableHPI(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-200 leading-relaxed">
                  <div className="font-semibold text-white mb-1">
                    {selectedConsultation.casePaper.chiefComplaints}
                  </div>
                  <div className="text-slate-300">
                    {selectedConsultation.casePaper.historyOfPresentIllness}
                  </div>
                </div>
              )}
            </div>

            {/* Past Medical History */}
            <div className="space-y-1.5">
              <span className="font-bold text-purple-300 uppercase text-[11px] block">
                Past Medical & Medication History
              </span>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-200">
                {selectedConsultation.casePaper.pastMedicalHistory}
              </div>
            </div>

            {/* Physical Examination */}
            <div className="space-y-1.5">
              <span className="font-bold text-cyan-300 uppercase text-[11px] block">
                Physical & Clinical Examination
              </span>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={editableExam}
                  onChange={(e) => setEditableExam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              ) : (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-200">
                  {selectedConsultation.casePaper.physicalExamination}
                </div>
              )}
            </div>

            {/* Clinical Assessment (Suspected vs Confirmed) */}
            <div className="space-y-1.5">
              <span className="font-bold text-amber-300 uppercase text-[11px] block">
                Clinical Assessment (Suspected vs Confirmed Segregated)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-600/30">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                    Suspected Diagnoses:
                  </span>
                  <div className="text-white font-medium">
                    {selectedConsultation.casePaper.clinicalAssessment.suspected || 'None stated'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-600/30">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                    Confirmed Diagnoses:
                  </span>
                  <div className="text-white font-medium">
                    {selectedConsultation.casePaper.clinicalAssessment.confirmed || 'Pending weight-bearing X-Ray confirmation'}
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment Plan */}
            <div className="space-y-1.5">
              <span className="font-bold text-purple-300 uppercase text-[11px] block">
                Treatment & Management Plan
              </span>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-200 whitespace-pre-line">
                {selectedConsultation.casePaper.treatmentPlan}
              </div>
            </div>

            {/* Lifestyle & Follow-up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-purple-300 uppercase text-[11px] block mb-1">
                  Lifestyle & Dietary Advice
                </span>
                <div className="text-slate-300 whitespace-pre-line">
                  {selectedConsultation.casePaper.lifestyleDietAdvice}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-amber-300 uppercase text-[11px] block mb-1">
                  Follow-up Advice
                </span>
                <div className="text-slate-200">
                  {selectedConsultation.casePaper.followUpAdvice}
                </div>
              </div>
            </div>

            {/* Approval & Signature Stamp */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white uppercase text-[11px] block">
                  Doctor Approval & Digital Stamp
                </span>
                <p className="text-[11px] text-slate-400">
                  {isApproved
                    ? `Digitally signed by ${selectedConsultation.approvedBy} on ${new Date(selectedConsultation.approvedAt || '').toLocaleString()}`
                    : 'Awaiting doctor signature. Signature stamp unlocks after approval.'}
                </p>
              </div>

              {isApproved && (
                <div className="px-3 py-1.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-800/60 font-mono text-[10px]">
                  VERIFIED: {selectedConsultation.casePaper.approvalSignature.digitalSignature || 'MMC_DOC_SIGNED'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI PRESCRIPTION DRAFT */}
      {activeTab === 'prescription' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">
                Prescription Draft (Rx)
              </h3>
              <p className="text-xs text-slate-400">
                Doctor-confirmed medications only. Never invents medicines or dosages.
              </p>
            </div>

            {isApproved && (
              <button
                onClick={handleDownloadPrescription}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download Rx PDF</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Medicine Name & Form</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Timing</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {selectedConsultation.prescription.medicines.map((med, idx) => (
                  <tr key={med.id || idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{med.name}</div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 font-mono">
                        {med.form}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{med.dosage || '-'}</td>
                    <td className="py-3 px-3 font-semibold text-purple-300">{med.frequency || '-'}</td>
                    <td className="py-3 px-3 text-slate-300">{med.timing || '-'}</td>
                    <td className="py-3 px-3 font-mono text-cyan-300">{med.duration || '-'}</td>
                    <td className="py-3 px-3 text-slate-300">{med.instructions || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Target Follow-Up Date:</span>
            <span className="font-mono font-bold text-amber-300">
              {selectedConsultation.prescription.followUpDate || 'Not specified'}
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSCRIPT */}
      {activeTab === 'transcript' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">
              Consultation Voice Transcript
            </h3>
            <p className="text-xs text-slate-400">
              Diarised multilingual audio transcript.
            </p>
          </div>

          <div className="space-y-2.5">
            {selectedConsultation.transcript.map((seg, idx) => {
              const isDoc = seg.speaker === 'Doctor';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border ${
                    isDoc
                      ? 'bg-purple-950/20 border-purple-800/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px]">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        isDoc ? 'bg-purple-900/80 text-purple-200' : 'bg-slate-800 text-cyan-300'
                      }`}
                    >
                      {seg.speaker}
                    </span>
                    <span className="font-mono text-slate-500 text-[10px]">[{seg.timestamp}]</span>
                  </div>
                  <p className="text-xs text-slate-200">{seg.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CLINICAL NOTES & FLAGS */}
      {activeTab === 'flags' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">
              Clinical Verification Flags
            </h3>
            <p className="text-xs text-slate-400">
              Items flagged for explicit doctor confirmation instead of AI guessing.
            </p>
          </div>

          <div className="space-y-3">
            {selectedConsultation.extraction?.flags?.map((flag) => (
              <div
                key={flag.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-amber-300 uppercase tracking-wide text-[10px]">
                    {flag.type} • {flag.field}
                  </div>
                  <p className="text-slate-200 mt-1">{flag.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileX2 className="w-4 h-4 text-rose-400" />
              <span>Reject Clinical Draft</span>
            </h3>
            <p className="text-xs text-slate-300">
              Please enter the clinical reason for rejection:
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Inaudible segment regarding medicine dose, please re-record."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRejectConsultation(selectedConsultation.id, rejectReason || 'Doctor requested corrections');
                  setShowRejectModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
