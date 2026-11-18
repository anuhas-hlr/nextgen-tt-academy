'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  XCircle,
  Ban,
  Layers,
  RefreshCw,
  Eye,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';
import { getCalendarData } from '@/actions/admin-actions';
import { formatLKR, formatTimeString, calculateEndTime } from '@/lib/utils';
import Link from 'next/link';

type CalendarViewMode = 'day' | 'week' | 'month';

interface CalendarBooking {
  id: string;
  booking_reference: string;
  player_name: string;
  player_phone: string;
  player_email?: string;
  service_type_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  total_amount: number;
  participants_count: number;
  notes?: string;
}

interface BlockedSlot {
  id: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  reason: string;
  is_all_day: boolean;
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00 to 21:00

export default function AdminCalendarPage() {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [isPending, startTransition] = useTransition();

  // Helper date calculators
  const getStartAndEndDate = (date: Date, mode: CalendarViewMode) => {
    const d = new Date(date);
    if (mode === 'day') {
      const dateStr = d.toISOString().slice(0, 10);
      return { start: dateStr, end: dateStr };
    } else if (mode === 'week') {
      // Find start of week (Monday)
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return {
        start: monday.toISOString().slice(0, 10),
        end: sunday.toISOString().slice(0, 10),
      };
    } else {
      // Month
      const year = d.getFullYear();
      const month = d.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      return {
        start: firstDay.toISOString().slice(0, 10),
        end: lastDay.toISOString().slice(0, 10),
      };
    }
  };

  const loadData = () => {
    setLoading(true);
    const { start, end } = getStartAndEndDate(currentDate, viewMode);
    startTransition(async () => {
      try {
        const res = await getCalendarData(start, end);
        setBookings(res.bookings as any || []);
        setBlockedSlots(res.blockedSlots as any || []);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, [currentDate, viewMode]);

  // Navigate dates
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Generate week days
  const getWeekDays = () => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      days.push(nextDay);
    }
    return days;
  };

  // Status color pill — light theme
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'rejected':
        return 'bg-slate-100 text-slate-500 border border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const getServiceColor = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('personal')) {
      return 'border-l-4 border-l-blue-500 bg-blue-50 text-blue-800';
    }
    if (serviceName.toLowerCase().includes('group')) {
      return 'border-l-4 border-l-purple-500 bg-purple-50 text-purple-800';
    }
    return 'border-l-4 border-l-amber-500 bg-amber-50 text-amber-800';
  };

  const weekDays = getWeekDays();

