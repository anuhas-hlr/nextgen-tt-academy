import Link from 'next/link';
import {
  UserCheck,
  Users,
  CircleDot,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Clock,
  Banknote,
  Award,
} from 'lucide-react';

export const metadata = {
  title: 'Coaching Programs & Rates | NextGen TT Academy',
  description:
    'Explore table tennis training programs at NextGen TT Academy, Colombo. Personal coaching (LKR 2,500/hr), Group coaching (LKR 2,500/hr), Table rentals (LKR 500/hr).',
};

const PROGRAMS = [
  {
    id: 'personal',
    name: 'Personal Coaching (1-on-1)',
    badge: 'Flagship Training',
    popular: true,
    price: 'LKR 2,500',
    unit: 'per hour',
    icon: UserCheck,
    summary:
      'Direct, dedicated 1-on-1 private mentorship with National No. 1 Chanul Dulsen. Accelerate your technique, solve technical flaws, and build a personalized competitive strategy.',
    features: [
      'Personal attention directly from Champion Chanul Dulsen',
      'Customized stroke biomechanics & footwork drills',
      'High-intensity multiball feeding tailored to your level',
      'Service variation, heavy spin, and third-ball attack mastery',
      'Video-assisted stroke feedback and analysis',
      'Complimentary access to academy Pool Table during booking',
    ],
    ctaText: 'Book Personal Coaching',
    ctaLink: '/booking?type=personal',
  },
  {
    id: 'group',
    name: 'Group Coaching Sessions',
    badge: 'Squad Drills',
    popular: false,
    price: 'LKR 2,500',
    unit: 'per hour',
    icon: Users,
    summary:
      'Structured group coaching focusing on tactical consistency, competitive rallies, and pressure match situations. Ideal for school athletes, doubles partners, and squads.',
    features: [
      'Comprehensive squad warm-up, agility, and footwork patterns',
      'Rotational multiball and paired tactical drills',
      'Simulated tournament match play under pressure conditions',
      'Serve and receive tactical counter-play scenarios',
      'Peer competition to foster tenacity and mental grit',
      'Complimentary access to academy Pool Table during booking',
    ],
    ctaText: 'Book Group Session',
    ctaLink: '/booking?type=group',
  },
  {
    id: 'table',
    name: 'Table-Only Rental',
    badge: 'Open Play',
    popular: false,
    price: 'LKR 500',
    unit: 'per hour',
    icon: CircleDot,
    summary:
      'Rent our competition-grade ITTF table for practice rallies, sparring sets with a friend, or recreational family matches at an unbeatable hourly rate.',
    features: [
      'Full access to official competition-grade 25mm TT table',
      'ITTF-certified 3-star training balls & nets included',
      'High-traction rubber sports flooring for joint protection',
      'Zero coaching oversight—play at your own pace',
      'Bring a friend or partner at no extra cost per player',
      'Complimentary access to academy Pool Table during booking',
    ],
    ctaText: 'Reserve Table Only',
    ctaLink: '/booking?type=table',
  },
];

const FAQS = [
  {
    q: 'How does the payment process work?',
    a: 'We operate on a transparent "Pay at Academy" policy. You can reserve your time slot online without paying in advance. Payment in cash or bank transfer is collected in person upon arrival at the academy.',
  },
  {
    q: 'Is the pool table really free?',
    a: 'Yes! All court bookings (whether Personal Coaching, Group Coaching, or Table-Only rental) include complimentary access to our professional pool table during your booked session time.',
  },
  {
    q: 'Do I need to bring my own table tennis racket and balls?',
    a: 'We provide tournament-standard 3-star balls. If you do not own a racket, we have high-quality academy bats available for practice at no extra charge.',
  },
  {
    q: 'What skill level is required for Personal Coaching?',
    a: 'Chanul coaches all skill brackets—from total beginners holding a paddle for the first time, to school tournament competitors, to seasoned veteran club players looking to sharpen their counter-spin.',
  },
  {
    q: 'What is the academy cancellation policy?',
    a: 'We kindly request at least 4 hours advance notice if you need to reschedule or cancel your session so another waiting player can utilize the table.',
  },
];

