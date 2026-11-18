'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Settings,
  DollarSign,
  Clock,
  Calendar,
  Shield,
  Ban,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  MapPin,
  Mail,
  Sliders,
  Layers,
} from 'lucide-react';
import {
  getAcademySettings,
  updateServicePricing,
  updateOperatingHours,
  updateSettingConfig,
  addBlockedSlot,
  deleteBlockedSlot,
} from '@/actions/admin-actions';
import { formatCurrencyLKR } from '@/lib/utils';

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price_lkr: number;
  duration_minutes: number;
  max_capacity: number;
  is_active: boolean;
}

interface AvailabilityItem {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  slot_interval_minutes: number;
  is_active: boolean;
}

interface BlockedItem {
  id: string;
  title: string;
  reason?: string;
  block_type: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  all_day: boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedItem[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'pricing' | 'hours' | 'policies' | 'blocked' | 'contact'>('pricing');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // New blocked slot form state
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockType, setNewBlockType] = useState<any>('holiday');
  const [newBlockStartDate, setNewBlockStartDate] = useState('');
  const [newBlockEndDate, setNewBlockEndDate] = useState('');
  const [newBlockAllDay, setNewBlockAllDay] = useState(true);
  const [newBlockReason, setNewBlockReason] = useState('');

  const loadData = () => {
    setLoading(true);
    startTransition(async () => {
      try {
        const res = await getAcademySettings();
        setServices(res.services as any || []);
        setAvailability(res.availability as any || []);
        setBlockedSlots(res.blockedSlots as any || []);
        setSettings(res.settings || {});
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccessNotice = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // 1. Save Pricing Changes
  const handleSavePricing = (service: ServiceItem) => {
    startTransition(async () => {
      const res = await updateServicePricing(service.id, service.price_lkr, service.max_capacity);
      if (res.success) {
        showSuccessNotice(`Updated pricing for ${service.title}`);
      }
    });
  };

  // 2. Save Operating Hours
  const handleSaveHours = (rule: AvailabilityItem) => {
    startTransition(async () => {
      const res = await updateOperatingHours(
        rule.day_of_week,
        rule.open_time.slice(0, 5),
        rule.close_time.slice(0, 5),
        rule.is_active,
        rule.slot_interval_minutes
      );
      if (res.success) {
        showSuccessNotice(`Updated operating schedule for ${DAY_NAMES[rule.day_of_week]}`);
      }
    });
  };

  // 3. Save Policy Config (Pool table, booking duration limits)
  const handleSaveConfig = (key: string, value: any) => {
    startTransition(async () => {
      const res = await updateSettingConfig(key, value);
      if (res.success) {
        showSuccessNotice(`Saved configuration for ${key}`);
      }
    });
  };

  // 4. Add Blocked Period
  const handleAddBlockedPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle || !newBlockStartDate || !newBlockEndDate) return;

    startTransition(async () => {
      const res = await addBlockedSlot({
        title: newBlockTitle,
        reason: newBlockReason,
        blockType: newBlockType,
        startDate: newBlockStartDate,
        endDate: newBlockEndDate,
        allDay: newBlockAllDay,
      });

      if (res.success) {
        setNewBlockTitle('');
        setNewBlockReason('');
        setNewBlockStartDate('');
        setNewBlockEndDate('');
        showSuccessNotice('Blocked period added to schedule');
        loadData();
      }
    });
  };

  const handleDeleteBlockedSlot = (id: string) => {
    startTransition(async () => {
      const res = await deleteBlockedSlot(id);
      if (res.success) {
        setBlockedSlots((prev) => prev.filter((b) => b.id !== id));
        showSuccessNotice('Removed blocked slot');
      }
    });
  };

  // Shared input class
  const inputClass = 'w-full rounded-lg border border-slate-300 bg-white p-2 text-[#101B35] font-mono focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 text-sm';
  const selectClass = 'w-full rounded-lg border border-slate-300 bg-white p-2 text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101B35] flex items-center gap-2.5">
            <Settings className="h-7 w-7 text-[#2675F5]" />
            Academy Configuration &amp; Pricing Rules
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Control hourly rates, opening hours, booking intervals, complimentary pool policies, and holiday blocks.
          </p>
        </div>

        {saveMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-4 w-4" />
            {saveMessage}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'pricing', label: 'Service Pricing & Capacity', icon: DollarSign },
          { key: 'hours', label: 'Operating Timings', icon: Clock },
          { key: 'policies', label: 'Booking & Pool Table Rules', icon: Sliders },
          { key: 'blocked', label: 'Holidays & Blocked Slots', icon: Ban },
          { key: 'contact', label: 'Contact & Location Info', icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#2675F5] text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-[#101B35]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Service Pricing & Capacity */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#101B35] mb-1">Live Service Hourly Rates</h2>
            <p className="text-xs text-slate-500 mb-6">
              Prices are dynamically read from the database by both the booking wizard and public programs pages.
            </p>

            <div className="space-y-4">
              {services.map((svc, idx) => (
                <div
                  key={svc.id}
                  className="rounded-xl border border-slate-200 bg-[#F5F7FB] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-md">
                    <span className="font-bold text-[#101B35] text-base">{svc.title}</span>
                    <p className="text-xs text-slate-500">{svc.description}</p>
                    <span className="inline-block text-[10px] text-slate-400 font-mono">
                      Slug: {svc.slug}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Hourly Rate (LKR)
                      </label>
                      <input
                        type="number"
                        step="50"
                        value={svc.price_lkr}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setServices((prev) =>
                            prev.map((s) => (s.id === svc.id ? { ...s, price_lkr: val } : s))
                          );
                        }}
                        className="w-32 rounded-lg border border-slate-300 bg-white p-2 text-sm text-[#101B35] font-mono focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Max Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={svc.max_capacity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 1;
                          setServices((prev) =>
                            prev.map((s) => (s.id === svc.id ? { ...s, max_capacity: val } : s))
                          );
                        }}
                        className="w-24 rounded-lg border border-slate-300 bg-white p-2 text-sm text-[#101B35] font-mono focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20"
                      />
                    </div>

                    <div className="pt-5">
                      <button
                        onClick={() => handleSavePricing(svc)}
                        disabled={isPending}
                        className="flex items-center gap-1.5 rounded-lg bg-[#2675F5] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition disabled:opacity-50"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Operating Timings */}
      {activeTab === 'hours' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#101B35] mb-1">Weekly Operating Schedule</h2>
            <p className="text-xs text-slate-500">
              Only active days and slots within opening hours can be booked by players.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {availability.map((rule) => (
              <div
                key={rule.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rule.is_active}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAvailability((prev) =>
                        prev.map((r) => (r.id === rule.id ? { ...r, is_active: checked } : r))
                      );
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-[#2675F5]"
                  />
                  <div>
                    <span className="font-bold text-sm text-[#101B35]">
                      {DAY_NAMES[rule.day_of_week]}
                    </span>
                    <span className="ml-2 text-[10px] text-slate-400">
                      {rule.is_active ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Open</label>
                    <input
                      type="time"
                      value={rule.open_time.slice(0, 5)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAvailability((prev) =>
                          prev.map((r) => (r.id === rule.id ? { ...r, open_time: val } : r))
                        );
                      }}
                      className="rounded-lg border border-slate-300 bg-white p-1.5 text-[#101B35] font-mono focus:border-[#2675F5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Close</label>
                    <input
                      type="time"
                      value={rule.close_time.slice(0, 5)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAvailability((prev) =>
                          prev.map((r) => (r.id === rule.id ? { ...r, close_time: val } : r))
                        );
                      }}
                      className="rounded-lg border border-slate-300 bg-white p-1.5 text-[#101B35] font-mono focus:border-[#2675F5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Slot Step</label>
                    <select
                      value={rule.slot_interval_minutes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setAvailability((prev) =>
                          prev.map((r) => (r.id === rule.id ? { ...r, slot_interval_minutes: val } : r))
                        );
                      }}
                      className="rounded-lg border border-slate-300 bg-white p-1.5 text-[#101B35] focus:border-[#2675F5] focus:outline-none"
                    >
                      <option value="30">30 min</option>
                      <option value="60">60 min</option>
                    </select>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => handleSaveHours(rule)}
                      disabled={isPending}
                      className="rounded-lg bg-[#2675F5] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Booking & Pool Table Rules */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Duration Limits */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#101B35]">Booking Constraints</h2>
            <p className="text-xs text-slate-500">
              Control player booking durations and pending request expiration.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Minimum Booking Duration (Minutes)
                </label>
                <input
                  type="number"
                  step="30"
                  value={settings.booking_policy?.min_duration_minutes || 30}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSettings({
                      ...settings,
                      booking_policy: { ...settings.booking_policy, min_duration_minutes: val },
                    });
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Maximum Booking Duration (Minutes)
                </label>
                <input
                  type="number"
                  step="30"
                  value={settings.booking_policy?.max_duration_minutes || 180}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSettings({
                      ...settings,
                      booking_policy: { ...settings.booking_policy, max_duration_minutes: val },
                    });
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Pending Request Hold Window (Minutes)
                </label>
                <input
                  type="number"
                  step="15"
                  value={settings.booking_policy?.pending_expiry_minutes || 60}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSettings({
                      ...settings,
                      booking_policy: { ...settings.booking_policy, pending_expiry_minutes: val },
                    });
                  }}
                  className={inputClass}
                />
              </div>

              <button
                onClick={() => handleSaveConfig('booking_policy', settings.booking_policy)}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2675F5] py-2.5 font-semibold text-white hover:bg-blue-600 transition disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Update Booking Policy
              </button>
            </div>
          </div>

