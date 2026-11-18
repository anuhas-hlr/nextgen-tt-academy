'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  Clock,
  Shield,
  FileText,
  Save,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { getAdminPlayers, updatePlayerNotes } from '@/actions/admin-actions';
import { formatCurrencyLKR, formatDisplayTime } from '@/lib/utils';

interface PlayerBooking {
  id: string;
  booking_reference: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  service_type_name: string;
  total_amount: number;
  status: string;
  payment_status: string;
}

interface Player {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  guardian_name?: string;
  guardian_phone?: string;
  total_sessions: number;
  internal_notes?: string;
  created_at: string;
  bookings: PlayerBooking[];
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [notesSuccess, setNotesSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchPlayers = (query?: string) => {
    setLoading(true);
    startTransition(async () => {
      try {
        const res = await getAdminPlayers(query);
        setPlayers((res.players as any) || []);
      } catch (err) {
        console.error('Failed to load players:', err);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlayers(searchQuery);
  };

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setNotesInput(player.internal_notes || '');
    setNotesSuccess(false);
  };

  const handleSaveNotes = () => {
    if (!selectedPlayer) return;
    startTransition(async () => {
      const res = await updatePlayerNotes(selectedPlayer.id, notesInput);
      if (res.success) {
        setNotesSuccess(true);
        setSelectedPlayer({ ...selectedPlayer, internal_notes: notesInput });
        setPlayers((prev) =>
          prev.map((p) => (p.id === selectedPlayer.id ? { ...p, internal_notes: notesInput } : p))
        );
        setTimeout(() => setNotesSuccess(false), 3000);
      }
    });
  };

  const getSkillBadge = (level: string) => {
    switch (level) {
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'intermediate':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101B35] flex items-center gap-2.5">
            <Users className="h-7 w-7 text-[#2675F5]" />
            Player Directory &amp; Athlete Profiles
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Registered players, booking frequency, skill levels, guardian contacts, and internal coach notes.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-4 text-sm text-[#101B35] placeholder-slate-400 focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#2675F5] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition shadow-sm"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              fetchPlayers('');
            }}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 hover:text-[#101B35] hover:bg-slate-50 transition shadow-sm"
            title="Reset"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </form>
      </div>

      {/* Main Layout: Player List & Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Players List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-[#F5F7FB]">
              <span className="text-sm font-semibold text-[#101B35]">
                Total Athletes: {players.length}
              </span>
              <span className="text-xs text-slate-500">
                Click any athlete to view full session history &amp; notes
              </span>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-[#2675F5]" />
              </div>
            ) : players.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No players found matching your criteria.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {players.map((player) => {
                  const isSelected = selectedPlayer?.id === player.id;
                  const totalPaidSessions = (player.bookings || []).filter(
                    (b) => b.status === 'completed' || b.status === 'confirmed'
                  ).length;

                  return (
                    <div
                      key={player.id}
                      onClick={() => handleSelectPlayer(player)}
                      className={`p-5 flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-50 border-l-4 border-l-[#2675F5]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-[#101B35] text-base">
                            {player.full_name}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getSkillBadge(
                              player.skill_level
                            )}`}
                          >
                            {player.skill_level}
                          </span>
                          {player.guardian_name && (
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                              Guardian: {player.guardian_name}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {player.phone}
                          </span>
                          {player.email && (
                            <span className="flex items-center gap-1 font-mono">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />
                              {player.email}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#101B35]">
                            {player.bookings?.length || 0} Bookings
                          </div>
                          <div className="text-xs text-emerald-600">
                            {totalPaidSessions} Active/Done
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Player Profile, Notes & History */}
        <div className="space-y-4">
          {selectedPlayer ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] uppercase font-bold text-[#2675F5] tracking-wider">
                  Athlete Profile
                </span>
                <h2 className="text-xl font-bold text-[#101B35] mt-1">{selectedPlayer.full_name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getSkillBadge(
                      selectedPlayer.skill_level
                    )}`}
                  >
                    {selectedPlayer.skill_level}
                  </span>
                  <span className="text-xs text-slate-500">
                    Joined: {new Date(selectedPlayer.created_at).toLocaleDateString('en-US')}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 rounded-lg bg-[#F5F7FB] p-4 text-xs border border-slate-200">
                <div className="font-semibold text-[#101B35]">Contact &amp; Guardian Info</div>
                <div className="space-y-1.5 text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Direct Phone:</span>
                    <span className="font-mono text-[#101B35] font-semibold">{selectedPlayer.phone}</span>
                  </div>
                  {selectedPlayer.email && (
                    <div className="flex items-center justify-between">
                      <span>Email:</span>
                      <span className="font-mono text-[#101B35]">{selectedPlayer.email}</span>
                    </div>
                  )}
                  {selectedPlayer.guardian_name && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span>Guardian:</span>
                      <span className="text-[#101B35] font-medium">{selectedPlayer.guardian_name}</span>
                    </div>
                  )}
                  {selectedPlayer.guardian_phone && (
                    <div className="flex items-center justify-between">
                      <span>Guardian Phone:</span>
                      <span className="font-mono text-[#101B35]">{selectedPlayer.guardian_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Internal Coach Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#101B35] flex items-center justify-between">
                  <span>Chanul&apos;s Internal Notes</span>
                  {notesSuccess && (
                    <span className="text-emerald-600 text-[10px] flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Saved!
                    </span>
                  )}
                </label>
                <textarea
                  rows={4}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record strengths, forehand/backhand development, tournament goals, racket specs..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-[#101B35] placeholder-slate-400 focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2675F5] py-2 text-xs font-semibold text-white hover:bg-blue-600 transition disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Notes
                </button>
              </div>

              {/* Recent Sessions History */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="font-semibold text-xs text-[#101B35] flex items-center justify-between">
                  <span>Session History ({selectedPlayer.bookings?.length || 0})</span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {(selectedPlayer.bookings || []).length === 0 ? (
                    <div className="text-xs text-slate-400 italic">No bookings recorded yet.</div>
                  ) : (
                    selectedPlayer.bookings.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-lg border border-slate-200 bg-[#F5F7FB] p-2.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-[#101B35]">
                          <span>{b.booking_date}</span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] uppercase font-bold ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : b.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span>{b.service_type_name}</span>
                          <span className="font-mono">{formatDisplayTime(b.start_time)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                          <span className="text-slate-400 font-mono text-[10px]">{b.booking_reference}</span>
                          <span className="font-semibold text-[#101B35]">{formatCurrencyLKR(b.total_amount)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400 text-xs shadow-sm">
              Select an athlete from the list to view profile, notes, and training session history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
