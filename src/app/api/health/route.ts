import { db } from "@/lib/db";
import { cache } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    const healthCache = cache();
    await healthCache.set("health:app", "ok", 30);
    if (await healthCache.get("health:app") !== "ok") throw new Error("Cache write check failed");
    return Response.json({ status: "ok", service: "ai-literacy-lms", timestamp: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ status: "unavailable", service: "ai-literacy-lms" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
