import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Medal,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Brain,
  Flame,
  ShieldAlert,
} from 'lucide-react';

export const metadata = {
  title: 'Coach Chanul Dulsen | Sri Lanka National No. 1 | NextGen TT',
  description:
    'Meet Chanul Dulsen, Sri Lanka National No. 1 table tennis player and Head Coach at Horizon College. Discover his career achievements, coaching philosophy, and training methods.',
};

export default function CoachPage() {
  return (
    <div>
      {/* Hero Header with Profile Accent */}
      <section className="relative overflow-hidden bg-[#101B35] py-16 sm:py-24 text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-96 w-96 rounded-full bg-[#2675F5]/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-[#2675F5]/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
                <Trophy className="h-4 w-4 text-[#2675F5]" />
                <span>Head Coach & Founder</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
                Chanul Dulsen
              </h1>

              <p className="text-xl font-bold text-[#2675F5]">
                Sri Lanka National No. 1 Table Tennis Player • Horizon College Coach
              </p>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Widely regarded as one of Sri Lanka’s most technically sound and dynamically aggressive players, Chanul combines elite championship court instincts with structured modern coaching techniques to nurture the next generation of champions.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/booking?type=personal"
                  className="flex items-center gap-2 rounded-xl bg-[#2675F5] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition"
                >
                  <span>Book 1-on-1 with Chanul</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/programs"
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  <span>View Coaching Programs</span>
                </Link>
              </div>
            </div>

            {/* Right Photo Frame */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                <div className="overflow-hidden rounded-3xl border-2 border-[#2675F5]/40 shadow-2xl bg-slate-900">
                  <Image
                    src="/images/coach-serve-closeup.jpg"
                    alt="Chanul Dulsen serving in competition"
                    width={500}
                    height={600}
                    priority
                    className="h-[460px] w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101B35] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/60 p-3.5 backdrop-blur-md border border-white/10 text-center">
                    <p className="text-xs font-semibold text-[#2675F5]">Official National Ranking</p>
                    <p className="text-lg font-bold text-white">Ranked #1 in Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Milestones & Accolades */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
              Proven Track Record
            </span>
            <h2 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
              Championship Honors & Coaching Appointments
            </h2>
            <p className="text-slate-600">
              A distinguished competitive career combined with active high-school and junior squad leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Milestone 1 */}
            <div className="rounded-3xl bg-[#F5F7FB] p-8 border border-slate-200 hover:border-[#2675F5] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-6">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#101B35]">Sri Lanka National No. 1</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Currently holding the prestigious No. 1 ranking in the Sri Lanka Table Tennis Association official standings, having triumphed across national tournaments and ranking trials.
              </p>
            </div>

            {/* Milestone 2 */}
            <div className="rounded-3xl bg-[#F5F7FB] p-8 border border-slate-200 hover:border-[#2675F5] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-[#2675F5] mb-6">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#101B35]">Head Coach, Horizon College</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Leads table tennis development at Horizon College, Colombo, shaping junior talent, school tournament teams, and individual championship medalists.
              </p>
            </div>

            {/* Milestone 3 */}
            <div className="rounded-3xl bg-[#F5F7FB] p-8 border border-slate-200 hover:border-[#2675F5] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
                <Medal className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#101B35]">International ITTF Competitor</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Has donned the national colors representing Sri Lanka at Asian and international ITTF circuits, competing against world-ranked players across Asia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Showcase of Chanul */}
      <section className="py-20 bg-[#F5F7FB] border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
              In Action
            </span>
            <h2 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
              On the International & Coaching Stages
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group overflow-hidden rounded-3xl bg-white shadow-card border border-slate-200">
              <div className="overflow-hidden h-72">
                <Image
                  src="/images/coach-action-doubles.jpg"
                  alt="Chanul mentoring student"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-[#101B35]">Hands-On Mentorship</h4>
                <p className="text-xs text-slate-500 mt-1">Individual court drills and table technique guidance.</p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-3xl bg-white shadow-card border border-slate-200">
              <div className="overflow-hidden h-72">
                <Image
                  src="/images/coach-tournament-1.jpg"
                  alt="Chanul tournament rally"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-[#101B35]">Tactical Forehand Loops</h4>
                <p className="text-xs text-slate-500 mt-1">High-spin topspin drives executed in championship pressure.</p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-3xl bg-white shadow-card border border-slate-200">
              <div className="overflow-hidden h-72">
                <Image
                  src="/images/coach-tournament-2.jpg"
                  alt="Chanul smash finish"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-[#101B35]">Aggressive Finishing Power</h4>
                <p className="text-xs text-slate-500 mt-1">Point-ending overhead smashes and explosive footwork recovery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Philosophy: 4 Pillars */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
                Philosophy
              </span>
              <h2 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
                How Coach Chanul Develops Elite Table Tennis Competitors
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Coach Chanul's system is rooted in modern sports science: isolating each movement into biomechanical cues, repetitive muscle-memory drills, and situational match simulation.
              </p>
              <div className="pt-2">
                <Link
                  href="/booking?type=personal"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#101B35] px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition"
                >
                  <span>Experience a Session (LKR 2,500/hr)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-[#F5F7FB] p-6 border border-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#2675F5] mb-4">
                  <Target className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-[#101B35]">1. Biomechanical Accuracy</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Correcting paddle angle, shoulder rotation, and weight transfer so players generate explosive power effortlessly.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F5F7FB] p-6 border border-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-[#101B35]">2. High-Frequency Multiball</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Intensive feeding drills that build split-second reflex responses, deep court recovery, and anaerobic stamina.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F5F7FB] p-6 border border-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
                  <Brain className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-[#101B35]">3. Match IQ & Rally Tactics</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Learning to read opponent body hints, exploit subtle weaknesses, and switch spin vectors mid-rally.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F5F7FB] p-6 border border-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                  <Flame className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-[#101B35]">4. Championship Resilience</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Mental preparation rituals to maintain composure at 9-9 in the deciding fifth set.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