export default function ProgramsPage() {
  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-[#101B35] py-16 sm:py-24 text-white">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-[#2675F5]/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-[#2675F5]/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-4">
            <span>Coaching & Table Rates</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Training Programs & Transparent Rates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Professional coaching led by Sri Lanka National No. 1 Chanul Dulsen. Honest hourly pricing with no upfront card payments required.
          </p>
        </div>
      </section>

      {/* Program Cards Grid */}
      <section className="py-20 bg-[#F5F7FB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
            {PROGRAMS.map((prog) => {
              const Icon = prog.icon;
              return (
                <div
                  key={prog.id}
                  className={`flex flex-col justify-between rounded-3xl bg-white p-8 sm:p-10 shadow-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative ${
                    prog.popular ? 'border-2 border-[#2675F5]' : 'border border-slate-200'
                  }`}
                >
                  {prog.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#2675F5] px-4 py-1 text-xs font-bold text-white shadow-md uppercase tracking-wider">
                      Most In Demand
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2675F5]">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="text-xs font-bold text-[#2675F5] bg-blue-50 px-3 py-1 rounded-full">
                        {prog.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-[#101B35]">{prog.name}</h3>

                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#101B35]">
                        {prog.price}
                      </span>
                      <span className="text-sm font-medium text-slate-500">{prog.unit}</span>
                    </div>

                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                      {prog.summary}
                    </p>

                    <div className="mt-8 border-t border-slate-100 pt-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                        What's Included
                      </p>
                      <ul className="space-y-3 text-sm text-slate-600">
                        {prog.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-[#2675F5] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 pt-4">
                    <Link
                      href={prog.ctaLink}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition shadow-md ${
                        prog.popular
                          ? 'bg-[#2675F5] text-white hover:bg-blue-600 shadow-blue-500/25'
                          : 'bg-[#101B35] text-white hover:bg-slate-800'
                      }`}
                    >
                      <span>{prog.ctaText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complimentary Pool Table Callout Strip */}
          <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#101B35] to-blue-950 p-8 sm:p-10 text-white shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Special Academy Feature</span>
              </div>
              <h3 className="text-2xl font-bold">Complimentary Pool Table With Every Booking</h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Whether you book a 1-on-1 coaching session or an hourly table rental, enjoy free access to our regulation pool table to unwind with friends.
              </p>
            </div>
            <Link
              href="/booking"
              className="shrink-0 rounded-xl bg-white px-7 py-3 text-sm font-bold text-[#101B35] hover:bg-slate-100 transition shadow-lg"
            >
              Book a Court Now
            </Link>
          </div>
        </div>
      </section>

      {/* Program Comparison Table */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
              Side-by-Side Comparison
            </h2>
            <p className="text-slate-600">
              Clear breakdown of session differences to pick the right option for your goals.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-[#101B35] text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-semibold">Features</th>
                  <th className="py-4 px-6 font-semibold text-[#2675F5]">Personal Coaching</th>
                  <th className="py-4 px-6 font-semibold">Group Coaching</th>
                  <th className="py-4 px-6 font-semibold">Table Rental</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-medium text-[#101B35]">Hourly Rate</td>
                  <td className="py-4 px-6 font-bold text-[#2675F5]">LKR 2,500 / hr</td>
                  <td className="py-4 px-6 font-bold text-[#101B35]">LKR 2,500 / hr</td>
                  <td className="py-4 px-6 font-bold text-[#101B35]">LKR 500 / hr</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-medium text-[#101B35]">Coach Oversight</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">1-on-1 (Chanul Dulsen)</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">Squad Mentorship</td>
                  <td className="py-4 px-6 text-slate-400">Self-Practice (No Coach)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-medium text-[#101B35]">Multiball Drills</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">Included (Intensive)</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">Included (Rotational)</td>
                  <td className="py-4 px-6 text-slate-400">None</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-medium text-[#101B35]">Balls & Net Provided</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">3-Star ITTF Balls</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">3-Star ITTF Balls</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">3-Star ITTF Balls</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-medium text-[#101B35]">Complimentary Pool Table</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">Yes (Free Access)</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">Yes (Free Access)</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold">Yes (Free Access)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-medium text-[#101B35]">Payment Method</td>
                  <td className="py-4 px-6 font-medium text-[#101B35]">Pay at Academy</td>
                  <td className="py-4 px-6 font-medium text-[#101B35]">Pay at Academy</td>
                  <td className="py-4 px-6 font-medium text-[#101B35]">Pay at Academy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-[#F5F7FB] border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2675F5]">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-[#101B35] sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-[#2675F5] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-[#101B35]">{faq.q}</h4>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-600">
              Need custom arrangements or squad training times?{' '}
              <Link href="/contact" className="font-semibold text-[#2675F5] hover:underline">
                Contact Coach Chanul directly
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
