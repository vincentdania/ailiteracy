import { createHash } from "node:crypto";

export function certificateHash(userId: string, courseId: string, completedAt: Date, secret = process.env.AUTH_SECRET) {
  if (!secret) throw new Error("Certificate signing is not configured");
  return createHash("sha256").update(`${userId}:${courseId}:${completedAt.toISOString()}:${secret}`).digest("hex");
}
