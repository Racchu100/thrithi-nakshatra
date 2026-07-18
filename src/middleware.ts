import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

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
  }
);

export const config = {
  // Protect all /admin routes. NextAuth automatically bypasses the signIn page (admin/login)
  matcher: ["/admin/:path*"],
};
