import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
const publicPaths = ["/", "/tracks/small-business", "/tracks/professionals", "/signup", "/login"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}`, changeFrequency: "weekly", priority: path === "/" ? 1 : 0.6 }));
}
