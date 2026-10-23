import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth(async (request) => {
  const path = request.nextUrl.pathname;
  const user = request.auth?.user;

  if (/^\/challenge\/[^/]+\/?$/.test(path)) return NextResponse.redirect(new URL("/", request.url), 301);
  if (!user) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path + request.nextUrl.search)}`, request.url));
  if (path.startsWith("/admin") && user.role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", request.url));
  return NextResponse.next();
});

export const config = { matcher: ["/dashboard/:path*", "/challenge/:path*", "/certificates", "/checkout", "/admin/:path*"], runtime: "nodejs" };
