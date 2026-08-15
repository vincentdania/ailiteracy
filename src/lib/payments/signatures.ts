import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyPaystackSignature(payload: string, signature: string | null, secret: string) {
  if (!signature || !secret) return false;
  const expected = createHmac("sha512", secret).update(payload).digest("hex");
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function mockPaymentSignature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}
