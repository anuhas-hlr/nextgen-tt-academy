'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { adminLogin, requestPasswordReset } from '@/actions/auth-actions';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [showReset, setShowReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginState, loginAction, isLoginPending] = useActionState(adminLogin, null);
  const [resetState, resetAction, isResetPending] = useActionState(requestPasswordReset, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101B35] px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(#2675F5_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Brand Icon Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2675F5] shadow-lg shadow-blue-500/30">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
            NextGen Admin Portal
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Secure operations console for Coach Chanul Dulsen
          </p>
        </div>

        {!showReset ? (
          /* Login Form */
          <form action={loginAction} className="mt-8 space-y-5">
            {loginState?.error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                <span>{loginState.error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@nextgentt.lk"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/30 transition"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-xs text-[#2675F5] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/30 transition"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoginPending}
              className="w-full rounded-xl bg-[#2675F5] py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isLoginPending ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
            </button>
          </form>
        ) : (
          /* Password Reset Form */
          <form action={resetAction} className="mt-8 space-y-5">
            {resetState?.error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                <span>{resetState.error}</span>
              </div>
            )}

            {resetState?.success && (
              <div className="flex items-start gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{resetState.message}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@nextgentt.lk"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:outline-none focus:ring-2 focus:ring-[#2675F5]/30 transition"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetPending}
              className="w-full rounded-xl bg-[#2675F5] py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isResetPending ? 'Sending Link...' : 'Send Password Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setShowReset(false)}
              className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition pt-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </button>
          </form>
        )}

        <div className="mt-8 border-t border-white/10 pt-4 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
            ← Back to NextGen TT Academy Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
