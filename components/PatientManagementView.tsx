'use client';

import React, { useState } from 'react';
import { Patient, UserRole, LanguageCode } from '@/types';
import { getTranslation } from '@/lib/translations';
import {
  UserPlus,
  Search,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Mic,
  ClipboardList,
  History,
  ShieldCheck,
  User
} from 'lucide-react';

interface PatientManagementViewProps {
  patients: Patient[];
  onRegisterPatient: (patientData: Omit<Patient, 'id' | 'registeredDate'>) => Promise<{ patient: Patient; isDuplicate: boolean }> | { patient: Patient; isDuplicate: boolean };
  onStartConsultationForPatient: (patient: Patient) => void;
  onOpenQuestionnaireForPatient: (patient: Patient) => void;
  onViewPatientTimeline: (patientId: string) => void;
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  currentBranch: string;
}

export const PatientManagementView: React.FC<PatientManagementViewProps> = ({
  patients,
  onRegisterPatient,
  onStartConsultationForPatient,
  onOpenQuestionnaireForPatient,
  onViewPatientTimeline,
  currentRole,
  currentLanguage,
  currentBranch,
}) => {
  const t = getTranslation(currentLanguage);

  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [branch, setBranch] = useState(currentBranch || 'Badlapur Central');

  // Duplicate warning notice
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.mobile.includes(q)
    );
  });

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMobile(val);

    // Duplicate check on mobile as required by blueprint
    if (val.replace(/[^0-9]/g, '').length >= 10) {
      const match = patients.find(p => p.mobile.replace(/[^0-9]/g, '').endsWith(val.replace(/[^0-9]/g, '').slice(-10)));
      if (match) {
        setDuplicateWarning(`Warning: Mobile number matches existing record: ${match.name} (${match.id}). Duplicate registration prevented.`);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !mobile) {
      alert('Please enter Name, Age and Mobile number.');
      return;
    }

    const res = await onRegisterPatient({
      name,
      age: Number(age),
      gender,
      mobile,
      email,
      address: address || 'Badlapur',
      emergencyContact,
      bloodGroup,
      branch,
    });

    if (res.isDuplicate) {
      setDuplicateWarning(`Patient already exists with ID: ${res.patient.id} (${res.patient.name}). Loaded profile.`);
    } else {
      setSuccessMessage(`New patient registered successfully with Unique ID: ${res.patient.id}!`);
      // Reset form
      setName('');
      setAge('');
      setMobile('');
      setEmail('');
      setAddress('');
      setEmergencyContact('');
      setDuplicateWarning(null);
      setTimeout(() => setSuccessMessage(null), 5000);
      setShowRegisterForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-revonix-850/80 p-5 rounded-2xl border border-revonix-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">Module 1: Patient Management</h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-revonix-purple-900 text-revonix-purple-300 font-mono font-bold">
              Receptionist Owner
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unique Patient ID spine, instant mobile duplicate validation, and centralized records.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-revonix-purple-600 to-indigo-600 hover:from-revonix-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showRegisterForm ? 'Close Registration Form' : '+ Register New Patient'}</span>
        </button>
      </div>

      {/* Success Notice */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Registration Form Modal / Panel */}
      {showRegisterForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-revonix-900 border border-revonix-purple-800/60 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-revonix-700/60 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-revonix-purple-400" />
              <span>Register Patient & Generate Unique ID</span>
            </h3>
            <span className="text-xs text-slate-400">
              Format: <code className="text-revonix-purple-300">PSC-2026-XXXX</code>
            </span>
          </div>

          {duplicateWarning && (
            <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-500 text-amber-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Joshi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Age *</label>
              <input
                type="number"
                required
                min={1}
                max={120}
                placeholder="e.g. 62"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mobile Number * (Duplicate Check)
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98201 23456"
                value={mobile}
                onChange={handleMobileChange}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="e.g. patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address & Locality</label>
              <input
                type="text"
                placeholder="e.g. Flat 402, Sai Shraddha Heights, Badlapur East"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Clinic Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              >
                <option value="Badlapur Central">Badlapur Central</option>
                <option value="Kalyan West">Kalyan West</option>
                <option value="Thane East">Thane East</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-revonix-700/60">
            <button
              type="button"
              onClick={() => setShowRegisterForm(false)}
              className="px-4 py-2 rounded-lg bg-revonix-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-revonix-purple-600 to-indigo-600 hover:from-revonix-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow"
            >
              Issue Patient ID & Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search patient by Patient ID (e.g. PSC-2026-0084), Name, or Mobile Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-revonix-850 border border-revonix-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-revonix-purple-500"
        />
        {searchQuery && (
          <span className="absolute right-3 top-2.5 text-[11px] text-slate-400 font-mono">
            {filteredPatients.length} found
          </span>
        )}
      </div>

      {/* Patients Grid / Table */}
      <div className="bg-revonix-850/90 border border-revonix-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-revonix-900/80 text-slate-400 border-b border-revonix-700/60">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name & Age</th>
                <th className="py-3 px-4">Contact & Mobile</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Quick Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-revonix-700/40 text-slate-200">
              {filteredPatients.map((p) => {
                const isAcceptanceCase = p.id === 'PSC-2026-0084';

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-revonix-800/40 transition-colors ${
                      isAcceptanceCase ? 'bg-revonix-purple-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-revonix-purple-300">
                        {p.id}
                      </div>
                      {isAcceptanceCase && (
                        <span className="inline-block text-[9px] bg-revonix-purple-900/80 text-revonix-purple-300 px-1.5 py-0.2 rounded font-semibold mt-0.5">
                          Knee Pain Benchmark
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.age} Yrs • {p.gender} • Blood Group: {p.bloodGroup || 'N/A'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-200 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{p.mobile}</span>
                      </div>
                      {p.email && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {p.email}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-300">{p.branch}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {p.registeredDate}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Pre-consultation Questionnaire */}
                        <button
                          onClick={() => onOpenQuestionnaireForPatient(p)}
                          className="p-1.5 rounded-lg bg-revonix-800 hover:bg-revonix-700 text-slate-300 hover:text-white transition-colors"
                          title="Open Pre-Consultation Health Questionnaire (Module 2)"
                        >
                          <ClipboardList className="w-4 h-4 text-cyan-400" />
                        </button>

                        {/* Start Voice Recording */}
                        <button
                          onClick={() => onStartConsultationForPatient(p)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-revonix-purple-600 hover:bg-revonix-500 text-white text-xs font-bold transition-colors shadow"
                          title="Start AI Voice Consultation (Module 3)"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>Consult</span>
                        </button>

                        {/* View Timeline */}
                        <button
                          onClick={() => onViewPatientTimeline(p.id)}
                          className="p-1.5 rounded-lg bg-revonix-800 hover:bg-revonix-700 text-slate-300 hover:text-white transition-colors"
                          title="View Longitudinal Patient History (Module 10)"
                        >
                          <History className="w-4 h-4 text-indigo-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

