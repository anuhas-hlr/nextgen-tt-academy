'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  Sparkles,
  Maximize2,
  X,
  ArrowRight,
  Camera,
  MapPin,
  Calendar,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'competitions' | 'coaching' | 'facilities';
  categoryLabel: string;
  imageSrc: string;
  caption: string;
  badge?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    title: 'Match Service Biomechanics',
    category: 'coaching',
    categoryLabel: 'Technique & Training',
    imageSrc: '/images/coach-serve-closeup.jpg',
    caption: 'Chanul Dulsen demonstrating the reverse pendulum serve, focusing on ball contact and heavy spin disguise.',
    badge: 'National No. 1',
  },
  {
    id: '2',
    title: 'Individual Table Mentorship',
    category: 'coaching',
    categoryLabel: 'Coaching Sessions',
    imageSrc: '/images/coach-action-doubles.jpg',
    caption: 'Hands-on multiball drill and return-of-serve positioning with student athlete at the ITTF tournament table.',
    badge: '1-on-1 Session',
  },
  {
    id: '3',
    title: 'Asian ITTF Championship Rally',
    category: 'competitions',
    categoryLabel: 'International Circuit',
    imageSrc: '/images/coach-tournament-1.jpg',
    caption: 'Chanul representing Sri Lanka on the international stage, executing high-speed topspin counter loops.',
    badge: 'International Play',
  },
  {
    id: '4',
    title: 'Championship Smash & Recovery',
    category: 'competitions',
    categoryLabel: 'Tournament Action',
    imageSrc: '/images/coach-tournament-2.jpg',
    caption: 'Explosive overhead smash finishing a critical match rally with precision court balance.',
    badge: 'Match Winning Point',
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredItems =
    activeCategory === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div>
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#101B35] py-16 sm:py-24 text-white">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-[#2675F5]/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-[#2675F5]/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-4">
            <Camera className="h-4 w-4 text-[#2675F5]" />
            <span>Academy & Tournament Media</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            NextGen Photo Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Witness the discipline, intensity, and international tournament pedigree that Coach Chanul Dulsen brings to NextGen TT Academy.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-16 sm:py-20 bg-[#F5F7FB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'coaching', label: 'Coaching & Training' },
              { id: 'competitions', label: 'Championships & Tournaments' },
              { id: 'facilities', label: 'Academy Facilities' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  activeCategory === cat.id
                    ? 'bg-[#2675F5] text-white shadow-md shadow-blue-500/25 ring-2 ring-[#2675F5]/30'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#101B35] shadow-card border border-slate-200/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101B35] via-[#101B35]/20 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                  {/* Top Badge */}
                  {item.badge && (
                    <div className="absolute top-4 left-4 rounded-full bg-[#2675F5]/90 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md shadow-md">
                      {item.badge}
                    </div>
                  )}

                  {/* Expand icon on hover */}
                  <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                    <Maximize2 className="h-4 w-4" />
                  </div>

                  {/* Bottom Captions */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2675F5]">
                      {item.categoryLabel}
                    </span>
                    <h3 className="mt-1 text-xl font-bold">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Special Facility Feature Card */}
            {(activeCategory === 'all' || activeCategory === 'facilities') && (
              <>
                <div className="flex flex-col justify-between rounded-3xl bg-white p-8 border border-slate-200 shadow-card">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2675F5] mb-4">
                      <span className="text-2xl">🏓</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2675F5]">
                      Facility Asset
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-[#101B35]">
                      ITTF-Standard Competition Table Tennis Table
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Official 25mm blue competition tabletop with zero-glare matte coating, heavy-gauge steel chassis, and tournament net assembly.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Colombo Academy Hall</span>
                    <span className="font-semibold text-emerald-600">Available for Bookings</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-3xl bg-white p-8 border border-slate-200 shadow-card">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                        Facility Asset
                      </span>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                        Complimentary
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-[#101B35]">
                      Full-Size Recreational Pool Table
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Enjoy complimentary matches before or after your table tennis training. Free cue sticks, chalk, and competition balls provided.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Included With Every TT Session</span>
                    <span className="font-semibold text-[#2675F5]">Free Access</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Book Session Callout */}
          <div className="mt-16 text-center rounded-3xl bg-[#101B35] text-white p-10 sm:p-14 shadow-xl border border-white/10">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Ready to Train on These Courts?
            </h3>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Book your private coaching session or court reservation today. Pay when you arrive.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2675F5] px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/30 hover:bg-blue-600 transition"
              >
                <span>Book a Session Online</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                <span>Visit Us in Colombo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-[#101B35] border border-white/20 shadow-2xl"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition"
              aria-label="Close photo preview"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative h-[420px] sm:h-[520px] w-full">
              <Image
                src={selectedPhoto.imageSrc}
                alt={selectedPhoto.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-[#0B1325] text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2675F5]">
                {selectedPhoto.categoryLabel}
              </span>
              <h3 className="mt-1 text-2xl font-bold">{selectedPhoto.title}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