          {/* Complimentary Pool Table Policy */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#101B35]">Pool Table Benefit Policy</h2>
            <p className="text-xs text-slate-500">
              Complimentary pool table access arrangement for players and guardians during their session.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.pool_table_policy?.complimentary ?? true}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setSettings({
                      ...settings,
                      pool_table_policy: { ...settings.pool_table_policy, complimentary: val },
                    });
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-[#2675F5]"
                />
                <span className="font-semibold text-[#101B35]">
                  Enable Complimentary Pool Table Access
                </span>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Maximum Accompanying Guests
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={settings.pool_table_policy?.max_guests || 2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSettings({
                      ...settings,
                      pool_table_policy: { ...settings.pool_table_policy, max_guests: val },
                    });
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Policy Summary Text
                </label>
                <textarea
                  rows={3}
                  value={settings.pool_table_policy?.rules || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSettings({
                      ...settings,
                      pool_table_policy: { ...settings.pool_table_policy, rules: val },
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20"
                />
              </div>

              <button
                onClick={() => handleSaveConfig('pool_table_policy', settings.pool_table_policy)}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2675F5] py-2.5 font-semibold text-white hover:bg-blue-600 transition disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Update Pool Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Holidays & Blocked Slots */}
      {activeTab === 'blocked' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Block Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#101B35] flex items-center gap-2">
              <Ban className="h-5 w-5 text-rose-500" />
              Block Date / Time
            </h2>
            <p className="text-xs text-slate-500">
              Prevent bookings during tournaments, public holidays, or table maintenance.
            </p>

            <form onSubmit={handleAddBlockedPeriod} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Championship Travel"
                  value={newBlockTitle}
                  onChange={(e) => setNewBlockTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-[#101B35] placeholder-slate-400 focus:border-[#2675F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={newBlockType}
                  onChange={(e) => setNewBlockType(e.target.value)}
                  className={selectClass}
                >
                  <option value="holiday">Public / Poya Holiday</option>
                  <option value="tournament">Coach Tournament Day</option>
                  <option value="maintenance">Table Maintenance / Resurfacing</option>
                  <option value="coach_unavailable">Coach Unavailable</option>
                  <option value="private_event">Private Academy Event</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newBlockStartDate}
                    onChange={(e) => setNewBlockStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-[#101B35] focus:border-[#2675F5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newBlockEndDate}
                    onChange={(e) => setNewBlockEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-[#101B35] focus:border-[#2675F5] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Horizon College inter-school match"
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-[#101B35] placeholder-slate-400 focus:border-[#2675F5] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-600 py-2.5 font-semibold text-white hover:bg-rose-500 transition disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Blocked Period
              </button>
            </form>
          </div>

          {/* Blocked Slots List */}
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#101B35]">Active Blocked Periods ({blockedSlots.length})</h2>
            <div className="space-y-2">
              {blockedSlots.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-8 text-center">
                  No blocked dates or holidays configured.
                </div>
              ) : (
                blockedSlots.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-lg border border-slate-200 bg-[#F5F7FB] p-4 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-[#101B35]">
                        <span>{b.title}</span>
                        <span className="rounded bg-rose-50 text-rose-600 px-2 py-0.5 text-[10px] uppercase font-bold border border-rose-200">
                          {b.block_type}
                        </span>
                      </div>
                      <div className="text-slate-500 font-mono">
                        {b.start_date} {b.start_date !== b.end_date && `– ${b.end_date}`}
                      </div>
                      {b.reason && <div className="text-slate-400 text-[11px]">{b.reason}</div>}
                    </div>

                    <button
                      onClick={() => handleDeleteBlockedSlot(b.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete block"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Contact & Location Info */}
      {activeTab === 'contact' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-xl">
          <h2 className="text-lg font-bold text-[#101B35]">Official Academy Details</h2>
          <p className="text-xs text-slate-500">
            Contact information shown across website footers, booking confirmations, and contact forms.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_info?.phone || ''}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    contact_info: { ...settings.contact_info, phone: e.target.value },
                  });
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={settings.contact_info?.email || ''}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    contact_info: { ...settings.contact_info, email: e.target.value },
                  });
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Physical Location</label>
              <input
                type="text"
                value={settings.contact_info?.location || ''}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    contact_info: { ...settings.contact_info, location: e.target.value },
                  });
                }}
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Google Maps URL</label>
              <input
                type="text"
                value={settings.contact_info?.mapsUrl || ''}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    contact_info: { ...settings.contact_info, mapsUrl: e.target.value },
                  });
                }}
                className={inputClass}
              />
            </div>

            <button
              onClick={() => handleSaveConfig('contact_info', settings.contact_info)}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2675F5] py-2.5 font-semibold text-white hover:bg-blue-600 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Update Contact Information
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
