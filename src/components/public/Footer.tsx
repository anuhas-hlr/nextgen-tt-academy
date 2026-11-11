import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Mail, Clock, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Coach Chanul Dulsen', href: '/coach' },
  { label: 'Programs & Rates', href: '/programs' },
  { label: 'Academy Gallery', href: '/gallery' },
  { label: 'Contact & Location', href: '/contact' },
  { label: 'Online Booking', href: '/booking' },
];

const PROGRAMS = [
  { label: 'Personal Coaching (1-on-1)', price: 'LKR 2,500/hr' },
  { label: 'Group Coaching Sessions', price: 'LKR 2,500/hr' },
  { label: 'Table-Only Rental', price: 'LKR 500/hr' },
  { label: 'Complimentary Pool Table', price: 'Free with Booking' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#101B35] text-slate-300 border-t border-white/10">
      {/* Top Banner / Feature Strip */}
      <div className="border-b border-white/10 bg-white/5 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2675F5]/20 text-[#2675F5]">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Head Coach</p>
                <p className="text-sm font-semibold text-white">Chanul Dulsen (SL No. 1)</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2675F5]/20 text-[#2675F5]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Complimentary Perk</p>
                <p className="text-sm font-semibold text-white">Free Pool Table Access</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Payment Policy</p>
                <p className="text-sm font-semibold text-white">Pay In-Person at Academy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2675F5] text-white">
                <span>🏓</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                NextGen <span className="text-[#2675F5]">TT Academy</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Colombo’s premier table tennis training center founded by Sri Lanka National No. 1 Chanul Dulsen. Dedicated to shaping elite athletes and table tennis enthusiasts.
            </p>
            <div className="pt-2">
              <a
                href={ACADEMY_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#2675F5] hover:underline"
              >
                <MapPin className="h-4 w-4" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Navigation</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-[#2675F5]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs & Pricing */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Programs & Rates</h3>
            <ul className="mt-4 space-y-3">
              {PROGRAMS.map((item, idx) => (
                <li key={idx} className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">{item.label}</span>
                  <span className="text-xs font-semibold text-[#2675F5]">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact & Academy Hours</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#2675F5] mt-1" />
                <span>{ACADEMY_CONFIG.name}, {ACADEMY_CONFIG.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#2675F5]" />
                <a href={`tel:${ACADEMY_CONFIG.phoneRaw}`} className="hover:text-white transition">
                  {ACADEMY_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                <a
                  href={ACADEMY_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition font-medium"
                >
                  WhatsApp: {ACADEMY_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#2675F5]" />
                <a href={`mailto:${ACADEMY_CONFIG.email}`} className="hover:text-white transition">
                  {ACADEMY_CONFIG.email}
                </a>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-[#2675F5]" />
                  <span>Mon – Sat: 6:00 AM – 10:00 PM</span>
                </div>
                <div className="ml-5 text-xs text-slate-400">Sun: 7:00 AM – 9:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Copyright */}
      <div className="border-t border-white/10 bg-[#0B1325] py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p suppressHydrationWarning>© {currentYear} NextGen Table Tennis Academy. All rights reserved.</p>
          <p className="text-slate-400">
            Coached by Sri Lanka No. 1 <span className="text-white font-medium">Chanul Dulsen</span>
          </p>
          <div className="flex gap-4">
            <Link href="/booking" className="text-[#2675F5] hover:underline">
              Book Session
            </Link>
            <Link href="/contact" className="text-slate-400 hover:text-white">
              Directions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
