export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-slate-400">Academy key performance metrics and today's schedule.</p>
      
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-navy-900 p-5">
          <p className="text-xs font-medium text-slate-400">Today's Bookings</p>
          <p className="mt-2 text-2xl font-bold text-white">12</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-navy-900 p-5">
          <p className="text-xs font-medium text-slate-400">Table Occupancy</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">82%</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-navy-900 p-5">
          <p className="text-xs font-medium text-slate-400">Active Players</p>
          <p className="mt-2 text-2xl font-bold text-white">148</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-navy-900 p-5">
          <p className="text-xs font-medium text-slate-400">Monthly Revenue (LKR)</p>
          <p className="mt-2 text-2xl font-bold text-brand-500">425,000</p>
        </div>
      </div>
    </div>
  );
}
