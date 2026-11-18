'use client';

import { useState, useTransition, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  MapPin,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Phone,
  MessageCircle,
  Mail,
  Layers,
} from 'lucide-react';
import { getPublicBookingStatus } from '@/actions/booking-actions';
import { formatCurrencyLKR } from '@/lib/utils';
import { ACADEMY_CONFIG } from '@/lib/constants';

interface StatusBooking {
  booking_reference: string;
  customer_name: string;
  customer_email?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  service_title: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

function StatusContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const [searchInput, setSearchInput] = useState(initialRef);
  const [bookings, setBookings] = useState<StatusBooking[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLookup = (queryToLookup: string) => {
    if (!queryToLookup.trim()) return;
    setErrorMsg(null);
    setBookings([]);
    setSearched(true);

    startTransition(async () => {
      const res = await getPublicBookingStatus(queryToLookup.trim());
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.bookings) {
        setBookings(res.bookings as StatusBooking[]);
      }
    });
  };

  useEffect(() => {
    if (initialRef) {
      handleLookup(initialRef);
    }
  }, [initialRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(searchInput);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          title: 'Booking Confirmed!',
          desc: 'Coach Chanul has confirmed your reservation. Your table slot is secured.',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-amber-500',
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          title: 'Request Pending Review',
          desc: 'Your request has been received and is waiting for Coach Chanul’s confirmation.',
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          color: 'text-blue-500',
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          title: 'Session Completed',
          desc: 'This session has been marked completed.',
        };
      default:
        return {
          icon: XCircle,
          color: 'text-rose-500',
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          title: 'Booking Unavailable / Cancelled',
          desc: 'This slot could not be accommodated or was cancelled. Please request another time.',
        };
    }
  };

  return (
    <div className="min-h-[80vh] py-16 px-4">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/booking"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Booking
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101B35]">
            Check Booking Status
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Search by your <strong>Booking Reference</strong> (e.g. NGTT-...) or your <strong>Email Address</strong> to view reservation status.
          </p>
        </div>

        {/* Search Box */}
        <div className="rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Enter Reference (NGTT-...) or Email"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-[#101B35] placeholder-slate-400 focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#2675F5] px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 transition shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Search'}
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700 text-center">
              {errorMsg}
            </div>
          )}

          {/* Results List */}
          {bookings.length > 0 && (
            <div className="mt-6 space-y-6 animate-fade-in">
              <div className="text-xs font-semibold text-slate-500">
                Found {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}:
              </div>

              {bookings.map((item) => {
                const config = getStatusDisplay(item.status);
                const StatusIcon = config.icon;

                return (
                  <div
                    key={item.booking_reference}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-4 p-5"
                  >
                    {/* Status Banner */}
                    <div className={`rounded-xl border p-3.5 ${config.bg}`}>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${config.color}`} />
                        <span className="font-bold text-xs uppercase tracking-wide">
                          {config.title}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] opacity-90">{config.desc}</p>
                    </div>

                    {/* Booking Details Card */}
                    <div className="rounded-xl border border-slate-100 bg-[#F5F7FB] p-4 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <span className="text-slate-500">Booking Reference:</span>
                        <span className="font-mono font-bold text-[#2675F5] text-sm">
                          {item.booking_reference}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Athlete:</span>
                        <span className="font-bold text-[#101B35]">{item.customer_name}</span>
                      </div>

                      {item.customer_email && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Email:</span>
                          <span className="font-mono text-slate-700">{item.customer_email}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Service:</span>
                        <span className="font-semibold text-slate-800 capitalize">
                          {item.service_title.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Date & Time:</span>
                        <span className="font-semibold text-slate-800">
                          {item.booking_date} ({item.start_time} - {item.end_time})
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                        <span className="text-slate-500">Payment:</span>
                        <div className="text-right">
                          <span className="font-bold text-[#101B35] text-sm">
                            {formatCurrencyLKR(item.total_amount)}
                          </span>
                          <span className="ml-2 uppercase text-[10px] font-bold text-slate-500">
                            ({item.payment_status})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Complimentary Benefit */}
                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>Complimentary pool table access included during your booked session.</span>
                    </div>

                    {/* WhatsApp Quick Link */}
                    <a
                      href={`https://wa.me/94756399105?text=${encodeURIComponent(
                        `Hello Coach Chanul! Checking status for booking reference ${item.booking_reference}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with Coach on WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-[#2675F5]" />
        </div>
      }
    >
      <StatusContent />
    </Suspense>
  );
}
