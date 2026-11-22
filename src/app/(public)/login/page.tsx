'use client';

import { useActionState, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { universalLogin, userSignUp, requestPasswordReset } from '@/actions/auth-actions';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Phone,
} from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '';
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showReset, setShowReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginState, loginAction, isLoginPending] = useActionState(universalLogin, null);
  const [signUpState, signUpAction, isSignUpPending] = useActionState(userSignUp, null);
  const [resetState, resetAction, isResetPending] = useActionState(requestPasswordReset, null);

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#101B35] px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(#2675F5_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Brand Icon Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2675F5] shadow-lg shadow-blue-500/30">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
            {mode === 'login' ? 'NextGen Account Login' : 'Create Player Account'}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {mode === 'login'
              ? 'Access your athlete bookings or admin dashboard'
              : 'Save your details for instant 1-click table bookings'}
          </p>
        </div>

        {/* Tab switch between Login and Sign Up (when not in reset mode) */}
        {!showReset && (
          <div className="mt-6 flex rounded-xl border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                mode === 'login'
                  ? 'bg-[#2675F5] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                mode === 'signup'
                  ? 'bg-[#2675F5] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Player Sign Up
            </button>
          </div>
        )}

        {!showReset ? (
          mode === 'login' ? (
            /* Login Form */
            <form action={loginAction} className="mt-6 space-y-4">
              <input type="hidden" name="redirectTo" value={redirectTo} />

              {loginState?.error && (
                <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{loginState.error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="player@example.com or coach@nextgen.lk"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#2675F5]"
                  />
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#2675F5]"
                  />
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoginPending}
                className="w-full rounded-xl bg-[#2675F5] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
              >
                {isLoginPending ? 'Verifying...' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* Sign Up Form for New Players */
            <form action={signUpAction} className="mt-6 space-y-4">
              {signUpState?.error && (
                <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{signUpState.error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Kasun Perera"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#2675F5]"
                  />
                  <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+94 77 123 4567"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#2675F5]"
                  />
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="kasun@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#2675F5]"
                  />
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Choose Password (min 6 chars)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#2675F5]"
                  />
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSignUpPending}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-600/40 active:scale-95 disabled:opacity-50"
              >
                {isSignUpPending ? 'Creating Account...' : 'Register as Player'}
              </button>
            </form>
          )
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
                Your Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your-email@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#2675F5] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#2675F5]"
                />
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetPending}
              className="w-full rounded-xl bg-[#2675F5] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
            >
              {isResetPending ? 'Sending...' : 'Send Reset Instructions'}
            </button>

            <button
              type="button"
              onClick={() => setShowReset(false)}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white pt-2 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition">
            ← Return to Academy Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#101B35] flex items-center justify-center text-slate-400 text-sm">
          Loading login portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
