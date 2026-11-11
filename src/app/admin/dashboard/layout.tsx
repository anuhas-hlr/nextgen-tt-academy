import Link from 'next/link';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-navy-900 p-6 flex flex-col justify-between">
        <div>
          <div className="text-lg font-bold text-white">NextGen <span className="text-brand-500">Admin</span></div>
          <nav className="mt-8 space-y-2">
            <Link href="/admin/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Overview</Link>
            <Link href="/admin/dashboard/bookings" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Bookings</Link>
            <Link href="/admin/dashboard/calendar" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Calendar</Link>
            <Link href="/admin/dashboard/players" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Players</Link>
            <Link href="/admin/dashboard/payments" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Payments</Link>
            <Link href="/admin/dashboard/settings" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Settings</Link>
          </nav>
        </div>
        <div className="border-t border-slate-800 pt-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-white">← Back to public site</Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-navy-950 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
