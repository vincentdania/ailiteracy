import { createHash, randomBytes } from "node:crypto";

export function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function secureToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}
