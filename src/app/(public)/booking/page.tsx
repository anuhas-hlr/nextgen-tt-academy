'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserCheck,
  Users,
  CircleDot,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Info,
} from 'lucide-react';
import {
  getAvailableSlots,
  submitBookingRequest,
  type TimeSlotAvailability,
  type DayAvailabilityResult,
} from '@/actions/booking-actions';
import { getCurrentUserProfile } from '@/actions/auth-actions';
import { ACADEMY_CONFIG, BOOKING_TYPES, type BookingType } from '@/lib/constants';

interface BookingFormState {
  bookingType: BookingType;
  bookingDate: string;
  startTime: string; // 'HH:mm'
  durationMinutes: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  participantsCount: number;
  guardianName: string;
  guardianPhone: string;
  notes: string;
}

const PROGRAM_CARDS = [
  {
    type: BOOKING_TYPES.PERSONAL_COACHING,
    title: 'Personal Coaching (1-on-1)',
    badge: '1-on-1 Flagship',
    hourlyRate: 2500,
    coach: 'Chanul Dulsen (National No. 1)',
    icon: UserCheck,
    description: 'Direct high-intensity 1-on-1 technical coaching, stroke biomechanics, and multiball drills.',
  },
  {
    type: BOOKING_TYPES.GROUP_COACHING,
    title: 'Group Coaching Session',
    badge: 'Squad Drills',
    hourlyRate: 2500,
    coach: 'Squad Mentorship',
    icon: Users,
    description: 'Dynamic group training focusing on tactical consistency, multiball patterns, and peer matches.',
  },
  {
    type: BOOKING_TYPES.TABLE_ONLY,
    title: 'Table-Only Rental',
    badge: 'Open Play',
    hourlyRate: 500,
    coach: 'Self Practice',
    icon: CircleDot,
    description: 'Court rental for personal sparring or games with friends. 3-star balls and nets provided.',
  },
];

