import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "thrithi-nakshatra-jwt-secret-key-987";
}

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
    pages: {
      signIn: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "thrithi-nakshatra-jwt-secret-key-987",
  }
);

export const config = {
  // Protect all /admin routes. NextAuth automatically bypasses the signIn page (admin/login)
  matcher: ["/admin/:path*"],
};
