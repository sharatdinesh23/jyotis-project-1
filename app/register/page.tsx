'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Lock,
  User,
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [branch, setBranch] = useState('Badlapur Central');
  const [address, setAddress] = useState('Badlapur East');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!name.trim() || !email.trim() || !password.trim() || !mobile.trim() || !age) {
        throw new Error('Please fill in all required fields (Name, Email, Password, Mobile, Age).');
      }

      // Register User Account & Patient Profile in SQLite with enforced role 'patient'
      const authRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          role: 'patient', // Enforced: user can only register as patient
          branch,
          mobile: mobile.trim(),
          age: Number(age) || 30,
          gender,
          bloodGroup,
          address: address.trim(),
        }),
      });

      const authData = await authRes.json();
      if (!authRes.ok) {
        throw new Error(authData.error || 'Registration failed');
      }

      // Store active patient session with their exact registered name and patient ID
      localStorage.setItem('parasnath_session_user', JSON.stringify(authData.user));
      localStorage.setItem('parasnath_ai_v1_role', 'patient');

      // Route immediately to Patient Portal
      router.push('/patient');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-y-auto bg-slate-950 flex flex-col items-center p-4 py-6 sm:py-10 selection:bg-purple-600 selection:text-white">
      {/* Background glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl z-10 space-y-4 my-auto">
        {/* Branding */}
        <div className="text-center space-y-1">
          <div className="inline-flex w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 items-center justify-center shadow-lg shadow-purple-900/40 mb-0.5">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">
            PARASNATH AI
          </h1>
          <p className="text-[11px] text-slate-400">
            Parasnath Speciality Clinic, Badlapur • Patient Health Registration Portal
          </p>
        </div>

        {/* Security Gate Notice */}
        <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-start gap-2.5 text-xs text-purple-200">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-white">Patient Self-Registration Only:</span>{' '}
            <span className="text-slate-300">
              Doctors, Receptionists, and Admins are provisioned internally by Clinic Superadmin. Patients can create an account below.
            </span>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
          <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-400" />
              <span>Create Patient Health Account</span>
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
              Role: Patient
            </span>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-600/70 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            {/* Full Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Patient Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="patient@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Age, Gender, Blood Group */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Age (Years) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  placeholder="e.g. 45"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* Clinic Branch & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Clinic Branch *</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Badlapur Central">Badlapur Central</option>
                  <option value="Kalyan West">Kalyan West</option>
                  <option value="Thane East">Thane East</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Residential Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Badlapur East"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Prominent Submit Register Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-purple-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Registering Patient Account...' : 'Register Patient Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Already have an account */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Already registered or a clinic staff member?</span>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-slate-700 font-bold transition-colors"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
