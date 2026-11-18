'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { getAdminPayments, recordPayment } from '@/actions/admin-actions';
import { formatCurrencyLKR, formatAcademyDate } from '@/lib/utils';

interface PaymentRecord {
  id: string;
  booking_id: string;
  booking_reference: string;
  player_id?: string;
  amount: number;
  currency: string;
  payment_method: 'cash' | 'bank_transfer' | 'card' | 'online';
  reference_number?: string;
  status: 'unpaid' | 'paid' | 'refunded';
  payment_date?: string;
  notes?: string;
  created_at: string;
  player?: {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form state for recording offline payment
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [methodInput, setMethodInput] = useState<'cash' | 'bank_transfer'>('cash');
  const [refNumberInput, setRefNumberInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchPayments = (status?: string) => {
    setLoading(true);
    startTransition(async () => {
      try {
        const res = await getAdminPayments(status);
        setPayments((res.payments as any) || []);
        setTotalCollected(res.totalCollected || 0);
      } catch (err) {
        console.error('Failed to load payments:', err);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchPayments(statusFilter);
  }, [statusFilter]);

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!bookingIdInput.trim() || !amountInput) {
      setFormError('Please enter booking ID and payment amount');
      return;
    }

    startTransition(async () => {
      const res = await recordPayment({
        bookingId: bookingIdInput.trim(),
        amount: parseFloat(amountInput),
        paymentMethod: methodInput,
        referenceNumber: refNumberInput,
        notes: notesInput,
      });

      if (res.error) {
        setFormError(res.error);
      } else {
        setShowRecordModal(false);
        setBookingIdInput('');
        setAmountInput('');
        setRefNumberInput('');
        setNotesInput('');
        fetchPayments(statusFilter);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CreditCard className="h-7 w-7 text-emerald-500" />
            Payment Management & In-Person Receipts
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track collected cash, physical receipts, and verified bank transfers. Unpaid bookings are strictly omitted from collected totals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/30"
          >
            <PlusCircle className="h-4 w-4" />
            Record Payment
          </button>
          <button
            onClick={() => fetchPayments(statusFilter)}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Collected Revenue</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white">
            {formatCurrencyLKR(totalCollected)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Actual collected funds from verified payments.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Paid Transactions</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white">
            {payments.filter((p) => p.status === 'paid').length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Physical cash receipts & bank slips.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Payment Channels</span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs font-bold text-slate-300">
            <span className="rounded bg-slate-800 px-2 py-1">
              Cash: {payments.filter((p) => p.payment_method === 'cash').length}
            </span>
            <span className="rounded bg-slate-800 px-2 py-1">
              Transfer: {payments.filter((p) => p.payment_method === 'bank_transfer').length}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            In-person academy desk collections.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Status:</span>
          <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-1">
            {['all', 'paid', 'unpaid', 'refunded'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {payments.length} transactions
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/60 font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Reference & Date</th>
              <th className="px-5 py-3.5">Athlete / Player</th>
              <th className="px-5 py-3.5">Method</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No payment records match this filter.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-5 py-4">
                    <div className="font-mono font-bold text-blue-400">
                      {p.booking_reference}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {formatAcademyDate(p.payment_date || p.created_at, 'MMM dd, yyyy h:mm a')}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">
                      {p.player?.full_name || 'Walk-in Player'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {p.player?.phone || 'No phone'}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase font-bold text-slate-300">
                      {p.payment_method.replace('_', ' ')}
                    </span>
                    {p.reference_number && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Ref: {p.reference_number}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold text-white text-sm">
                    {formatCurrencyLKR(p.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] uppercase font-bold ${
                        p.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 max-w-xs truncate">
                    {p.notes || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Record In-Person Payment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-400" />
                Record Offline Payment
              </h3>
              <button
                onClick={() => setShowRecordModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="rounded-lg bg-rose-500/10 p-3 text-xs text-rose-400 border border-rose-500/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleRecordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Booking UUID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7f9a8b1c-..."
                  value={bookingIdInput}
                  onChange={(e) => setBookingIdInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Amount (LKR)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="e.g. 2500"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={methodInput}
                  onChange={(e) => setMethodInput(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="cash">In-Person Cash Desk</option>
                  <option value="bank_transfer">Direct Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bank Reference / Receipt No. (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-892341"
                  value={refNumberInput}
                  onChange={(e) => setRefNumberInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid at reception by player"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500 transition disabled:opacity-50"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
