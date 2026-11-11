'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ACADEMY_CONFIG } from '@/lib/constants';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Coaching Inquiry',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }
    setErrorMsg('');
    setIsSubmitted(true);
  };

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-[#101B35] py-16 sm:py-24 text-white">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-[#2675F5]/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-[#2675F5]/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-4">
            <MapPin className="h-4 w-4 text-[#2675F5]" />
            <span>Connect with NextGen TT</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Get in Touch with Coach Chanul
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Have questions about training schedules, junior squad enrollment, or court reservations? We’re here to help you get started.
          </p>
        </div>
      </section>

      {/* Main Grid: Details & Form */}
      <section className="py-20 bg-[#F5F7FB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Info & Opening Hours */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2675F5]">
                  Contact Directory
                </span>
                <h2 className="text-3xl font-extrabold text-[#101B35] mt-1">
                  Visit or Message Us
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Located in the heart of Colombo with private parking and professional table tennis training grounds.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2675F5]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#101B35] text-sm">Academy Address</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      NextGen Table Tennis Academy, Colombo, Sri Lanka
                    </p>
                    <a
                      href="https://maps.app.goo.gl/NnL6NtGwU9xm4EmA8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#2675F5] hover:underline"
                    >
                      <span>Open in Google Maps</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#101B35] text-sm">WhatsApp & Direct Calls</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Direct line to academy management & Coach Chanul
                    </p>
                    <a
                      href={ACADEMY_CONFIG.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm font-bold text-[#101B35] hover:text-emerald-600 transition"
                    >
                      {ACADEMY_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#101B35] text-sm">Email Inquiries</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      For corporate inquiries, sponsorships, and squad coaching
                    </p>
                    <a
                      href="mailto:info@nextgentt.lk"
                      className="mt-1 block text-sm font-bold text-[#101B35] hover:text-[#2675F5] transition"
                    >
                      info@nextgentt.lk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="w-full">
                    <h4 className="font-bold text-[#101B35] text-sm">Opening Hours</h4>
                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Monday – Saturday:</span>
                        <span className="font-semibold text-[#101B35]">6:00 AM – 10:00 PM</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span>Sunday:</span>
                        <span className="font-semibold text-[#101B35]">7:00 AM – 9:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maps Banner */}
              <div className="rounded-2xl bg-[#101B35] text-white p-6 shadow-md border border-white/10">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#2675F5]" />
                  <span>Google Maps Navigation</span>
                </h4>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Pinpoint our location directly on your phone and get live turn-by-turn directions.
                </p>
                <a
                  href="https://maps.app.goo.gl/NnL6NtGwU9xm4EmA8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2675F5] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition shadow-md"
                >
                  <span>Open Google Maps Location</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-card border border-slate-200">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#101B35]">Message Sent Successfully!</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting NextGen TT Academy. Coach Chanul or our academy coordinator will get in touch with you shortly.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormState({
                            name: '',
                            email: '',
                            phone: '',
                            subject: 'Coaching Inquiry',
                            message: '',
                          });
                        }}
                        className="rounded-xl bg-[#101B35] px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h3 className="text-2xl font-bold text-[#101B35]">Send Us a Message</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Fill out the form below and we will respond promptly within 24 hours.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Kamal Gunasekara"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="kamal@example.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                          Phone / WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+94 75 639 9105"
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                          Inquiry Subject
                        </label>
                        <select
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                        >
                          <option value="Coaching Inquiry">1-on-1 Personal Coaching (LKR 2,500/hr)</option>
                          <option value="Group Squad">Group Training Session (LKR 2,500/hr)</option>
                          <option value="Table Rental">Table-Only Court Rental (LKR 500/hr)</option>
                          <option value="School / Corporate">School / Corporate Squads</option>
                          <option value="Other">General Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                        Your Message *
                      </label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Tell us about your table tennis goals, availability, or any questions..."
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#101B35] focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/20 shadow-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2675F5] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 transition"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send Inquiry Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
