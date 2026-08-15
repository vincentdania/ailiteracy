import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { referralCode } from "@/lib/utils";
import { enforceRateLimit } from "@/lib/redis";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;
      const loginLimit = await enforceRateLimit(`login:${parsed.data.email.toLowerCase()}`, 10, 15 * 60);
      if (!loginLimit.allowed) return null;
      const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() }, include: { profile: true } });
      if (!user?.passwordHash || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;
      if (!user.emailVerified) return null;
      return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role, onboardingDone: Boolean(user.profile?.onboardingDone) };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }));
}

export const authConfig = {
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;
      const record = await db.user.upsert({
        where: { email: user.email.toLowerCase() },
        update: { name: user.name, image: user.image, emailVerified: new Date() },
        create: { email: user.email.toLowerCase(), name: user.name, image: user.image, emailVerified: new Date(), referralCode: referralCode(user.name ?? undefined) },
      });
      user.id = record.id;
      user.role = record.role;
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
        token.onboardingDone = user.onboardingDone ?? false;
      }
      if ((trigger === "update" || !token.role) && token.email) {
        const record = await db.user.findUnique({ where: { email: token.email }, include: { profile: true } });
        if (record) {
          token.id = record.id;
          token.role = record.role;
          token.onboardingDone = Boolean(record.profile?.onboardingDone);
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.id ?? token.sub ?? "");
      session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      session.user.onboardingDone = Boolean(token.onboardingDone);
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut, unstable_update: updateSession } = NextAuth(authConfig);
