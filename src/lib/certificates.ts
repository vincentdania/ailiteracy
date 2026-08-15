import { createHash } from "node:crypto";

export function certificateHash(userId: string, courseId: string, completedAt: Date, secret = process.env.AUTH_SECRET ?? "local") {
  return createHash("sha256").update(`${userId}:${courseId}:${completedAt.toISOString()}:${secret}`).digest("hex");
}
