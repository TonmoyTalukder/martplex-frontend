import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import { getCurrentUser } from '@/src/services/AuthService';

const AuthRoutes = ['/login', '/signup']; // Public routes for unauthenticated users
// const ProtectedRoutes = ['/verify']; // Routes restricted to logged-in users

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getCurrentUser();

  // If user is not logged in
  if (!user) {
    if (pathname === '/verify') {
      return NextResponse.redirect(
        new URL(`/login?redirect=/verify`, request.url),
      ); // Redirect unauthenticated users to login with redirect to /verify
    }

    if (AuthRoutes.includes(pathname) || pathname === '/') {
      return NextResponse.next(); // Allow access to login, signup, and home page
    }

    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url),
    ); // Redirect unauthenticated users to login
  }

  // If user is logged in but not verified
  if (!user.isVerified) {
    if (pathname === '/verify') {
      return NextResponse.next(); // Allow access to the /verify page
    }

    return NextResponse.redirect(new URL('/verify', request.url)); // Redirect to /verify
  }

  // If user is logged in and verified
  if (pathname === '/verify') {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect verified users away from /verify to home
  }

  if (AuthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url)); // Restrict access to login/signup for logged-in users
  }

  return NextResponse.next(); // Allow access to all other routes
}

export const config = {
  matcher: ['/login', '/signup', '/verify', '/profile', '/profile/:page*'],
};