function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTypeParam = searchParams.get('type');
  
  // Resolve initial program type safely
  const initialType: BookingType =
    initialTypeParam === 'table'
      ? BOOKING_TYPES.TABLE_ONLY
      : initialTypeParam === 'group'
      ? BOOKING_TYPES.GROUP_COACHING
      : BOOKING_TYPES.PERSONAL_COACHING;

  const [step, setStep] = useState<number>(1);
  const [todayStr, setTodayStr] = useState<string>('');

  const [form, setForm] = useState<BookingFormState>({
    bookingType: initialType,
    bookingDate: '',
    startTime: '16:00',
    durationMinutes: 60,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    skillLevel: 'intermediate',
    participantsCount: 2,
    guardianName: '',
    guardianPhone: '',
    notes: '',
  });

  // Slot availability state from live Supabase
  const [isPendingSlots, startSlotTransition] = useTransition();
  const [dayAvailability, setDayAvailability] = useState<DayAvailabilityResult | null>(null);
  const [slotError, setSlotError] = useState<string>('');

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Initialize minimum date (Tomorrow or Today in Asia/Colombo)
  useEffect(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const defaultDate = `${yyyy}-${mm}-${dd}`;
    setForm((prev) => ({ ...prev, bookingDate: defaultDate }));

    const today = new Date();
    const tY = today.getFullYear();
    const tM = String(today.getMonth() + 1).padStart(2, '0');
    const tD = String(today.getDate()).padStart(2, '0');
    setTodayStr(`${tY}-${tM}-${tD}`);

    // Fetch initial slots for default date
    fetchSlotsForDate(defaultDate, 60);

    // Auto-fill logged-in user profile details
    async function checkUser() {
      try {
        const data = await getCurrentUserProfile();
        if (data?.user) {
          setForm((prev) => ({
            ...prev,
            customerName: prev.customerName || data.profile?.fullName || '',
            customerEmail: prev.customerEmail || data.user.email || '',
            customerPhone: prev.customerPhone || data.profile?.phone || '',
          }));
        }
      } catch (e) {
        console.error('Error auto-filling user profile:', e);
      }
    }
    checkUser();
  }, []);

  const fetchSlotsForDate = (date: string, duration: number) => {
    if (!date) return;
    setSlotError('');
    startSlotTransition(async () => {
      try {
        const result = await getAvailableSlots(date, duration);
        setDayAvailability(result);
        if (result.isClosed) {
          setSlotError(result.message || 'Academy is closed on this date.');
        } else {
          // If current selected startTime is not available, default to first available slot
          const firstAvailable = result.slots.find((s) => s.isAvailable);
          if (firstAvailable) {
            setForm((prev) => ({ ...prev, startTime: firstAvailable.time }));
          }
        }
      } catch (err: any) {
        setSlotError('Failed to retrieve court schedule. Please try again.');
      }
    });
  };

  const currentProgram =
    PROGRAM_CARDS.find((p) => p.type === form.bookingType) || PROGRAM_CARDS[0];
  const totalPrice = Math.round((currentProgram.hourlyRate / 60) * form.durationMinutes);

  const validateStep3 = () => {
    const errors: { [key: string]: string } = {};
    if (!form.customerName.trim() || form.customerName.trim().length < 2) {
      errors.customerName = 'Please enter your full name (at least 2 characters)';
    }
    if (!form.customerPhone.trim() || form.customerPhone.trim().length < 8) {
      errors.customerPhone = 'Please enter a valid phone or WhatsApp number';
    }
    if (form.customerEmail && !form.customerEmail.includes('@')) {
      errors.customerEmail = 'Please provide a valid email format';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (dayAvailability?.isClosed) {
        setSlotError('Please choose an operating date before continuing.');
        return;
      }
    }
    if (step === 3) {
      if (!validateStep3()) return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Submit request to live Supabase Backend
  const handleSubmitBooking = async () => {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const result = await submitBookingRequest({
        bookingType: form.bookingType,
        bookingDate: form.bookingDate,
        startTime: form.startTime,
        durationMinutes: form.durationMinutes,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        skillLevel: form.skillLevel,
        participantsCount: form.participantsCount,
        guardianName: form.guardianName || undefined,
        guardianPhone: form.guardianPhone || undefined,
        notes: form.notes || undefined,
      });

      if (result.error) {
        setSubmitError(result.error);
        setIsSubmitting(false);
        return;
      }

      // Success -> Redirect to confirmation page with booking reference
      router.push(
        `/booking/confirmation?ref=${encodeURIComponent(result.bookingReference!)}&type=${encodeURIComponent(result.programTitle!)}&date=${encodeURIComponent(result.bookingDate!)}&time=${encodeURIComponent(result.startTime!)}`
      );
    } catch (err: any) {
      setSubmitError('An unexpected network error occurred while submitting your request.');
      setIsSubmitting(false);
    }
  };

  const selectedSlot = dayAvailability?.slots.find((s) => s.time === form.startTime);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center space-y-2 mb-10">
        <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
          Live Reservations
        </span>
        <h1 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
          Reserve Your Table Tennis Session
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Real-time availability on our single ITTF competition table. Requests enter Pending status for Coach Chanul’s approval. Pay in-person at the academy.
        </p>
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#2675F5] -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />

          {[
            { num: 1, label: 'Program' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Player Details' },
            { num: 4, label: 'Review & Submit' },
          ].map((item) => (
            <div key={item.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all shadow-md ${
                  step === item.num
                    ? 'bg-[#2675F5] text-white ring-4 ring-blue-100 scale-110'
                    : step > item.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-slate-400 border border-slate-300'
                }`}
              >
                {step > item.num ? <CheckCircle2 className="h-5 w-5" /> : item.num}
              </div>
              <span
                className={`mt-2 text-xs font-semibold hidden sm:block ${
                  step === item.num ? 'text-[#101B35]' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Box */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-slate-200">
        {/* ================= STEP 1: SELECT PROGRAM ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#101B35]">Step 1: Choose Your Program</h2>
              <p className="text-xs text-slate-500 mt-1">Select the training track or court reservation you need.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROGRAM_CARDS.map((prog) => {
                const isSelected = form.bookingType === prog.type;
                const Icon = prog.icon;

                return (
                  <div
                    key={prog.type}
                    onClick={() => setForm({ ...form, bookingType: prog.type })}
                    className={`cursor-pointer rounded-2xl p-6 transition-all border-2 flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#2675F5] bg-blue-50/50 shadow-md ring-2 ring-[#2675F5]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 ${
                          isSelected ? 'bg-[#2675F5] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {prog.badge}
                        </span>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-[#2675F5]" />}
                      </div>

                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-[#2675F5] text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-[#101B35] text-base">{prog.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">{prog.description}</p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-200/80">
                      <span className="text-lg font-extrabold text-[#101B35]">
                        LKR {prog.hourlyRate.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium"> / hr</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 1 Actions */}
            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 rounded-xl bg-[#2675F5] px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 transition"
              >
                <span>Continue to Date & Availability</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: DATE & TIME AVAILABILITY ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#101B35]">Step 2: Choose Date & Check Court Schedule</h2>
              <p className="text-xs text-slate-500 mt-1">Live availability queried directly from Supabase for our single competition table.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.bookingDate}
                    min={todayStr || undefined}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setForm({ ...form, bookingDate: newDate });
                      fetchSlotsForDate(newDate, form.durationMinutes);
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                  />
                  <CalendarIcon className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {dayAvailability && !dayAvailability.isClosed && (
                  <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Operating Hours: {dayAvailability.openTime} – {dayAvailability.closeTime}</span>
                  </p>
                )}
              </div>

              {/* Duration Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Session Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '30 Min', mins: 30 },
                    { label: '1 Hour', mins: 60 },
                    { label: '1.5 Hours', mins: 90 },
                    { label: '2 Hours', mins: 120 },
                    { label: '2.5 Hours', mins: 150 },
                    { label: '3 Hours', mins: 180 },
                  ].map((dur) => (
                    <button
                      key={dur.mins}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, durationMinutes: dur.mins });
                        fetchSlotsForDate(form.bookingDate, dur.mins);
                      }}
                      className={`rounded-xl py-2.5 text-xs font-semibold transition border ${
                        form.durationMinutes === dur.mins
                          ? 'border-[#2675F5] bg-[#2675F5] text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs font-semibold text-[#101B35]">
                  Calculated Amount: <span className="text-[#2675F5]">LKR {totalPrice.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Error Message if closed */}
            {slotError && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>{slotError}</span>
              </div>
            )}

            {/* Slots Grid */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Select Starting Slot ({form.durationMinutes} min session)
                </label>
                {isPendingSlots && (
                  <span className="text-xs text-[#2675F5] flex items-center gap-1 font-medium">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Checking table schedule...</span>
                  </span>
                )}
              </div>

              {dayAvailability?.isClosed ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-xs text-slate-500 border border-slate-200">
                  {dayAvailability.message || 'No slots available for this date.'}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-64 overflow-y-auto p-1">
                  {dayAvailability?.slots.map((slot) => {
                    const isSelected = form.startTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setForm({ ...form, startTime: slot.time })}
                        className={`rounded-xl py-2 px-1 text-xs font-semibold transition border text-center relative ${
                          !slot.isAvailable
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'border-[#2675F5] bg-[#2675F5] text-white shadow-md ring-2 ring-[#2675F5]/30'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-[#2675F5] hover:bg-blue-50/50'
                        }`}
                        title={slot.isAvailable ? `${slot.displayTime} to ${slot.displayEndTime}` : `${slot.displayTime} (${slot.reason || 'Unavailable'})`}
                      >
                        {slot.displayTime}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedSlot && (
                <p className="mt-3 text-xs text-slate-600 bg-[#F5F7FB] p-3 rounded-xl border border-slate-200">
                  Selected Session: <strong className="text-[#101B35]">{selectedSlot.displayTime} – {selectedSlot.displayEndTime}</strong> ({form.durationMinutes} minutes) on {form.bookingDate}
                </p>
              )}
            </div>

            {/* Step 2 Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={dayAvailability?.isClosed || !form.startTime}
                className="flex items-center gap-2 rounded-xl bg-[#2675F5] px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 transition disabled:opacity-50"
              >
                <span>Continue to Player Details</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PLAYER DETAILS ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#101B35]">Step 3: Player Information</h2>
              <p className="text-xs text-slate-500 mt-1">Please provide contact and training details for this reservation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Kasun Fernando"
                    value={form.customerName}
                    onChange={(e) => {
                      setForm({ ...form, customerName: e.target.value });
                      if (formErrors.customerName) setFormErrors({ ...formErrors, customerName: '' });
                    }}
                    className={`w-full rounded-xl border bg-white px-4 py-3 pl-10 text-sm text-[#101B35] focus:outline-none focus:ring-2 shadow-sm ${
                      formErrors.customerName
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-slate-300 focus:border-[#2675F5] focus:ring-[#2675F5]/20'
                    }`}
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
                {formErrors.customerName && <p className="text-xs text-red-500 mt-1">{formErrors.customerName}</p>}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+94 7X XXX XXXX"
                    value={form.customerPhone}
                    onChange={(e) => {
                      setForm({ ...form, customerPhone: e.target.value });
                      if (formErrors.customerPhone) setFormErrors({ ...formErrors, customerPhone: '' });
                    }}
                    className={`w-full rounded-xl border bg-white px-4 py-3 pl-10 text-sm text-[#101B35] focus:outline-none focus:ring-2 shadow-sm ${
                      formErrors.customerPhone
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-slate-300 focus:border-[#2675F5] focus:ring-[#2675F5]/20'
                    }`}
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
                {formErrors.customerPhone && <p className="text-xs text-red-500 mt-1">{formErrors.customerPhone}</p>}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="kasun@example.com"
                    value={form.customerEmail}
                    onChange={(e) => {
                      setForm({ ...form, customerEmail: e.target.value });
                      if (formErrors.customerEmail) setFormErrors({ ...formErrors, customerEmail: '' });
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-10 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
                {formErrors.customerEmail && <p className="text-xs text-red-500 mt-1">{formErrors.customerEmail}</p>}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Current Skill Level
                </label>
                <select
                  value={form.skillLevel}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      skillLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                >
                  <option value="beginner">Beginner (Fundamentals & Grip)</option>
                  <option value="intermediate">Intermediate (Rallies & Spin)</option>
                  <option value="advanced">Advanced (Tournament Match Play)</option>
                </select>
              </div>

              {/* Group Participants Selector */}
              {form.bookingType === BOOKING_TYPES.GROUP_COACHING && (
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Number of Group Participants
                  </label>
                  <div className="flex items-center gap-3">
                    {[2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setForm({ ...form, participantsCount: num })}
                        className={`h-11 w-12 rounded-xl text-sm font-bold border transition ${
                          form.participantsCount === num
                            ? 'bg-[#2675F5] text-white border-[#2675F5]'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <span className="text-xs text-slate-500 ml-2">Max 6 players per group</span>
                  </div>
                </div>
              )}

              {/* Guardian Info */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Guardian Details (For Junior Players)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Guardian Full Name (Optional)"
                    value={form.guardianName}
                    onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-[#101B35] focus:border-[#2675F5] focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Guardian Contact Phone (Optional)"
                    value={form.guardianPhone}
                    onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-[#101B35] focus:border-[#2675F5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Special Notes / Training Goals (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Focus on pendulum serve return and backhand footwork..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                />
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 rounded-xl bg-[#2675F5] px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 transition"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW & SUBMIT REQUEST ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#101B35]">Step 4: Review Booking Summary</h2>
              <p className="text-xs text-slate-500 mt-1">Review your session details before submitting your reservation request.</p>
            </div>

            {submitError && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Pending Notice */}
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Pending Coach Review Policy</p>
                <p className="mt-0.5">
                  NextGen TT operates <strong>one ITTF competition table</strong>. Your requested slot will be held in <strong className="font-semibold">PENDING</strong> status until Coach Chanul Dulsen confirms your appointment.
                </p>
              </div>
            </div>

            {/* Summary Card */}
            <div className="rounded-2xl bg-[#F5F7FB] p-6 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2675F5]">
                    {currentProgram.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#101B35]">{currentProgram.title}</h3>
                  <p className="text-xs text-slate-500">Instructor: {currentProgram.coach}</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-xl font-extrabold text-[#101B35]">
                    LKR {totalPrice.toLocaleString()}
                  </span>
                  <p className="text-xs text-slate-500">
                    ({form.durationMinutes} mins @ LKR {currentProgram.hourlyRate.toLocaleString()}/hr)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 pt-1">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Date & Slot</p>
                  <p className="font-bold text-[#101B35] mt-0.5">
                    {form.bookingDate} at {selectedSlot ? selectedSlot.displayTime : form.startTime}
                  </p>
                  <p className="text-xs text-slate-500">
                    Duration: {form.durationMinutes} Minutes (Ends at {selectedSlot ? selectedSlot.displayEndTime : ''})
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Player Details</p>
                  <p className="font-bold text-[#101B35] mt-0.5">{form.customerName}</p>
                  <p className="text-xs text-slate-500">{form.customerPhone} {form.customerEmail ? `• ${form.customerEmail}` : ''}</p>
                  {form.bookingType === BOOKING_TYPES.GROUP_COACHING && (
                    <p className="text-xs text-indigo-600 font-semibold mt-1">
                      Squad Size: {form.participantsCount} players
                    </p>
                  )}
                </div>
              </div>

              {form.notes && (
                <div className="border-t border-slate-200 pt-3 text-xs text-slate-600">
                  <span className="font-bold text-[#101B35]">Special Notes:</span> {form.notes}
                </div>
              )}
            </div>

            {/* Complimentary Pool Table & Pay at Academy Notices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900">
                <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-950">Complimentary Pool Table</p>
                  <p className="mt-0.5">
                    Complimentary access to the pool table is included for player and guardian during this booked session.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-900">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-950">Pay In Person at Academy</p>
                  <p className="mt-0.5">
                    No online payment required. Pay in cash or local transfer when you arrive.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleSubmitBooking}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-[#2675F5] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Booking Request</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading booking portal...</div>}>
      <BookingFlow />
    </Suspense>
  );
}
