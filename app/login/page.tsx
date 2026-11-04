'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, ShieldCheck, UserCheck, Lock, Mail, ArrowRight, Sparkles, KeyRound, Crown, UserPlus } from 'lucide-react';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), identifier: email.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Store authenticated session
      localStorage.setItem('parasnath_session_user', JSON.stringify(data.user));
      localStorage.setItem('parasnath_ai_v1_role', data.user.role);

      routeToRolePage(data.user.role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string, role: UserRole) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem('parasnath_session_user', JSON.stringify(data.user));
        localStorage.setItem('parasnath_ai_v1_role', role);
        routeToRolePage(role);
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const routeToRolePage = (role: UserRole) => {
    if (role === 'doctor') router.push('/doctor');
    else if (role === 'receptionist') router.push('/receptionist');
    else if (role === 'admin') router.push('/admin');
    else if (role === 'patient') router.push('/patient');
    else router.push('/');
  };

  return (
    <div className="h-screen w-screen overflow-y-auto bg-slate-950 flex flex-col items-center p-4 py-6 sm:py-10 selection:bg-purple-600 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10 space-y-4 my-auto">
        {/* Branding */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 items-center justify-center shadow-lg shadow-purple-900/40 mb-1">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            PARASNATH AI
          </h1>
          <p className="text-xs text-slate-400">
            Parasnath Speciality Clinic, Badlapur • Clinical Portal Authentication
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>Medical Portal Sign In</span>
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
              SQLite DB Protected
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Email Address or Mobile Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="name@gmail.com or 9820000000"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying Credentials...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => router.push('/register')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                title="Create a new Patient account"
              >
                <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                <span>Register (Patient)</span>
              </button>
            </div>
          </form>

          {/* Quick 1-Click Demo Buttons for Fast Showcase */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
            <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
              <span>Quick 1-Click Role Login:</span>
              <span className="text-[10px] text-purple-400 font-mono">Instant Showcase</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {/* Superadmin Button */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('superadmin@parasnath.com', 'superadmin123', 'admin')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-slate-200 text-left transition-colors col-span-2 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>👑 Superadmin (Head Office Director)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    superadmin@parasnath.com • superadmin123
                  </div>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  All Branches
                </span>
              </button>

              {/* Clinic Admin */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@parasnath.com', 'admin123', 'admin')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-left transition-colors"
              >
                <div className="font-bold text-white flex items-center gap-1">
                  <span>🛡️ Clinic Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">admin@parasnath.com</div>
              </button>

              {/* Doctor */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('doctor@parasnath.com', 'doctor123', 'doctor')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-left transition-colors"
              >
                <div className="font-bold text-white flex items-center gap-1">
                  <span>🩺 Doctor (Dr. Patil)</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">doctor@parasnath.com</div>
              </button>

              {/* Receptionist */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('reception@parasnath.com', 'reception123', 'receptionist')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-left transition-colors"
              >
                <div className="font-bold text-white flex items-center gap-1">
                  <span>📋 Receptionist</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">reception@parasnath.com</div>
              </button>

              {/* Patient */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient@parasnath.com', 'patient123', 'patient')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-left transition-colors"
              >
                <div className="font-bold text-white flex items-center gap-1">
                  <span>👤 Patient Portal</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">patient@parasnath.com</div>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-400">New patient to Parasnath Clinic?</span>
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 text-purple-200 hover:text-white border border-purple-700/60 font-bold transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm active:scale-98"
            >
              <UserPlus className="w-3.5 h-3.5 text-purple-400" />
              <span>Register Patient Account</span>
            </button>
          </div>
        </div>

        {/* Credentials Summary Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
          <div className="font-bold text-white flex items-center gap-1.5 mb-1">
            <KeyRound className="w-3.5 h-3.5 text-purple-400" />
            <span>Pre-Configured System Credentials (Password for all: username + 123):</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px]">
            <div><strong className="text-amber-400">Superadmin:</strong> superadmin@parasnath.com</div>
            <div><strong className="text-white">Password:</strong> superadmin123</div>
            <div><strong className="text-indigo-400">Clinic Admin:</strong> admin@parasnath.com</div>
            <div><strong className="text-white">Password:</strong> admin123</div>
            <div><strong className="text-purple-400">Doctor:</strong> doctor@parasnath.com</div>
            <div><strong className="text-white">Password:</strong> doctor123</div>
            <div><strong className="text-cyan-400">Receptionist:</strong> reception@parasnath.com</div>
            <div><strong className="text-white">Password:</strong> reception123</div>
            <div><strong className="text-emerald-400">Patient:</strong> patient@parasnath.com</div>
            <div><strong className="text-white">Password:</strong> patient123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
