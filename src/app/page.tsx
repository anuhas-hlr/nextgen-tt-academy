import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/public';
import { ACADEMY_CONFIG } from '@/lib/constants';
import {
  Trophy,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Users,
  UserCheck,
  Sparkles,
  Award,
  CircleDot,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FB]">
      {/* Top Sticky Header */}
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-[#101B35] py-20 lg:py-28 text-white">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-[#2675F5]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-blue-900/20 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-[#2675F5]/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-sm">
                  <Trophy className="h-4 w-4 text-[#2675F5]" />
                  <span>Sri Lanka's Premier Table Tennis Academy</span>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                  Train Smarter. <br />
                  Play Stronger. <br />
                  <span className="bg-gradient-to-r from-[#2675F5] via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                    Become NextGen.
                  </span>
                </h1>

                <p className="max-w-xl text-base text-slate-300 sm:text-lg leading-relaxed">
                  Master the game under Sri Lanka National No. 1 champion <strong className="text-white font-semibold">Chanul Dulsen</strong>. 
                  Experience world-class technical coaching, high-performance table tennis facilities, and a championship mindset.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/booking"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#2675F5] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                  >
                    <span>Book a Session</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    href="/programs"
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
                  >
                    <span>Explore Programs</span>
                  </Link>
                </div>

                {/* Highlight Stats Badges */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">#1</p>
                    <p className="text-xs text-slate-400 font-medium">Sri Lanka National Rank</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#2675F5]">1-on-1</p>
                    <p className="text-xs text-slate-400 font-medium">Personalized Mentorship</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
                    <p className="text-xs text-slate-400 font-medium">Pay-At-Academy Guarantee</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Action Hero Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Glowing border frame */}
                  <div className="relative overflow-hidden rounded-3xl border-2 border-[#2675F5]/40 shadow-2xl shadow-blue-600/20 bg-slate-900">
                    <Image
                      src="/images/coach-serve-closeup.jpg"
                      alt="Chanul Dulsen - Sri Lanka National Table Tennis Champion Serving"
                      width={600}
                      height={750}
                      priority
                      className="h-[440px] sm:h-[500px] w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101B35] via-transparent to-transparent opacity-90" />
                    
                    {/* Floating Info Tag inside Hero Card */}
                    <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2675F5]">
                            <Award className="h-3.5 w-3.5" />
                            <span>Head Coach & Founder</span>
                          </div>
                          <p className="text-lg font-bold text-white">Chanul Dulsen</p>
                          <p className="text-xs text-slate-300">National Champion • Horizon College Coach</p>
                        </div>
                        <Link
                          href="/coach"
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2675F5] text-white hover:bg-blue-600 transition"
                          title="View Coach Profile"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Floating Highlight Pill */}
                  <div className="absolute -top-4 -left-4 hidden sm:flex items-center gap-2 rounded-2xl bg-[#101B35] border border-[#2675F5]/50 px-4 py-2.5 shadow-xl text-xs font-semibold text-white">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>Free Pool Table with Court Booking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= COACH INTRODUCTION SECTION ================= */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Photo Montage */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                    <Image
                      src="/images/coach-action-doubles.jpg"
                      alt="Chanul Dulsen coaching at the table"
                      width={400}
                      height={450}
                      className="h-60 sm:h-72 w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md mt-6">
                    <Image
                      src="/images/coach-tournament-1.jpg"
                      alt="Chanul Dulsen playing in international tournament"
                      width={400}
                      height={450}
                      className="h-60 sm:h-72 w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-[#F5F7FB] border border-slate-200 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#2675F5]">
                    National Representation
                  </p>
                  <p className="text-sm font-bold text-[#101B35] mt-0.5">
                    Representing Sri Lanka in ITTF International & Asian Championships
                  </p>
                </div>
              </div>

              {/* Right Column: Bio & Credentials */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
                    Meet the Head Coach
                  </div>
                  <h2 className="mt-2 text-3xl font-extrabold text-[#101B35] sm:text-4xl">
                    Chanul Dulsen
                  </h2>
                  <p className="text-lg font-semibold text-[#2675F5]">
                    Sri Lanka National No. 1 | Head Coach at Horizon College
                  </p>
                </div>

                <p className="text-base text-slate-600 leading-relaxed">
                  Chanul Dulsen stands at the pinnacle of Sri Lankan table tennis as the current 
                  <strong> National No. 1 ranked player</strong>. With years of high-stakes international tournament play 
                  and a proven coaching pedigree at prestigious institutions including <strong>Horizon College</strong>, 
                  Chanul brings modern professional methodologies to players of all skill brackets.
                </p>

                <p className="text-base text-slate-600 leading-relaxed">
                  At NextGen TT Academy, Chanul delivers direct, hands-on mentorship focusing on stroke biomechanics, 
                  multiball drill efficiency, reaction speed, mental tenacity, and tournament match play strategy.
                </p>

                {/* Key Achievements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="flex items-start gap-3 rounded-xl bg-[#F5F7FB] p-3.5 border border-slate-200/80">
                    <Trophy className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#101B35]">National Champion</p>
                      <p className="text-xs text-slate-500">Ranked No. 1 across Sri Lanka</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-[#F5F7FB] p-3.5 border border-slate-200/80">
                    <Award className="h-5 w-5 text-[#2675F5] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#101B35]">Horizon College Coach</p>
                      <p className="text-xs text-slate-500">Training top junior school athletes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-[#F5F7FB] p-3.5 border border-slate-200/80">
                    <CircleDot className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#101B35]">International Competitor</p>
                      <p className="text-xs text-slate-500">Asian & International ITTF circuits</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-[#F5F7FB] p-3.5 border border-slate-200/80">
                    <Dumbbell className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#101B35]">Modern Sports Pedagogy</p>
                      <p className="text-xs text-slate-500">Footwork, spin dynamics, psychology</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/coach"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#2675F5] hover:text-blue-700 transition"
                  >
                    <span>Read Full Profile & Coaching Philosophy</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= PROGRAMS SECTION ================= */}
        <section className="py-20 bg-[#F5F7FB] border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
                Tailored Training Tracks
              </span>
              <h2 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
                Academy Programs & Transparent Pricing
              </h2>
              <p className="text-base text-slate-600">
                Choose the program that fits your ambition. Clear, competitive hourly rates with zero hidden fees.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Card 1: Personal Coaching */}
              <div className="relative flex flex-col justify-between rounded-3xl bg-white p-8 shadow-card border-2 border-[#2675F5]/30 hover:border-[#2675F5] transition-all hover:shadow-xl">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#2675F5] px-4 py-1 text-xs font-bold text-white shadow-md">
                  Most Popular
                </div>
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2675F5] mb-5">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#101B35]">Personal Coaching</h3>
                  <p className="text-xs text-slate-500 mt-1">1-on-1 with National Champion Chanul Dulsen</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#101B35]">LKR 2,500</span>
                    <span className="text-sm font-medium text-slate-500">/ hour</span>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    Customized private session tailored to your current level. Immediate stroke correction, service techniques, and strategic match drills.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0" />
                      <span>Direct 1-on-1 session with Chanul</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0" />
                      <span>High-volume multiball training</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0" />
                      <span>Footwork & spin biomechanics</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium text-[#101B35]">
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Free Pool Table access during booking</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/booking?type=personal"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2675F5] py-3 text-sm font-semibold text-white transition hover:bg-blue-600 shadow-md shadow-blue-500/20"
                  >
                    <span>Book Personal Session</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Group Coaching */}
              <div className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-card border border-slate-200 hover:border-slate-300 transition-all hover:shadow-xl">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-5">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#101B35]">Group Coaching</h3>
                  <p className="text-xs text-slate-500 mt-1">Squad drills & competitive match play</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#101B35]">LKR 2,500</span>
                    <span className="text-sm font-medium text-slate-500">/ hour</span>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    Dynamic group training designed to foster peer rivalry, tactical rallies, consistency drills, and competitive tournament sets.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0" />
                      <span>Tactical pattern & consistency drills</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0" />
                      <span>Round-robin tournament simulation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0" />
                      <span>Peer motivation and match experience</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium text-[#101B35]">
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Free Pool Table access during booking</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/booking?type=group"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#101B35] py-3 text-sm font-semibold text-[#101B35] transition hover:bg-[#101B35] hover:text-white"
                  >
                    <span>Book Group Session</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Table-Only Reservation */}
              <div className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-card border border-slate-200 hover:border-slate-300 transition-all hover:shadow-xl">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-5">
                    <CircleDot className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#101B35]">Table-Only Rental</h3>
                  <p className="text-xs text-slate-500 mt-1">Court rental for friendly games & practice</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#101B35]">LKR 500</span>
                    <span className="text-sm font-medium text-slate-500">/ hour</span>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    Rent our professional competition table for personal drills, recreational sets with friends, or sparring practice without coach guidance.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0" />
                      <span>Professional ITTF-standard table</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0" />
                      <span>3-star competition balls provided</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0" />
                      <span>Premium flooring & optimal lighting</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium text-[#101B35]">
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Free Pool Table access during booking</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/booking?type=table"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    <span>Reserve Table Only</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= ACADEMY FACILITIES SECTION ================= */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6 space-y-6">
                <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
                  Facility Highlights
                </span>
                <h2 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
                  Dedicated High-Performance Space & Recreation
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  NextGen TT Academy provides a dedicated, climate-controlled sports atmosphere equipped with tournament-grade equipment and relaxation amenities.
                </p>

                {/* Facility Cards */}
                <div className="space-y-4 pt-2">
                  <div className="flex gap-4 rounded-2xl bg-[#F5F7FB] p-5 border border-slate-200">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2675F5] text-white">
                      <span className="text-xl">🏓</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#101B35]">1 Competition Table Tennis Table</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Official ITTF tournament-grade 25mm top with anti-glare finish, precision netting, and ample court clearance for aggressive looping and defensive chopping.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-2xl bg-blue-50/70 p-5 border border-blue-200/80">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#101B35]">1 Professional Pool Table</h4>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                          Complimentary
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        Enjoy complimentary access to our full-sized pool table during any booked coaching or court rental session. Perfect for unwinding between sets!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Complimentary access policy applies automatically to all booked time slots.</span>
                </div>
              </div>

              {/* Tournament Visual Showcase */}
              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-[#101B35]">
                  <Image
                    src="/images/coach-tournament-2.jpg"
                    alt="Chanul Dulsen tournament action smash"
                    width={700}
                    height={500}
                    className="h-[380px] sm:h-[440px] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101B35]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-xs font-semibold text-[#2675F5] uppercase tracking-wider">
                      Tournament Standard Training
                    </p>
                    <p className="text-lg font-bold">
                      Train on the exact equipment and standards used in international championships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= LOCATION & CONTACT SECTION ================= */}
        <section className="py-20 bg-[#101B35] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
              {/* Left Info */}
              <div className="lg:col-span-6 space-y-6">
                <span className="inline-block rounded-full border border-blue-400/30 bg-[#2675F5]/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
                  Visit NextGen TT Academy
                </span>
                <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight">
                  Ready to Start Your Journey? Find Us in Colombo.
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                  Have questions regarding coach availability, customized schedules, or group bookings? 
                  Reach out via phone, WhatsApp, or reserve your session directly online.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#2675F5]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Academy Address</p>
                      <p className="text-sm font-semibold text-white">NextGen Table Tennis Academy, Colombo, Sri Lanka</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">WhatsApp & Direct Phone</p>
                      <a
                        href={ACADEMY_CONFIG.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-white hover:text-emerald-400 transition"
                      >
                        {ACADEMY_CONFIG.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Operating Hours</p>
                      <p className="text-sm font-semibold text-white">Mon – Sat: 6:00 AM – 10:00 PM | Sun: 7:00 AM – 9:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="https://maps.app.goo.gl/NnL6NtGwU9xm4EmA8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#101B35] hover:bg-slate-100 transition shadow-lg"
                  >
                    <MapPin className="h-4 w-4 text-[#2675F5]" />
                    <span>Open in Google Maps</span>
                  </a>

                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2675F5] px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book Your Time Slot</span>
                  </Link>
                </div>
              </div>

              {/* Right: Google Maps Visual Card */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="aspect-[4/3] w-full rounded-2xl bg-slate-800 overflow-hidden relative flex flex-col items-center justify-center text-center p-6 border border-white/10">
                    <div className="h-16 w-16 rounded-full bg-[#2675F5]/20 flex items-center justify-center text-[#2675F5] mb-4">
                      <MapPin className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">NextGen Table Tennis Academy</h3>
                    <p className="text-sm text-slate-300 mt-2 max-w-sm">
                      Colombo, Sri Lanka. Easily accessible with secure parking and professional facilities.
                    </p>
                    <a
                      href="https://maps.app.goo.gl/NnL6NtGwU9xm4EmA8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2675F5] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition"
                    >
                      <span>Navigate via Google Maps</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
                    <span>Pay at Academy on Arrival</span>
                    <span>Complimentary Pool Table</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
