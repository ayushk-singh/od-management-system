import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isStudentRoute = createRouteMatcher(['/dashboard/student(.*)']);
const isFacultyRoute = createRouteMatcher(['/dashboard/faculty(.*)']);
const isHodRoute = createRouteMatcher(['/dashboard/hod(.*)']);

export default clerkMiddleware(async (auth, req) => {
  try {
    const { sessionClaims } = await auth();

    // If sessionClaims are missing (i.e., user not logged in), redirect to login
    if (!sessionClaims) {
      return NextResponse.next();
    }

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
  } catch (error) {
    console.error('Middleware error:', error);
    return new NextResponse('Internal Middleware Error', { status: 500 });
  }
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/(api|trpc)(.*)',
  ],
};
