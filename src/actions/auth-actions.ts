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

/**
 * Universal Login: Handles both Admin (redirects to /admin/dashboard)
 * and Player / Customer (redirects to /booking or /booking/status)
 */
export async function universalLogin(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string;

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

  // Check role in profiles table
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role, full_name')
    .eq('id', authData.user.id)
    .single();

  const userRole = (profile as { role?: string; full_name?: string } | null)?.role;

  if (userRole === 'admin') {
    redirect('/admin/dashboard');
  }

  if (redirectTo && redirectTo.startsWith('/')) {
    redirect(redirectTo);
  } else {
    redirect('/booking/status');
  }
}

/**
 * Universal User Registration (Sign up as Player)
 */
export async function userSignUp(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const fullName = (formData.get('fullName') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();

  if (!email || !password || !fullName || !phone) {
    return { error: 'Please fill in all required fields.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  const supabase = await createClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (signUpError || !signUpData.user) {
    return { error: signUpError?.message || 'Failed to create account.' };
  }

  // Update profile and players records
  try {
    await (supabase as any)
      .from('profiles')
      .upsert({
        id: signUpData.user.id,
        email,
        full_name: fullName,
        role: 'player',
        updated_at: new Date().toISOString(),
      });

    await (supabase as any)
      .from('players')
      .upsert({
        user_id: signUpData.user.id,
        full_name: fullName,
        phone: phone,
        email: email,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'phone' });
  } catch (err) {
    console.error('Error syncing player profile on signup:', err);
  }

  redirect('/booking');
}

/**
 * Get current session user profile for client state
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Also fetch phone from player table if present
  let phone = '';
  if (user.email) {
    const { data: player } = await (supabase as any)
      .from('players')
      .select('phone')
      .eq('email', user.email)
      .maybeSingle();
    phone = player?.phone || '';
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      fullName: profile?.full_name || user.user_metadata?.full_name || '',
      phone: phone || user.user_metadata?.phone || '',
      role: profile?.role || 'player',
      avatarUrl: profile?.avatar_url || null,
    },
  };
}

export async function userLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
