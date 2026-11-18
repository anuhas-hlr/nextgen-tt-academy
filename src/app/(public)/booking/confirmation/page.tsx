'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || 'NG-PENDING';
  const bookingType = searchParams.get('type') || 'Table Session';
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const whatsappMessage = encodeURIComponent(
    `Hello Coach Chanul! I submitted a booking request for NextGen TT Academy. Reference: ${refCode}. Could you please confirm my session? Thank you!`
  );

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:py-24 text-center">
      <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl border border-slate-200">
        {/* Animated Badge */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 animate-fade-in">
          <Clock className="h-10 w-10 animate-pulse-slow" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Status: Pending Coach Approval</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101B35]">
          Booking Request Received
        </h1>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Thank you! Your requested session has been recorded. To protect court availability on our single competition table, requests are held until Coach Chanul reviews and confirms your slot.
        </p>

        {/* Reference Code Box */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 p-5 text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Booking Reference Number
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-[#2675F5] mt-1 select-all">
            {refCode}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Keep this reference code for your records and check-in.
          </p>
        </div>

        {/* Details Checklist */}
        <div className="mt-6 rounded-2xl bg-[#F5F7FB] p-5 text-left border border-slate-200 space-y-3 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#101B35]">Payment Policy: </span>
              <span>Pay physically in-person at the academy on the day of your session. No online prepayment required.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#101B35]">Complimentary Perk: </span>
              <span>Your booking includes complimentary access to the academy pool table during your reservation time.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-[#2675F5] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#101B35]">Location: </span>
              <a
                href={ACADEMY_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2675F5] hover:underline font-semibold"
              >
                NextGen Table Tennis Academy, Colombo (Open in Google Maps)
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={`/booking/status?ref=${refCode}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2675F5] px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-600 transition shadow-md shadow-blue-500/20"
          >
            <Clock className="h-4 w-4" />
            <span>Check Live Booking Status</span>
          </Link>

          <a
            href={`https://wa.me/94756399105?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Notify Coach on WhatsApp</span>
          </a>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <Link
              href="/"
              className="flex-1 rounded-xl bg-[#101B35] px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Return to Home
            </Link>
            <Link
              href="/booking"
              className="flex-1 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Make Another Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-slate-500 text-sm">
        Loading confirmation details...
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
