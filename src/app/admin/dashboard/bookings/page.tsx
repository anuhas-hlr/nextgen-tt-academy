'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CreditCard,
  Banknote,
  Sparkles,
  ArrowRight,
  MoreVertical,
  CalendarDays,
  FileText,
  X,
  Loader2,
} from 'lucide-react';
import {
  getAdminBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
  completeBooking,
  rescheduleBooking,
  togglePaymentStatus,
  type AdminBookingFilters,
} from '@/actions/admin-actions';
import { formatCurrencyLKR, formatDisplayTime } from '@/lib/utils';

function BookingsManager() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStatus = searchParams.get('status') || 'all';
  const initialDate = searchParams.get('date') || '';

  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [dateFilter, setDateFilter] = useState<string>(initialDate);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, startTransition] = useTransition();
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // Modals state
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newStartTime: '16:00',
    newDuration: 60,
  });
  const [actionError, setActionError] = useState('');

  const loadBookings = () => {
    startTransition(async () => {
      const data = await getAdminBookings({
        status: statusFilter,
        date: dateFilter || undefined,
        bookingType: typeFilter,
        search: searchQuery || undefined,
      });
      setBookings(data);
    });
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter, dateFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBookings();
  };

  const handleApprove = async (id: string) => {
    setActionError('');
    const res = await approveBooking(id);
    if (res.error) {
      setActionError(res.error);
    } else {
      loadBookings();
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status: 'confirmed' }));
      }
    }
  };

  const handleReject = async () => {
    if (!selectedBooking) return;
    setActionError('');
    const res = await rejectBooking(selectedBooking.id, rejectReason);
    if (res.error) {
      setActionError(res.error);
    } else {
      setIsRejectOpen(false);
      setRejectReason('');
      loadBookings();
      setSelectedBooking(null);
    }
  };

  const handleCancel = async (id: string) => {
    setActionError('');
    const res = await cancelBooking(id, 'Cancelled via admin portal');
    if (res.error) {
      setActionError(res.error);
    } else {
      loadBookings();
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status: 'cancelled' }));
      }
    }
  };

  const handleComplete = async (id: string) => {
    setActionError('');
    const res = await completeBooking(id);
    if (res.error) {
      setActionError(res.error);
    } else {
      loadBookings();
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status: 'completed' }));
      }
    }
  };

  const handleReschedule = async () => {
    if (!selectedBooking) return;
    setActionError('');
    const res = await rescheduleBooking(
      selectedBooking.id,
      rescheduleData.newDate,
      rescheduleData.newStartTime,
      rescheduleData.newDuration
    );
    if (res.error) {
      setActionError(res.error);
    } else {
      setIsRescheduleOpen(false);
      loadBookings();
      setSelectedBooking(null);
    }
  };

  const handleTogglePayment = async (id: string) => {
    const res = await togglePaymentStatus(id);
    if (res.success) {
      loadBookings();
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev: any) => ({
          ...prev,
          payment_status: res.paymentStatus,
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2675F5]">
            Reservations Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101B35]">
            Booking Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Review, approve, reschedule, or cancel court bookings on the single competition table.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          <RefreshCw className={`h-4 w-4 text-[#2675F5] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-white p-5 shadow-card border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2">
            <input
              type="text"
              placeholder="Search player name, phone, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-10 text-xs text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </form>

          {/* Date Picker Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-[#101B35] focus:border-[#2675F5] focus:outline-none"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="absolute right-8 top-3 text-[10px] text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Program Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-[#101B35] focus:border-[#2675F5] focus:outline-none"
            >
              <option value="all">All Program Types</option>
              <option value="personal-coaching">Personal Coaching (1:1)</option>
              <option value="group-training">Group Coaching Session</option>
              <option value="table-rental">Table-Only Rental</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Status:
          </span>
          {[
            { label: 'All', val: 'all' },
            { label: 'Pending', val: 'pending' },
            { label: 'Confirmed', val: 'confirmed' },
            { label: 'Completed', val: 'completed' },
            { label: 'Cancelled', val: 'cancelled' },
            { label: 'Rejected', val: 'rejected' },
          ].map((pill) => (
            <button
              key={pill.val}
              onClick={() => setStatusFilter(pill.val)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === pill.val
                  ? 'bg-[#101B35] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Ledger Table / Cards */}
      <div className="rounded-3xl bg-white shadow-card border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#2675F5]" />
            <span>Loading reservations...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">
            No bookings found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F5F7FB] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Reference / Date</th>
                  <th className="py-3.5 px-4">Player</th>
                  <th className="py-3.5 px-4">Program & Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {bookings.map((b) => {
                  const isPending = b.status === 'pending';
                  const isConfirmed = b.status === 'confirmed';
                  const isPaid = b.payment_status === 'paid';

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-blue-50/30 transition cursor-pointer"
                      onClick={() => setSelectedBooking(b)}
                    >
                      {/* Ref & Date */}
                      <td className="py-4 px-4 sm:px-6">
                        <span className="font-mono font-bold text-[#101B35] text-xs block">
                          {b.booking_reference}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          {b.booking_date}
                        </span>
                      </td>

                      {/* Player */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#101B35] block">{b.customer_name}</span>
                        <span className="text-[11px] text-slate-500 block">{b.customer_phone}</span>
                      </td>

                      {/* Program & Slot */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800 block capitalize">
                          {b.booking_type.replace('-', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {formatDisplayTime(b.start_time)} – {formatDisplayTime(b.end_time)} ({b.duration_minutes} min)
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : b.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleTogglePayment(b.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                          title="Click to toggle Paid/Unpaid"
                        >
                          <span>{b.payment_status}</span>
                          <span className="text-[9px] font-normal">({formatCurrencyLKR(Number(b.total_amount))})</span>
                        </button>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(b.id)}
                                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBooking(b);
                                  setIsRejectOpen(true);
                                }}
                                className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-100 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isConfirmed && (
                            <button
                              onClick={() => handleComplete(b.id)}
                              className="rounded-lg bg-[#2675F5] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-600 transition"
                            >
                              Complete
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= BOOKING DETAILS DRAWER / MODAL ================= */}
      {selectedBooking && !isRejectOpen && !isRescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2675F5]">
                  Reservation Snapshot
                </span>
                <h3 className="text-xl font-extrabold text-[#101B35]">
                  {selectedBooking.booking_reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              {/* Player Card */}
              <div className="rounded-2xl bg-[#F5F7FB] p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#101B35] text-sm">
                    {selectedBooking.customer_name}
                  </span>
                  <span className="text-slate-500">
                    Skill: <strong className="capitalize">{selectedBooking.skill_level || 'Intermediate'}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#2675F5]" />
                    <a href={`tel:${selectedBooking.customer_phone}`} className="hover:underline">
                      {selectedBooking.customer_phone}
                    </a>
                  </p>
                  {selectedBooking.customer_email && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[#2675F5]" />
                      <span>{selectedBooking.customer_email}</span>
                    </p>
                  )}
                </div>

                {selectedBooking.guardian_name && (
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Guardian: <strong className="text-slate-700">{selectedBooking.guardian_name}</strong> ({selectedBooking.guardian_phone || 'No phone'})
                  </p>
                )}
              </div>

              {/* Schedule & Price Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-3 bg-white">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Scheduled Time</span>
                  <span className="font-bold text-[#101B35] text-sm mt-0.5 block">
                    {selectedBooking.booking_date}
                  </span>
                  <span className="text-slate-600 text-[11px] block">
                    {formatDisplayTime(selectedBooking.start_time)} – {formatDisplayTime(selectedBooking.end_time)}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 p-3 bg-white">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Price Snapshot</span>
                  <span className="font-extrabold text-[#101B35] text-sm mt-0.5 block">
                    {formatCurrencyLKR(Number(selectedBooking.total_amount))}
                  </span>
                  <span className="text-slate-500 text-[10px] block">
                    Snapshot rate: LKR {selectedBooking.price_snapshot}/hr
                  </span>
                </div>
              </div>

              {/* Status & Payment toggles */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Status</span>
                  <span className={`font-bold capitalize text-xs ${selectedBooking.payment_status === 'paid' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {selectedBooking.payment_status}
                  </span>
                </div>
                <button
                  onClick={() => handleTogglePayment(selectedBooking.id)}
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Mark as {selectedBooking.payment_status === 'paid' ? 'Unpaid' : 'Paid'}
                </button>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-slate-600">
                  <span className="font-bold text-[#101B35] block mb-0.5">Player Notes:</span>
                  {selectedBooking.notes}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5 justify-end">
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={() => handleApprove(selectedBooking.id)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                  >
                    Confirm Booking
                  </button>
                )}

                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => handleComplete(selectedBooking.id)}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
                  >
                    Mark Completed
                  </button>
                )}

                <button
                  onClick={() => {
                    setRescheduleData({
                      newDate: selectedBooking.booking_date,
                      newStartTime: selectedBooking.start_time.slice(0, 5),
                      newDuration: selectedBooking.duration_minutes,
                    });
                    setIsRescheduleOpen(true);
                  }}
                  className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Reschedule
                </button>

                {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'rejected' && (
                  <button
                    onClick={() => handleCancel(selectedBooking.id)}
                    className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    Cancel Slot
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#101B35]">Decline Booking Request</h3>
            <p className="mt-1 text-xs text-slate-500">
              Provide an optional reason to record for this rejection.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Table reserved for school tournament trials..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-4 w-full rounded-xl border border-slate-300 p-3 text-xs text-[#101B35] focus:border-red-500 focus:outline-none"
            />
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setIsRejectOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Back
              </button>
              <button
                onClick={handleReject}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#101B35]">Reschedule Session</h3>
            <p className="mt-1 text-xs text-slate-500">
              Select new date and starting time. Conflicts with other bookings will be validated.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Date</label>
                <input
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#101B35]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">New Start Time (HH:mm)</label>
                <input
                  type="time"
                  value={rescheduleData.newStartTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newStartTime: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#101B35]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Duration (Minutes)</label>
                <select
                  value={rescheduleData.newDuration}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newDuration: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#101B35]"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes (1 Hour)</option>
                  <option value={90}>90 Minutes (1.5 Hours)</option>
                  <option value={120}>120 Minutes (2 Hours)</option>
                  <option value={180}>180 Minutes (3 Hours)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                onClick={() => setIsRescheduleOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Back
              </button>
              <button
                onClick={handleReschedule}
                className="rounded-xl bg-[#2675F5] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading bookings management...</div>}>
      <BookingsManager />
    </Suspense>
  );
}
