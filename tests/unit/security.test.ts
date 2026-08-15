import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { certificateHash } from "@/lib/certificates";
import { verifyPaystackSignature } from "@/lib/payments/signatures";

describe("webhook signatures", () => {
  it("accepts only the correct Paystack HMAC", () => {
    const payload = JSON.stringify({ event: "charge.success", data: { reference: "ref-1" } });
    const signature = createHmac("sha512", "secret").update(payload).digest("hex");
    expect(verifyPaystackSignature(payload, signature, "secret")).toBe(true);
    expect(verifyPaystackSignature(payload, `${signature.slice(0, -1)}0`, "secret")).toBe(false);
  });
});

describe("certificate signatures", () => {
  it("is deterministic and changes with credential data", () => {
    const issued = new Date("2026-08-15T10:00:00Z");
    const hash = certificateHash("user-1", "course-1", issued, "signing-secret");
    expect(hash).toHaveLength(64);
    expect(certificateHash("user-1", "course-1", issued, "signing-secret")).toBe(hash);
    expect(certificateHash("user-2", "course-1", issued, "signing-secret")).not.toBe(hash);
  });
});
