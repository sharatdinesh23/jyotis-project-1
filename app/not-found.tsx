import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-900/40">
        <Activity className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-2">404</h1>
      <h2 className="text-lg font-bold text-slate-300 mb-2">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        The clinical documentation page or record you are trying to reach does not exist.
      </p>
      <Link
        href="/login"
        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Login Portal</span>
      </Link>
    </div>
  );
}

