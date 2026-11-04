'use client';

import React from 'react';
import { UserRole, LanguageCode, Consultation, Patient, FollowUp } from '@/types';
import { getTranslation } from '@/lib/translations';
import {
  Users,
  Calendar,
  UserCheck,
  ClockAlert,
  FileCheck,
  CalendarCheck2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  Mic,
  PlusCircle,
  Building,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { exportCRMToExcel } from '@/lib/excelExport';

interface DashboardViewProps {
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  kpis: {
    totalPatients: number;
    todayConsultations: number;
    totalDoctors: number;
    pendingApprovals: number;
    completedPrescriptions: number;
    followUpsDue: number;
    overdueFollowUps: number;
  };
  recentConsultations: Consultation[];
  patients: Patient[];
  followUps: FollowUp[];
  onNavigate: (tab: any) => void;
  onSelectConsultation: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRole,
  currentLanguage,
  kpis,
  recentConsultations,
  patients,
  followUps,
  onNavigate,
  onSelectConsultation,
}) => {
  const t = getTranslation(currentLanguage);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-revonix-900 via-revonix-800 to-revonix-purple-900 p-6 border border-revonix-700/60 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-revonix-purple-500/20 text-revonix-purple-300 border border-revonix-purple-400/30 mb-2">
              <span>Parasnath Speciality Clinic</span>
              <span>•</span>
              <span>Badlapur Central</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Clinical Documentation Command Center
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              End-to-end voice consultation pipeline, doctor-in-the-loop approvals, and multi-branch digital health records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('voice_assistant')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-revonix-purple-600 to-indigo-600 hover:from-revonix-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-900/40 transition-all transform active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>{t.btnStartConsultation}</span>
            </button>

            <button
              onClick={() => onNavigate('patients')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-revonix-850 hover:bg-revonix-700 text-slate-200 text-xs sm:text-sm font-semibold border border-revonix-700/80 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{t.btnRegisterPatient}</span>
            </button>

            <button
              onClick={() => exportCRMToExcel(patients, recentConsultations, followUps)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs sm:text-sm font-semibold border border-emerald-700/50 transition-colors"
              title="Download Full Patient CRM in Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{t.btnExportExcel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Gate Alert Queue (if pending approvals exist) */}
      {kpis.pendingApprovals > 0 && (
        <div className="rounded-xl bg-amber-950/40 border border-amber-600/50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <ClockAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-amber-200 text-sm flex items-center gap-2">
                <span>Doctor Approval Required ({kpis.pendingApprovals} Pending Draft)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold uppercase">
                  Safety Gate
                </span>
              </h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                The knee-pain consultation for Ramesh Joshi (PSC-2026-0084) is awaiting clinical review. No PDF or delivery can occur until approved.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('approvals')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 transition-colors shadow"
          >
            <span>Review & Approve Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Live KPI Cards (Counted from live records) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="bg-revonix-850/90 border border-revonix-700/60 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.kpiTotalPatients}</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis.totalPatients}</div>
          <p className="text-[10px] text-slate-400 mt-1">Unique Patient IDs</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-revonix-850/90 border border-revonix-700/60 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.kpiTodayConsultations}</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis.todayConsultations}</div>
          <p className="text-[10px] text-slate-400 mt-1">Documented Today</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-revonix-850/90 border border-revonix-700/60 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.kpiTotalDoctors}</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis.totalDoctors}</div>
          <p className="text-[10px] text-slate-400 mt-1">Ortho & Physicians</p>
        </div>

        {/* KPI 4: Pending Approvals */}
        <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-amber-300 mb-2">
            <span className="text-xs font-medium">{t.kpiPendingApprovals}</span>
            <ClockAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{kpis.pendingApprovals}</div>
          <p className="text-[10px] text-amber-400/80 mt-1">Awaiting Doctor Signature</p>
        </div>

        {/* KPI 5 */}
        <div className="bg-revonix-850/90 border border-revonix-700/60 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.kpiCompletedPrescriptions}</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis.completedPrescriptions}</div>
          <p className="text-[10px] text-slate-400 mt-1">Signed with PDF</p>
        </div>

        {/* KPI 6 */}
        <div className="bg-revonix-850/90 border border-revonix-700/60 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.kpiFollowUpsDue}</span>
            <CalendarCheck2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis.followUpsDue}</div>
          <p className="text-[10px] text-cyan-300/80 mt-1">
            {kpis.overdueFollowUps > 0 ? `${kpis.overdueFollowUps} Overdue` : 'On track'}
          </p>
        </div>
      </div>

      {/* Main Grid: Consultations Log + Branch Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Consultations Table */}
        <div className="lg:col-span-2 bg-revonix-850/80 border border-revonix-700/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Recent Consultations</h3>
              <p className="text-xs text-slate-400">Live feed of voice-assisted visits & approvals</p>
            </div>
            <button
              onClick={() => onNavigate('crm')}
              className="text-xs text-revonix-purple-400 hover:text-revonix-purple-300 font-semibold flex items-center gap-1"
            >
              <span>View CRM Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-revonix-900/60 text-slate-400 border-b border-revonix-700/60">
                <tr>
                  <th className="py-2.5 px-3">Patient & ID</th>
                  <th className="py-2.5 px-3">Chief Complaint</th>
                  <th className="py-2.5 px-3">Doctor</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-revonix-700/40 text-slate-200">
                {recentConsultations.map((c) => {
                  const isPending = c.status === 'pending_approval';
                  const isApproved = c.status === 'approved';

                  return (
                    <tr key={c.id} className="hover:bg-revonix-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">
                          {c.casePaper.patientDetails.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {c.patientId} • {c.casePaper.patientDetails.age}Y/{c.casePaper.patientDetails.gender}
                        </div>
                      </td>

                      <td className="py-3 px-3 max-w-[200px]">
                        <div className="truncate text-slate-300" title={c.casePaper.chiefComplaints}>
                          {c.casePaper.chiefComplaints || 'Consultation in progress'}
                        </div>
                        <div className="text-[10px] text-revonix-purple-300">
                          {c.extraction?.suspectedDiagnoses?.[0] || 'Under evaluation'}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-300">{c.doctorName}</div>
                        <div className="text-[10px] text-slate-500">{c.date}</div>
                      </td>

                      <td className="py-3 px-3">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <ClockAlert className="w-3 h-3" />
                            <span>Pending Approval</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved & Signed</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {isPending ? (
                          <button
                            onClick={() => {
                              onSelectConsultation(c.id);
                              onNavigate('approvals');
                            }}
                            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors"
                          >
                            Review & Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectConsultation(c.id);
                              onNavigate('case_paper');
                            }}
                            className="px-2.5 py-1 rounded bg-revonix-700 hover:bg-revonix-600 text-slate-200 text-[11px] transition-colors"
                          >
                            View PDFs
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Multi-Branch & System Health */}
        <div className="space-y-4">
          {/* Branch Distribution */}
          <div className="bg-revonix-850/80 border border-revonix-700/60 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-revonix-purple-400" />
                <span>Branch Operations</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                Multi-Branch Ready
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-revonix-900/60 border border-revonix-700/40">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>Badlapur Central (Main)</span>
                  <span className="text-revonix-purple-300">Active • 100%</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Dr. Arvind Patil (MS Ortho) • 2 Consultations
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-revonix-900/40 border border-revonix-700/30">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Kalyan West</span>
                  <span className="text-slate-400">Connected</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Dr. Sneha Kulkarni (Physician)
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-revonix-900/40 border border-revonix-700/30">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Thane East</span>
                  <span className="text-slate-400">Phase 4 Ready</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Satellite Clinic Integration
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats on Safety & Privacy */}
          <div className="bg-gradient-to-br from-revonix-900 to-revonix-850 border border-revonix-purple-800/40 rounded-2xl p-5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-revonix-purple-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phase 1 Verification Gate</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Unapproved consultations strictly produce no PDFs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Consent mandatory before mic recording begins</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Suspected diagnoses separated from confirmed ones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>AI never invents medications or dosages</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

