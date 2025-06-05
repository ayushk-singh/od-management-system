import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isStudentRoute = createRouteMatcher(['/dashboard/student(.*)']);
const isFacultyRoute = createRouteMatcher(['/dashboard/faculty(.*)']);
const isHodRoute = createRouteMatcher(['/dashboard/hod(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (isStudentRoute(req) && role !== 'student') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (isFacultyRoute(req) && role !== 'faculty') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (isHodRoute(req) && role !== 'hod') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/(api|trpc)(.*)',
  ],
};
