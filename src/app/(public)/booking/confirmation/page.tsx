import Link from 'next/link';
import { CheckCircle2, Calendar, MapPin, Sparkles, ArrowRight, Phone } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Booking Confirmation | NextGen TT Academy',
  description: 'Your session has been registered at NextGen Table Tennis Academy.',
};

export default function BookingConfirmationPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:py-28 text-center">
      <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl border border-slate-200">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-fade-in">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-2">
          Slot Reserved
        </span>
        <h1 className="text-3xl font-extrabold text-[#101B35]">Booking Confirmed!</h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Your table tennis session at NextGen Academy has been successfully reserved.
        </p>

        <div className="mt-8 rounded-2xl bg-[#F5F7FB] p-5 text-left border border-slate-200 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2 text-[#101B35] font-semibold">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Complimentary pool table included with session</span>
          </div>
          <div className="flex items-center gap-2 text-[#101B35] font-semibold">
            <MapPin className="h-4 w-4 text-[#2675F5]" />
            <span>NextGen TT Academy, Colombo, Sri Lanka</span>
          </div>
          <div className="flex items-center gap-2 text-[#101B35] font-semibold">
            <Phone className="h-4 w-4 text-emerald-500" />
            <a href={ACADEMY_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition">
              WhatsApp / Phone: {ACADEMY_CONFIG.phone}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-xl bg-[#101B35] px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/booking"
            className="rounded-xl bg-[#2675F5] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition shadow-md shadow-blue-500/20"
          >
            Book Another Slot
          </Link>
        </div>
      </div>
    </div>
  );
}
