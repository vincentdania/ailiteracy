import { db } from "@/lib/db";
import { cache } from "@/lib/redis";
import { productionReadinessIssues, productionReadinessWarnings } from "@/lib/production-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const configurationIssues = process.env.NODE_ENV === "production" ? productionReadinessIssues() : [];
  if (configurationIssues.length > 0) {
    return Response.json({ status: "configuration_unready", service: "ai-literacy-lms", issues: configurationIssues }, { status: 503, headers: { "cache-control": "no-store" } });
  }
  try {
    await db.$queryRaw`SELECT 1`;
    const healthCache = cache();
    await healthCache.set("health:app", "ok", 30);
    if (await healthCache.get("health:app") !== "ok") throw new Error("Cache write check failed");
    return Response.json({ status: "ok", service: "ai-literacy-lms", warnings: productionReadinessWarnings(), timestamp: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ status: "unavailable", service: "ai-literacy-lms" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
