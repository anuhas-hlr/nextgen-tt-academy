'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Coach', href: '/coach' },
  { label: 'Programs', href: '/programs' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#101B35]/95 shadow-lg backdrop-blur-md border-b border-white/10 py-3'
          : 'bg-[#101B35] py-4 border-b border-white/5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2675F5] to-blue-700 shadow-md shadow-blue-500/30 transition-transform group-hover:scale-105">
            <span className="text-xl">🏓</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white">
              NextGen <span className="text-[#2675F5]">TT</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              Table Tennis Academy
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-white ${
                  isActive ? 'text-[#2675F5] font-semibold' : 'text-slate-300'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#2675F5] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href={ACADEMY_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <Phone className="h-3.5 w-3.5 text-[#2675F5]" />
            <span>{ACADEMY_CONFIG.phone}</span>
          </a>
          <Link
            href="/booking"
            className="group flex items-center gap-2 rounded-xl bg-[#2675F5] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95"
          >
            <span>Book a Session</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white md:hidden hover:bg-white/20 transition focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-white/10 bg-[#101B35] px-4 pt-3 pb-6 md:hidden animate-fade-in shadow-2xl">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition ${
                    isActive
                      ? 'bg-[#2675F5]/15 text-[#2675F5] font-semibold'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={ACADEMY_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-slate-300"
              >
                <Phone className="h-4 w-4 text-[#2675F5]" />
                <span>Call / WhatsApp: {ACADEMY_CONFIG.phone}</span>
              </a>
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#2675F5] py-3 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/30"
              >
                <span>Book a Session</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
