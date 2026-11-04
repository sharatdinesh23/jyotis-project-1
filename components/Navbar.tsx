'use client';

import React from 'react';
import { UserRole, LanguageCode } from '@/types';
import { getTranslation } from '@/lib/translations';
import {
  Activity,
  Settings as SettingsIcon,
  ShieldCheck,
  Cpu,
  Sparkles,
  ChevronDown,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  onRoleChange: (role: UserRole) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenSettings: () => void;
  aiProvider: string;
  aiModel: string;
  currentBranch: string;
  onBranchChange: (branch: string) => void;
  sessionUserName?: string;
  sessionUserEmail?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentLanguage,
  onRoleChange,
  onLanguageChange,
  onOpenSettings,
  aiProvider,
  aiModel,
  currentBranch,
  onBranchChange,
  sessionUserName,
  sessionUserEmail,
}) => {
  const t = getTranslation(currentLanguage);

  const roleOptions: Record<UserRole, { label: string; icon: string; name: string }> = {
    doctor: { label: t.roleDoctor, icon: '🩺', name: 'Dr. Arvind Patil' },
    receptionist: { label: t.roleReceptionist, icon: '📋', name: 'Sunita Sharma' },
    admin: { label: t.roleAdmin, icon: '🛡️', name: 'Jyoti Bhanushali' },
    patient: { label: t.rolePatient, icon: '👤', name: 'Ramesh Joshi' },
  };

  const isMock = aiProvider === 'mock';

  return (
    <header className="flex-shrink-0 w-full bg-slate-950 border-b border-slate-800/80 z-30">
      {/* Subtle, calm doctrine banner with dedicated height so it never collides */}
      <div className="w-full bg-slate-900/90 border-b border-slate-800/60 px-4 py-1 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-300">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span className="truncate max-w-3xl">
          Clinical Documentation Assistant • Doctor Approval Required for all Medical Records
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Clean Brand Logo & Name (Guaranteed No Wrapping) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-purple-900/30">
            <Activity className="w-5 h-5 text-white" />
          </div>

          <div className="flex flex-col justify-center leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                Parasnath AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-700/50">
                Clinic
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
              Parasnath Speciality Clinic • Badlapur
            </span>
          </div>
        </div>

        {/* Center: Simplified Provider Status Badge (Low Cognitive Load) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              isMock
                ? 'bg-amber-950/30 text-amber-300 border-amber-600/40 hover:bg-amber-900/40'
                : 'bg-emerald-950/30 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/40'
            }`}
            title="Click to configure AI models or view .env keys"
          >
            {isMock ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Mode (Mock Adapter)</span>
                <span className="text-[10px] text-amber-400/80 font-normal">⚙ Configure</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="uppercase">{aiProvider}</span>
                <span className="text-[10px] text-slate-400">({aiModel})</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </>
            )}
          </button>
        </div>

        {/* Right: Clean, Friendly Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Segmented Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded transition-colors ${
                currentLanguage === 'en'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 rounded transition-colors ${
                currentLanguage === 'hi'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('mr')}
              className={`px-2 py-1 rounded transition-colors ${
                currentLanguage === 'mr'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Quick Dedicated Workspace Links */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px]">
            <a
              href="/doctor"
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Doctor Workspace"
            >
              🩺 Doctor
            </a>
            <a
              href="/receptionist"
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Receptionist Workspace"
            >
              📋 Reception
            </a>
            <a
              href="/admin"
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Head Office Admin"
            >
              🛡️ Admin
            </a>
            <a
              href="/patient"
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Patient Portal"
            >
              👤 Patient
            </a>
          </div>

          {/* Authenticated User Identity */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-base">{roleOptions[currentRole]?.icon || '🛡️'}</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-tight">
                {sessionUserName || roleOptions[currentRole]?.name || 'Clinical User'}
              </span>
              <span className="text-[10px] text-purple-400 font-mono leading-tight">
                {currentRole === 'admin' ? '🛡️ Administrator' : currentRole === 'doctor' ? '🩺 Doctor' : currentRole === 'receptionist' ? '📋 Reception' : '👤 Patient'}
              </span>
            </div>
          </div>

          {/* Settings Shortcut */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Configure AI Models & .env Keys"
          >
            <SettingsIcon className="w-4 h-4 text-purple-400" />
          </button>

          {/* Explicit Sign Out Button */}
          <button
            onClick={() => {
              if (confirm('Sign out of active clinical session?')) {
                localStorage.removeItem('parasnath_session_user');
                window.location.href = '/login';
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/60 text-xs font-bold transition-all shadow-sm"
            title="Sign Out of Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
