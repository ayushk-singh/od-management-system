import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isStudentRoute = createRouteMatcher(["/dashboard/student(.*)"]);
const isFacultyRoute = createRouteMatcher(["/dashboard/faculty(.*)"]);
const isHodRoute = createRouteMatcher(["/dashboard/hod(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  try {
    const { sessionClaims } = await auth();

    if (!sessionClaims) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
    }

    const role = sessionClaims.metadata?.role;

    if (isStudentRoute(req) && role !== "student") {
      return NextResponse.redirect(
        new URL("/unauthorized", req.nextUrl.origin)
      );
    }

    if (isFacultyRoute(req) && role !== "faculty") {
      return NextResponse.redirect(
        new URL("/unauthorized", req.nextUrl.origin)
      );
    }

    if (isHodRoute(req) && role !== "hod") {
      return NextResponse.redirect(
        new URL("/unauthorized", req.nextUrl.origin)
      );
    }

    if (isAdminRoute(req) && role !== "admin") {
      return NextResponse.redirect(
        new URL("/unauthorized", req.nextUrl.origin)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return new NextResponse("Internal Middleware Error", { status: 500 });
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*","/api/:path*"],
};
