import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parasnath AI | Intelligent Medical Voice Assistant & Patient Documentation',
  description:
    'Full clinical documentation engine for Parasnath Speciality Clinic, Badlapur. Transforms doctor-patient consultations into AI-drafted case papers and doctor-approved prescriptions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="bg-slate-950 text-slate-100 h-full overflow-hidden font-sans selection:bg-purple-600 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
