import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default auth(async (request) => {
  const path = request.nextUrl.pathname;
  const user = request.auth?.user;
  if (!user) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url));
  if (path.startsWith("/admin") && user.role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", request.url));
  if (!path.startsWith("/admin") && !user.onboardingDone && path !== "/onboarding") {
    const profile = await db.userProfile.findUnique({ where: { userId: user.id }, select: { onboardingDone: true } });
    if (!profile?.onboardingDone) return NextResponse.redirect(new URL("/onboarding", request.url));
  }
  return NextResponse.next();
});

export const config = { matcher: ["/dashboard/:path*", "/challenge/:path*", "/checkout", "/referrals/:path*", "/admin/:path*", "/onboarding"], runtime: "nodejs" };
