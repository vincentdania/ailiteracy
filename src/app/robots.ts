import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/dashboard", "/checkout", "/onboarding", "/referrals"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
