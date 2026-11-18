'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { adminLogout } from '@/actions/auth-actions';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Bookings', href: '/admin/dashboard/bookings', icon: CalendarCheck },
  { label: 'Calendar', href: '/admin/dashboard/calendar', icon: CalendarDays },
  { label: 'Players', href: '/admin/dashboard/players', icon: Users },
  { label: 'Payments', href: '/admin/dashboard/payments', icon: CreditCard },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex-1 space-y-1.5 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/admin/dashboard'
            ? pathname === '/admin/dashboard'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? 'bg-[#2675F5] text-white shadow-md shadow-blue-500/25'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[#101B35] px-4 text-white md:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2675F5]">
            <span className="text-sm">🏓</span>
          </div>
          <span className="text-base font-bold">NextGen Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#101B35]/95 backdrop-blur-md p-6 md:hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="text-lg font-bold text-white">NextGen Management</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-white/10 p-2 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks />
          </div>
          <div className="pt-4 border-t border-white/10 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Public Website</span>
            </Link>
            <form action={adminLogout}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-white/10 bg-[#101B35] text-white md:flex min-h-screen">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2675F5] to-blue-700 shadow-md">
                <span className="text-lg">🏓</span>
              </div>
              <div>
                <span className="block text-sm font-bold tracking-tight text-white leading-tight">
                  NextGen <span className="text-[#2675F5]">Admin</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">Operations Center</span>
              </div>
            </Link>
          </div>

          <NavLinks />
        </div>

        {/* Footer Area with Coach Profile & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-[#2675F5]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Chanul Dulsen</p>
              <p className="text-[10px] text-emerald-400 font-medium">Head Administrator</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition"
              title="Open public website in new tab"
              target="_blank"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Site</span>
            </Link>

            <form action={adminLogout}>
              <button
                type="submit"
                className="flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-300 transition"
              >
                <LogOut className="h-3 w-3" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
