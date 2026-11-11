'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface BookingState {
  type: 'personal' | 'group' | 'table';
  date: string;
  timeSlot: string;
  durationHours: number;
  fullName: string;
  email: string;
  phone: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  notes: string;
}

const PROGRAM_DETAILS = {
  personal: {
    title: 'Personal Coaching (1-on-1)',
    ratePerHour: 2500,
    coach: 'Chanul Dulsen (National No. 1)',
    badge: '1-on-1 Private',
    icon: UserCheck,
    description: 'Direct high-intensity coaching with stroke corrections and multiball drills.',
  },
  group: {
    title: 'Group Coaching Session',
    ratePerHour: 2500,
    coach: 'Squad Mentorship',
    badge: 'Squad Drills',
    icon: Users,
    description: 'Dynamic group training focusing on tactical consistency and peer matches.',
  },
  table: {
    title: 'Table-Only Reservation',
    ratePerHour: 500,
    coach: 'Self Practice',
    badge: 'Open Play',
    icon: CircleDot,
    description: 'Court rental for personal sparring or games with a friend. 3-star balls provided.',
  },
};

const TIME_SLOTS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
  '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM',
];

function BookingFlow() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as 'personal' | 'group' | 'table') || 'personal';

  const [step, setStep] = useState<number>(1);
  const [todayStr, setTodayStr] = useState<string>('');
  const [booking, setBooking] = useState<BookingState>({
    type: initialType in PROGRAM_DETAILS ? initialType : 'personal',
    date: '',
    timeSlot: '04:00 PM',
    durationHours: 1,
    fullName: '',
    email: '',
    phone: '',
    skillLevel: 'intermediate',
    notes: '',
  });

  useEffect(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setBooking((prev) => ({ ...prev, date: `${yyyy}-${mm}-${dd}` }));

    const today = new Date();
    const tY = today.getFullYear();
    const tM = String(today.getMonth() + 1).padStart(2, '0');
    const tD = String(today.getDate()).padStart(2, '0');
    setTodayStr(`${tY}-${tM}-${tD}`);
  }, []);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  const currentProgram = PROGRAM_DETAILS[booking.type];
  const totalPrice = currentProgram.ratePerHour * booking.durationHours;

  const validateStep3 = () => {
    const errors: { [key: string]: string } = {};
    if (!booking.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!booking.email.trim() || !booking.email.includes('@')) errors.email = 'Valid Email is required';
    if (!booking.phone.trim() || booking.phone.length < 8) errors.phone = 'Valid Phone / WhatsApp number is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
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

  const handleConfirmBooking = () => {
    const randomRef = 'NGTT-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(randomRef);
    setIsSubmitted(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // SUCCESS SCREEN
  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center">
        <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl border border-slate-200">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-fade-in">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Reservation Registered
          </span>
          <h2 className="text-3xl font-extrabold text-[#101B35]">Booking Confirmed!</h2>
          <p className="mt-2 text-sm text-slate-500">
            Reference Code: <strong className="text-[#2675F5] font-mono text-base">{bookingRef}</strong>
          </p>

          {/* Booking Summary Box */}
          <div className="mt-8 rounded-2xl bg-[#F5F7FB] p-6 text-left border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-200/80 pb-3">
              <span className="text-slate-500">Session Type</span>
              <span className="font-bold text-[#101B35]">{currentProgram.title}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-200/80 pb-3">
              <span className="text-slate-500">Scheduled Date</span>
              <span className="font-bold text-[#101B35]">{booking.date}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-200/80 pb-3">
              <span className="text-slate-500">Time & Duration</span>
              <span className="font-bold text-[#101B35]">
                {booking.timeSlot} ({booking.durationHours} hr{booking.durationHours > 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-200/80 pb-3">
              <span className="text-slate-500">Player</span>
              <span className="font-bold text-[#101B35]">{booking.fullName}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-slate-500">Amount Due at Academy</span>
              <span className="text-lg font-extrabold text-[#2675F5]">LKR {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Pay at academy reminder */}
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-left text-xs text-blue-900 border border-blue-200">
            <ShieldCheck className="h-5 w-5 text-[#2675F5] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pay at Academy Policy</p>
              <p className="mt-0.5 text-blue-800">
                Please arrive 10 minutes prior to your slot. Payment is accepted in cash or local bank transfer upon arrival. Complimentary pool table access is ready for you!
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="rounded-xl bg-[#101B35] px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Return to Homepage
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
              }}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Book Another Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center space-y-2 mb-10">
        <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
          Online Reservations
        </span>
        <h1 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
          Book Your Table Tennis Session
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Easy 4-step reservation. Pay in person when you arrive at NextGen TT Academy.
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
            { num: 1, label: 'Session Type' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Your Details' },
            { num: 4, label: 'Review & Confirm' },
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
                {step > item.num ? '✓' : item.num}
              </div>
              <span className={`mt-2 text-xs font-semibold hidden sm:block ${
                step === item.num ? 'text-[#2675F5]' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Step Container */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-slate-200">
        {/* ================= STEP 1: SELECT SESSION TYPE ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#101B35]">Step 1: Select Session Type</h2>
              <p className="text-xs text-slate-500 mt-1">Choose between private coaching, group drills, or table rental.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(Object.keys(PROGRAM_DETAILS) as Array<'personal' | 'group' | 'table'>).map((key) => {
                const prog = PROGRAM_DETAILS[key];
                const Icon = prog.icon;
                const isSelected = booking.type === key;

                return (
                  <div
                    key={key}
                    onClick={() => setBooking({ ...booking, type: key })}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#2675F5] bg-blue-50/40 shadow-md ring-2 ring-[#2675F5]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-[#2675F5]">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                        isSelected ? 'bg-[#2675F5] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-[#101B35] text-base">{prog.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">{prog.description}</p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-200/80">
                      <span className="text-lg font-extrabold text-[#101B35]">
                        LKR {prog.ratePerHour.toLocaleString()}
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
                <span>Continue to Date & Time</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: DATE & TIME SLOT ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#101B35]">Step 2: Choose Date & Preferred Slot</h2>
              <p className="text-xs text-slate-500 mt-1">Select your preferred date, hour, and booking duration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={booking.date}
                    min={todayStr || undefined}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                  />
                  <CalendarIcon className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Open 7 days a week (Mon–Sat 6AM–10PM, Sun 7AM–9PM)
                </p>
              </div>

              {/* Duration Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Session Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((hr) => (
                    <button
                      key={hr}
                      type="button"
                      onClick={() => setBooking({ ...booking, durationHours: hr })}
                      className={`rounded-xl py-3 text-sm font-semibold transition border ${
                        booking.durationHours === hr
                          ? 'border-[#2675F5] bg-[#2675F5] text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {hr} Hour{hr > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Calculated rate: LKR {(currentProgram.ratePerHour * booking.durationHours).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                Select Starting Time Slot
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = booking.timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBooking({ ...booking, timeSlot: slot })}
                      className={`rounded-xl py-2.5 px-2 text-xs font-semibold transition border text-center ${
                        isSelected
                          ? 'border-[#2675F5] bg-[#2675F5] text-white shadow-md'
                          : 'border-slate-200 bg-[#F5F7FB] text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
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
                className="flex items-center gap-2 rounded-xl bg-[#2675F5] px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 transition"
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
              <p className="text-xs text-slate-500 mt-1">Please provide your contact information to reserve the slot.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Ruwan Perera"
                    value={booking.fullName}
                    onChange={(e) => {
                      setBooking({ ...booking, fullName: e.target.value });
                      if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                    }}
                    className={`w-full rounded-xl border bg-white px-4 py-3 pl-10 text-sm text-[#101B35] focus:outline-none focus:ring-2 shadow-sm ${
                      formErrors.fullName
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-slate-300 focus:border-[#2675F5] focus:ring-[#2675F5]/20'
                    }`}
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
                {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ruwan@example.com"
                    value={booking.email}
                    onChange={(e) => {
                      setBooking({ ...booking, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    className={`w-full rounded-xl border bg-white px-4 py-3 pl-10 text-sm text-[#101B35] focus:outline-none focus:ring-2 shadow-sm ${
                      formErrors.email
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-slate-300 focus:border-[#2675F5] focus:ring-[#2675F5]/20'
                    }`}
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+94 75 639 9105"
                    value={booking.phone}
                    onChange={(e) => {
                      setBooking({ ...booking, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                    }}
                    className={`w-full rounded-xl border bg-white px-4 py-3 pl-10 text-sm text-[#101B35] focus:outline-none focus:ring-2 shadow-sm ${
                      formErrors.phone
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-slate-300 focus:border-[#2675F5] focus:ring-[#2675F5]/20'
                    }`}
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Current Skill Level
                </label>
                <select
                  value={booking.skillLevel}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      skillLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                >
                  <option value="beginner">Beginner (Learning Basics & Grip)</option>
                  <option value="intermediate">Intermediate (Consistent rallies & footwork)</option>
                  <option value="advanced">Advanced / Tournament Competitor</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Special Notes / Specific Focus (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Want to work on backhand flick and reverse pendulum service..."
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
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

        {/* ================= STEP 4: SUMMARY & CONFIRMATION ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#101B35]">Step 4: Review Booking Summary</h2>
              <p className="text-xs text-slate-500 mt-1">Review your session details before confirming your reservation.</p>
            </div>

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
                    ({booking.durationHours} hr × LKR {currentProgram.ratePerHour.toLocaleString()})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 pt-1">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Date & Start Time</p>
                  <p className="font-bold text-[#101B35] mt-0.5">
                    {booking.date} at {booking.timeSlot}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Player Details</p>
                  <p className="font-bold text-[#101B35] mt-0.5">{booking.fullName}</p>
                  <p className="text-xs text-slate-500">{booking.phone} • {booking.email}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="border-t border-slate-200 pt-3 text-xs text-slate-600">
                  <span className="font-bold text-[#101B35]">Notes:</span> {booking.notes}
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
                    Full access to our pool table included during your booked session.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-900">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-950">Pay In Person at Academy</p>
                  <p className="mt-0.5">
                    No card required online. Cash or local transfer accepted upon arrival.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleConfirmBooking}
                className="flex items-center gap-2 rounded-xl bg-[#2675F5] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition"
              >
                <span>Confirm Reservation</span>
                <CheckCircle2 className="h-4 w-4" />
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
