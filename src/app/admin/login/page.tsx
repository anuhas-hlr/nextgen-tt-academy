export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-navy-900 p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white">Admin Login</h2>
        <p className="mt-1 text-sm text-slate-400">Sign in to manage NextGen TT Academy bookings</p>
        <form className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input type="email" placeholder="admin@nextgentt.lk" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <input type="password" placeholder="••••••••" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-500">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
