import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  Target,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users2,
  HeartHandshake,
} from 'lucide-react';

export const metadata = {
  title: 'About Us | NextGen Table Tennis Academy',
  description:
    'Learn about NextGen Table Tennis Academy in Colombo, Sri Lanka. Founded by National Champion Chanul Dulsen to build champions with world-class coaching.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#101B35] py-16 sm:py-24 text-white">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-80 w-80 rounded-full bg-[#2675F5]/20 blur-3xl pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-[#2675F5]/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-4">
            <span>About NextGen TT Academy</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Shaping the Future of <br className="hidden sm:inline" />
            <span className="text-[#2675F5]">Sri Lankan Table Tennis</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Founded by Sri Lanka National No. 1 Chanul Dulsen, NextGen TT Academy was established to provide aspiring athletes and enthusiasts with high-performance coaching, modern sports science, and championship mindset training.
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
                Our Background & Story
              </span>
              <h2 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl leading-tight">
                Born From Competitive Passion & National Pride
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Table tennis in Sri Lanka has immense raw talent, but often lacks the systematic, data-informed training regimens found in top Asian and European academies. Having represented Sri Lanka at the highest national and international levels, <strong className="text-[#101B35]">Chanul Dulsen</strong> recognized this gap.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                NextGen Table Tennis Academy was conceived to bridge this gap: offering individual attention, high-volume multiball drills, video analysis, and tactical match strategy in a premier, climate-controlled Colombo facility.
              </p>

              <div className="border-l-4 border-[#2675F5] pl-4 py-1 italic text-slate-700 bg-[#F5F7FB] rounded-r-xl">
                "Our philosophy is simple: technique creates consistency, consistency builds confidence, and confidence creates champions."
                <div className="mt-2 text-xs font-bold not-italic text-[#101B35]">
                  — Chanul Dulsen, Head Coach & Founder
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#2675F5]/30 shadow-2xl bg-[#101B35]">
                <Image
                  src="/images/coach-tournament-1.jpg"
                  alt="Chanul Dulsen competing internationally"
                  width={650}
                  height={500}
                  className="w-full h-[400px] object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101B35]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-bold uppercase text-[#2675F5]">Elite Standard</p>
                  <p className="text-base font-semibold">
                    Mentoring athletes with real-world championship tournament experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-[#F5F7FB] border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
              Guiding Principles
            </span>
            <h2 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
              Our Mission, Vision & Core Values
            </h2>
            <p className="text-slate-600">
              The foundational pillars that guide every drill, session, and tournament strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-card border border-slate-200 hover:border-[#2675F5] transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2675F5] mb-6">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#101B35]">Our Mission</h3>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                To empower players of all ages and capabilities through individualized coaching, disciplined work ethics, and state-of-the-art facilities—cultivating national title contenders and lifelong sportsmanship.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2675F5]" />
                  <span>Precision stroke biomechanics & footwork</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2675F5]" />
                  <span>Mental fortitude & tactical rally awareness</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2675F5]" />
                  <span>Accessible training for youth and adults</span>
                </li>
              </ul>
            </div>

            {/* Vision Card */}
            <div className="rounded-3xl bg-[#101B35] text-white p-8 sm:p-10 shadow-card border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-60 w-60 rounded-full bg-[#2675F5]/20 blur-2xl pointer-events-none" />
              
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2675F5] text-white mb-6">
                  <Eye className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                <p className="mt-4 text-base text-slate-300 leading-relaxed">
                  To establish NextGen as Sri Lanka's benchmark table tennis development hub, recognized internationally for producing disciplined competitors who excel on national and global podiums.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#2675F5]" />
                    <span>Nurturing junior players from grassroots to national teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#2675F5]" />
                    <span>Modernizing Sri Lankan table tennis coaching standards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#2675F5]" />
                    <span>A thriving, supportive community of table tennis lovers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2675F5] mb-3">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-[#101B35]">Technical Mastery</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Emphasis on clean mechanics, topspin generation, and deceptive service variations.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3">
                <Trophy className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-[#101B35]">Champion Mindset</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Developing psychological grit to remain poised under high tournament pressure.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
                <Users2 className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-[#101B35]">Community & Sport</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Welcoming environment for recreational players, families, and school squads.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-[#101B35]">Fairness & Transparency</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Straightforward pricing, pay-at-academy flexibility, and honest feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Recreation Highlight */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#101B35] text-white p-8 sm:p-14 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-block rounded-full bg-[#2675F5]/20 text-[#2675F5] px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                  Academy Infrastructure
                </span>
                <h3 className="text-3xl font-extrabold sm:text-4xl text-white">
                  Competition Table & Complimentary Pool Table
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  Our facility is purpose-built to maximize training comfort: anti-glare ITTF tournament table tennis setup with dedicated coaching space, complemented by a full-size pool table for relaxation before and after intense sessions.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold">
                    <span>🏓 1 Professional Table Tennis Court</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 text-emerald-300 px-4 py-2 text-sm font-semibold border border-emerald-500/30">
                    <Sparkles className="h-4 w-4" />
                    <span>1 Complimentary Pool Table</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <Link
                  href="/booking"
                  className="rounded-2xl bg-[#2675F5] px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/30 hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <span>Book Your Session Now</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
