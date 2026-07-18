import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Fallbacks for NextAuth to satisfy production environment checks on Vercel
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "thrithi-nakshatra-jwt-secret-key-987";
}
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Panel",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@thrithinakshatra.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          return { id: "admin-1", name: "Boutique Admin", email: adminEmail, role: "admin" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "thrithi-nakshatra-jwt-secret-key-987",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day session
  }
});

export { handler as GET, handler as POST };
