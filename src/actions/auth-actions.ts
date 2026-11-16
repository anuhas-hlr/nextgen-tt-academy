'use server';

import { createClient } from '@/lib/supabase/server';
import { adminLoginSchema } from '@/lib/validations';
import { redirect } from 'next/navigation';

export async function adminLogin(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = adminLoginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      error: validation.error.errors[0]?.message || 'Invalid input credentials',
    };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return {
      error: authError?.message || 'Invalid email or password. Please try again.',
    };
  }

  // Verify Admin Role in profiles
  const { data: profile, error: profileError } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  const userRole = (profile as { role?: string } | null)?.role;

  if (profileError || userRole !== 'admin') {
    // Force sign out non-admin attempts immediately
    await supabase.auth.signOut();
    return {
      error: 'Access denied: You do not possess administrator privileges for NextGen TT Academy.',
    };
  }

  redirect('/admin/dashboard');
}

export async function adminLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Password reset link sent to your email.' };
}