  return (
    <div className="space-y-6">
      {/* Top Header & Calendar Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101B35] flex items-center gap-2.5">
            <CalendarIcon className="h-7 w-7 text-[#2675F5]" />
            Academy Schedule Calendar
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time visual timetable for the Academy&apos;s single Table Tennis Table &amp; Coach Chanul.
          </p>
        </div>

        {/* View Mode Toggle & Navigation */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode('day')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'day'
                  ? 'bg-[#2675F5] text-white shadow-sm'
                  : 'text-slate-500 hover:text-[#101B35]'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'week'
                  ? 'bg-[#2675F5] text-white shadow-sm'
                  : 'text-slate-500 hover:text-[#101B35]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'month'
                  ? 'bg-[#2675F5] text-white shadow-sm'
                  : 'text-slate-500 hover:text-[#101B35]'
              }`}
            >
              Month
            </button>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 shadow-sm">
            <button
              onClick={handlePrev}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[#101B35] transition"
              title="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-[#101B35] transition"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[#101B35] transition"
              title="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100 hover:text-[#101B35] transition disabled:opacity-50 shadow-sm"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Date display banner & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold text-[#101B35]">
          {viewMode === 'day' &&
            currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          {viewMode === 'week' && (
            <span>
              Week of {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {weekDays[6].toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
          {viewMode === 'month' &&
            currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-blue-500"></span>
            <span>Personal Coaching</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-purple-500"></span>
            <span>Group Coaching</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-amber-500"></span>
            <span>Table Rental</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-rose-500"></span>
            <span>Blocked / Closed</span>
          </div>
        </div>
      </div>

      {/* Main Calendar View Area */}
      {viewMode === 'week' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="min-w-[800px]">
            {/* Week Days Header */}
            <div className="grid grid-cols-8 border-b border-slate-200 bg-[#F5F7FB] text-xs font-semibold text-slate-500">
              <div className="p-3 text-center border-r border-slate-200 text-slate-400">Time</div>
              {weekDays.map((date, idx) => {
                const isToday =
                  date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);
                return (
                  <div
                    key={idx}
                    className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${
                      isToday ? 'bg-blue-50 text-[#2675F5]' : ''
                    }`}
                  >
                    <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div
                      className={`mt-0.5 text-base font-bold ${
                        isToday ? 'text-[#2675F5]' : 'text-[#101B35]'
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="divide-y divide-slate-100">
              {HOURS.map((hour) => {
                const hourFormatted = `${hour.toString().padStart(2, '0')}:00`;
                return (
                  <div key={hour} className="grid grid-cols-8 min-h-[64px]">
                    {/* Hour label */}
                    <div className="p-2 text-right pr-3 text-xs font-mono text-slate-400 border-r border-slate-200">
                      {hourFormatted}
                    </div>

                    {/* Columns for each day */}
                    {weekDays.map((dayDate, dayIdx) => {
                      const dayStr = dayDate.toISOString().slice(0, 10);
                      const dayBookings = bookings.filter((b) => {
                        if (b.booking_date !== dayStr) return false;
                        const bHour = parseInt(b.start_time.slice(0, 2), 10);
                        return bHour === hour;
                      });

                      const dayBlocks = blockedSlots.filter((bl) => {
                        const inRange = bl.start_date <= dayStr && bl.end_date >= dayStr;
                        if (!inRange) return false;
                        if (bl.is_all_day) return hour === 9; // Display all-day block at 9 AM slot
                        if (bl.start_time) {
                          const blHour = parseInt(bl.start_time.slice(0, 2), 10);
                          return blHour === hour;
                        }
                        return false;
                      });

                      return (
                        <div
                          key={dayIdx}
                          className="relative p-1 border-r border-slate-200 last:border-r-0 hover:bg-blue-50/30 transition group"
                        >
                          {/* Render Bookings */}
                          {dayBookings.map((bk) => (
                            <button
                              key={bk.id}
                              onClick={() => setSelectedBooking(bk)}
                              className={`w-full mb-1 p-1.5 rounded-lg text-left shadow-sm transition hover:scale-[1.02] ${getServiceColor(
                                bk.service_type_name
                              )}`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span>{bk.start_time.slice(0, 5)} - {bk.end_time.slice(0, 5)}</span>
                                <span
                                  className={`rounded px-1 text-[9px] uppercase font-bold ${
                                    bk.status === 'confirmed'
                                      ? 'text-emerald-600'
                                      : bk.status === 'pending'
                                      ? 'text-amber-600'
                                      : 'text-slate-500'
                                  }`}
                                >
                                  {bk.status}
                                </span>
                              </div>
                              <div className="text-xs font-semibold truncate mt-0.5">
                                {bk.player_name}
                              </div>
                              <div className="text-[10px] opacity-75 truncate">
                                {bk.service_type_name}
                              </div>
                            </button>
                          ))}

                          {/* Render Blocked Periods */}
                          {dayBlocks.map((bl) => (
                            <div
                              key={bl.id}
                              className="w-full mb-1 p-1.5 rounded-lg border-l-4 border-l-rose-500 bg-rose-50 text-rose-700 text-xs"
                            >
                              <div className="flex items-center gap-1 font-bold text-[11px]">
                                <Ban className="h-3 w-3 text-rose-500" />
                                <span>Blocked</span>
                              </div>
                              <div className="truncate text-[10px]">{bl.reason}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {HOURS.map((hour) => {
              const hourFormatted = `${hour.toString().padStart(2, '0')}:00`;
              const dayStr = currentDate.toISOString().slice(0, 10);
              const hourBookings = bookings.filter((b) => {
                if (b.booking_date !== dayStr) return false;
                const bHour = parseInt(b.start_time.slice(0, 2), 10);
                return bHour === hour;
              });

              return (
                <div key={hour} className="flex min-h-[72px] items-start hover:bg-blue-50/20 transition">
                  <div className="w-24 shrink-0 p-3 text-right text-xs font-mono text-slate-400 border-r border-slate-200">
                    {hourFormatted}
                  </div>
                  <div className="flex-1 p-2 space-y-2">
                    {hourBookings.length === 0 ? (
                      <div className="text-xs text-slate-300 italic py-1">Available</div>
                    ) : (
                      hourBookings.map((bk) => (
                        <div
                          key={bk.id}
                          onClick={() => setSelectedBooking(bk)}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg cursor-pointer transition hover:brightness-95 ${getServiceColor(
                            bk.service_type_name
                          )}`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{bk.player_name}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase bg-white/60">
                                {bk.service_type_name}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${getStatusBadge(bk.status)}`}>
                                {bk.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs opacity-75">
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="h-3.5 w-3.5" />
                                {bk.start_time.slice(0, 5)} - {bk.end_time.slice(0, 5)} ({bk.duration_minutes} min)
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                {bk.player_phone}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center gap-3">
                            <span className="text-sm font-bold">{formatLKR(bk.total_amount)}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                bk.payment_status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {bk.payment_status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-slate-500 mb-2">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>
          {/* Calendar grid for current month */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => {
              // Simple month calendar filler
              const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              const dayOffset = (firstDay.getDay() + 6) % 7; // Monday start
              const slotDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - dayOffset + 1);
              const dateStr = slotDate.toISOString().slice(0, 10);
              const isCurrentMonth = slotDate.getMonth() === currentDate.getMonth();

              const dayBookings = bookings.filter((b) => b.booking_date === dateStr);

              return (
                <div
                  key={i}
                  className={`min-h-[90px] p-1.5 rounded-lg border transition ${
                    isCurrentMonth
                      ? 'border-slate-200 bg-white text-[#101B35]'
                      : 'border-slate-100 bg-[#F5F7FB] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={isCurrentMonth ? 'text-[#101B35]' : 'text-slate-300'}>
                      {slotDate.getDate()}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="rounded-full bg-[#2675F5] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayBookings.slice(0, 2).map((bk) => (
                      <button
                        key={bk.id}
                        onClick={() => setSelectedBooking(bk)}
                        className="w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 block"
                      >
                        {bk.start_time.slice(0, 5)} {bk.player_name}
                      </button>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-[9px] text-slate-400 pl-1">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#2675F5]">
                  {selectedBooking.booking_reference}
                </span>
                <h3 className="text-xl font-bold text-[#101B35]">{selectedBooking.player_name}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#101B35] transition"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg bg-[#F5F7FB] p-3">
                <span className="text-slate-500">Service Type</span>
                <p className="mt-1 font-semibold text-[#101B35]">{selectedBooking.service_type_name}</p>
              </div>
              <div className="rounded-lg bg-[#F5F7FB] p-3">
                <span className="text-slate-500">Status</span>
                <p className="mt-1">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </p>
              </div>
              <div className="rounded-lg bg-[#F5F7FB] p-3">
                <span className="text-slate-500">Date &amp; Time</span>
                <p className="mt-1 font-semibold text-[#101B35]">
                  {selectedBooking.booking_date}
                  <br />
                  {selectedBooking.start_time.slice(0, 5)} - {selectedBooking.end_time.slice(0, 5)}
                </p>
              </div>
              <div className="rounded-lg bg-[#F5F7FB] p-3">
                <span className="text-slate-500">Price &amp; Payment</span>
                <p className="mt-1 font-semibold text-[#101B35]">
                  {formatLKR(selectedBooking.total_amount)}
                  <span className="ml-2 text-[10px] uppercase text-amber-600">
                    ({selectedBooking.payment_status})
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-[#F5F7FB] p-3 text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{selectedBooking.player_phone}</span>
              </div>
              {selectedBooking.player_email && (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-400 font-mono text-[10px]">Email:</span>
                  <span>{selectedBooking.player_email}</span>
                </div>
              )}
              {selectedBooking.notes && (
                <div className="mt-2 text-slate-500">
                  <span className="font-semibold text-slate-600">Notes:</span> {selectedBooking.notes}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Link
                href="/admin/dashboard/bookings"
                className="rounded-lg bg-[#2675F5] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition"
              >
                Go to Bookings Manager
              </Link>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg border border-slate-200 bg-[#F5F7FB] px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
