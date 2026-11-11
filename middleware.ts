import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return response;
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // Admin route protection
    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
      if (!session) {
        const redirectUrl = new URL('/admin/login', request.url);
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Prevent logged-in admins from accessing login page
    if (request.nextUrl.pathname === '/admin/login' && session) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  } catch (err) {
    // Graceful fallback if Supabase is not reachable
    console.error('Middleware auth check error:', err);
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};
