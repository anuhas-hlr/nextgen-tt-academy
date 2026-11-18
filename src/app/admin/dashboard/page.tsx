import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Banknote,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  UserCheck,
  CircleDot,
} from 'lucide-react';
import { getAdminDashboardMetrics } from '@/actions/admin-actions';
import { formatCurrencyLKR, formatDisplayTime } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { approveBooking, rejectBooking } from '@/actions/admin-actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardOverview() {
  const metrics = await getAdminDashboardMetrics();

  const handleApprove = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    if (id) {
      await approveBooking(id);
      revalidatePath('/admin/dashboard');
    }
  };

  const handleReject = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    if (id) {
      await rejectBooking(id, 'Declined from quick dashboard overview');
      revalidatePath('/admin/dashboard');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2675F5]">
            Operational Command
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101B35]">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Welcome, Coach Chanul. Key academy performance metrics and today's schedule for {metrics.todayDate}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/calendar"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Calendar className="h-4 w-4 text-[#2675F5]" />
            <span>Open Calendar</span>
          </Link>

          <Link
            href="/admin/dashboard/bookings?status=pending"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2675F5] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 transition"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Pending ({metrics.pendingRequestsCount})</span>
          </Link>
        </div>
      </div>

      {/* 5 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Today's Bookings */}
        <div className="rounded-2xl bg-white p-5 shadow-card border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Bookings</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2675F5]">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#101B35]">
            {metrics.todayBookingsCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Scheduled on single table</p>
        </div>

        {/* Pending Requests */}
        <Link
          href="/admin/dashboard/bookings?status=pending"
          className="rounded-2xl bg-white p-5 shadow-card border border-amber-200 hover:border-amber-400 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Pending Review</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 group-hover:scale-105 transition">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-amber-600">
            {metrics.pendingRequestsCount}
          </p>
          <p className="mt-1 text-[11px] text-amber-700/80">Requires coach approval</p>
        </Link>

        {/* Confirmed Bookings */}
        <div className="rounded-2xl bg-white p-5 shadow-card border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Confirmed Slots</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#101B35]">
            {metrics.confirmedBookingsCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Active table reservations</p>
        </div>

        {/* Total Unique Players */}
        <Link
          href="/admin/dashboard/players"
          className="rounded-2xl bg-white p-5 shadow-card border border-slate-200 hover:border-[#2675F5] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Players</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#101B35]">
            {metrics.totalPlayersCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Registered in academy</p>
        </Link>

        {/* Today's Recorded Revenue */}
        <div className="rounded-2xl bg-white p-5 shadow-card border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-xl font-extrabold text-emerald-600">
            {formatCurrencyLKR(metrics.todayRecordedRevenue)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Only paid cash / transfer</p>
        </div>
      </div>

      {/* Main Grid: Upcoming Sessions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upcoming Sessions */}
        <div className="lg:col-span-8 rounded-3xl bg-white p-6 sm:p-8 shadow-card border border-slate-200">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-[#101B35]">Upcoming Table Tennis Sessions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time schedule for today and upcoming dates</p>
            </div>
            <Link
              href="/admin/dashboard/bookings"
              className="text-xs font-bold text-[#2675F5] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 space-y-3.5">
            {metrics.upcomingSessions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No active upcoming bookings recorded. Public booking requests will appear here instantly.
              </div>
            ) : (
              metrics.upcomingSessions.map((session: any) => {
                const isPending = session.status === 'pending';
                return (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#F5F7FB] p-4 border border-slate-200 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                        session.booking_type === 'personal-coaching'
                          ? 'bg-blue-100 text-[#2675F5]'
                          : session.booking_type === 'group-training'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {session.booking_type === 'personal-coaching' ? '1:1' : session.booking_type === 'group-training' ? 'GRP' : 'TBL'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#101B35] text-sm">
                            {session.customer_name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isPending
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {session.booking_date} • {formatDisplayTime(session.start_time)} – {formatDisplayTime(session.end_time)} ({session.duration_minutes} min)
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Ref: <strong className="font-mono text-slate-600">{session.booking_reference}</strong> • {session.customer_phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center self-end">
                      <span className="text-xs font-extrabold text-[#101B35] mr-2">
                        {formatCurrencyLKR(Number(session.total_amount))}
                      </span>

                      {isPending ? (
                        <div className="flex items-center gap-1.5">
                          <form action={handleApprove}>
                            <input type="hidden" name="id" value={session.id} />
                            <button
                              type="submit"
                              className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                            >
                              Approve
                            </button>
                          </form>
                          <form action={handleReject}>
                            <input type="hidden" name="id" value={session.id} />
                            <button
                              type="submit"
                              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                            >
                              Reject
                            </button>
                          </form>
                        </div>
                      ) : (
                        <Link
                          href={`/admin/dashboard/bookings?date=${session.booking_date}`}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Manage
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Academy Rules Quick Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-[#101B35] text-white p-6 sm:p-7 shadow-card">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2675F5]">
              Single-Table Enforcement
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              Active Conflict Prevention
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              NextGen operates <strong>1 competition table</strong>. The exclusion constraint prevents double-booking in real time across Personal, Group, and Court Rental requests.
            </p>

            <div className="mt-5 space-y-2.5 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Personal Coaching:</span>
                <span className="font-bold text-white">LKR 2,500 / hr</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Group Coaching:</span>
                <span className="font-bold text-white">LKR 2,500 / hr</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Table-Only Rental:</span>
                <span className="font-bold text-white">LKR 500 / hr</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Complimentary Pool Table:</span>
                <span className="font-bold text-emerald-400">Enabled</span>
              </div>
            </div>

            <div className="mt-6 pt-2">
              <Link
                href="/admin/dashboard/settings"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-xs font-bold text-white transition border border-white/15"
              >
                <span>Edit Academy Rates & Hours</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
