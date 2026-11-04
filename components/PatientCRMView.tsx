'use client';

import React, { useState } from 'react';
import { Patient, Consultation, FollowUp, LanguageCode, UserRole } from '@/types';
import { getTranslation } from '@/lib/translations';
import {
  Users2,
  Search,
  FileSpreadsheet,
  FileDown,
  Calendar,
  Clock,
  Pill,
  ShieldCheck,
  CheckCircle2,
  FileText,
  User,
  Phone,
  ArrowRight
} from 'lucide-react';
import { exportCRMToExcel } from '@/lib/excelExport';
import { generateCasePaperPDF, generatePrescriptionPDF } from '@/lib/pdfGenerator';

interface PatientCRMViewProps {
  patients: Patient[];
  consultations: Consultation[];
  followUps: FollowUp[];
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  onSelectConsultation: (id: string) => void;
  onNavigateToView: (tab: any) => void;
}

export const PatientCRMView: React.FC<PatientCRMViewProps> = ({
  patients,
  consultations,
  followUps,
  currentRole,
  currentLanguage,
  onSelectConsultation,
  onNavigateToView,
}) => {
  const t = getTranslation(currentLanguage);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'PSC-2026-0084');

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.mobile.includes(q)
    );
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const patientConsultations = consultations.filter((c) => c.patientId === selectedPatient?.id);
  const patientFollowUps = followUps.filter((f) => f.patientId === selectedPatient?.id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-revonix-850/80 p-5 rounded-2xl border border-revonix-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">
              Module 10: Patient CRM & Longitudinal Timeline
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-revonix-purple-900 text-revonix-purple-300 font-mono font-bold">
              Admin & Doctor
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete multi-visit clinical record, cumulative medication history, and Excel / Google Sheets export.
          </p>
        </div>

        <button
          onClick={() => exportCRMToExcel(patients, consultations, followUps)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-600/50 text-xs sm:text-sm font-bold shadow transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Full CRM (.xlsx)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Directory Selector */}
        <div className="bg-revonix-850/80 border border-revonix-700/60 rounded-2xl p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, name, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-revonix-900 border border-revonix-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
            />
          </div>

          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {filteredPatients.map((p) => {
              const isSelected = p.id === selectedPatient?.id;
              const consultCount = consultations.filter((c) => c.patientId === p.id).length;

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-revonix-purple-900/50 border-revonix-purple-500 text-white shadow-md'
                      : 'bg-revonix-900/40 border-revonix-700/40 text-slate-300 hover:bg-revonix-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{p.name}</span>
                    <span className="font-mono text-[10px] text-revonix-purple-300">
                      {p.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>
                      {p.age}Y / {p.gender} • {p.mobile}
                    </span>
                    <span className="text-[10px] bg-revonix-850 px-1.5 py-0.2 rounded">
                      {consultCount} Visits
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 cols): Patient 360 & Chronological Timeline */}
        <div className="lg:col-span-2 space-y-5">
          {selectedPatient && (
            <>
              {/* Patient Profile Card */}
              <div className="bg-revonix-850/90 border border-revonix-700/60 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-revonix-700/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-revonix-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg">
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-white text-base">
                          {selectedPatient.name}
                        </h3>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-revonix-purple-900 text-revonix-purple-300">
                          {selectedPatient.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Registered: {selectedPatient.registeredDate} • Branch: {selectedPatient.branch}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="text-slate-300 font-mono flex items-center gap-1 justify-end">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedPatient.mobile}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Emergency: {selectedPatient.emergencyContact || 'Not recorded'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-revonix-900/60 border border-revonix-700/40">
                    <span className="text-slate-400 block text-[10px]">Age / Gender:</span>
                    <span className="font-semibold text-white">
                      {selectedPatient.age} Yrs / {selectedPatient.gender}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-revonix-900/60 border border-revonix-700/40">
                    <span className="text-slate-400 block text-[10px]">Blood Group:</span>
                    <span className="font-semibold text-white">
                      {selectedPatient.bloodGroup || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-revonix-900/60 border border-revonix-700/40 sm:col-span-2">
                    <span className="text-slate-400 block text-[10px]">Residential Address:</span>
                    <span className="text-slate-200 truncate block">
                      {selectedPatient.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultation Timeline */}
              <div className="bg-revonix-850/90 border border-revonix-700/60 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-revonix-purple-400" />
                  <span>Clinical Consultations History ({patientConsultations.length})</span>
                </h4>

                <div className="space-y-4">
                  {patientConsultations.map((c, idx) => {
                    const isApproved = c.status === 'approved';

                    return (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl bg-revonix-900/70 border border-revonix-700/60 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-revonix-800 pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">
                                Visit Date: {c.date}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                ({c.id})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Attending: {c.doctorName} • {c.branch}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isApproved ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Approved Record</span>
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                Pending Approval
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Chief complaint & clinical notes */}
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-revonix-purple-300 text-[11px] block">
                            Chief Complaints & Findings:
                          </span>
                          <p className="text-slate-200">{c.casePaper.chiefComplaints}</p>
                          <p className="text-slate-400 text-[11px]">
                            Assessment: {c.casePaper.clinicalAssessment.suspected || c.casePaper.clinicalAssessment.confirmed}
                          </p>
                        </div>

                        {/* Prescribed Medicines Preview */}
                        <div className="bg-revonix-950/80 p-2.5 rounded-lg border border-revonix-800 space-y-1.5 text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                            Prescribed Medications ({c.prescription.medicines.length}):
                          </span>
                          <div className="space-y-1">
                            {c.prescription.medicines.map((m) => (
                              <div
                                key={m.id}
                                className="flex items-center justify-between text-[11px] text-slate-300"
                              >
                                <span>
                                  • <strong>{m.name}</strong> ({m.dosage})
                                </span>
                                <span className="font-mono text-slate-400">
                                  {m.frequency} • {m.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Document Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-revonix-800 text-xs">
                          <span className="text-slate-400 text-[11px]">
                            Next Follow-up: <strong>{c.prescription.followUpDate || 'None'}</strong>
                          </span>

                          <div className="flex items-center gap-2">
                            {isApproved ? (
                              <>
                                <button
                                  onClick={() => {
                                    const doc = generateCasePaperPDF(c);
                                    doc.save(`CasePaper_${c.patientId}_${c.id}.pdf`);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-revonix-800 hover:bg-revonix-700 text-slate-200 text-[11px]"
                                >
                                  <FileText className="w-3 h-3 text-revonix-purple-400" />
                                  <span>Case Paper</span>
                                </button>

                                <button
                                  onClick={() => {
                                    const doc = generatePrescriptionPDF(c);
                                    doc.save(`Rx_${c.patientId}_${c.id}.pdf`);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-revonix-800 hover:bg-revonix-700 text-slate-200 text-[11px]"
                                >
                                  <Pill className="w-3 h-3 text-emerald-400" />
                                  <span>Prescription</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  onSelectConsultation(c.id);
                                  onNavigateToView('approvals');
                                }}
                                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px]"
                              >
                                Open in Approvals Gate
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

