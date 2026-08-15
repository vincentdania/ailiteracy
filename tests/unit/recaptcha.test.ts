import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

const originalSecret = process.env.RECAPTCHA_SECRET_KEY;
const originalUrl = process.env.NEXTAUTH_URL;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalSecret === undefined) delete process.env.RECAPTCHA_SECRET_KEY;
  else process.env.RECAPTCHA_SECRET_KEY = originalSecret;
  if (originalUrl === undefined) delete process.env.NEXTAUTH_URL;
  else process.env.NEXTAUTH_URL = originalUrl;
});

describe("reCAPTCHA verification", () => {
  it("is disabled when no secret is configured", async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    expect(await verifyRecaptchaToken("")).toBe(true);
  });

  it("accepts a successful token only for the configured host", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    process.env.NEXTAUTH_URL = "https://ailiteracy.ng";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "ailiteracy.ng" }), { status: 200 })));
    expect(await verifyRecaptchaToken("valid-token")).toBe(true);
    expect(fetch).toHaveBeenCalledWith("https://www.google.com/recaptcha/api/siteverify", expect.objectContaining({ method: "POST" }));
  });

  it("rejects missing or wrong-host tokens", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    process.env.NEXTAUTH_URL = "https://ailiteracy.ng";
    expect(await verifyRecaptchaToken("")).toBe(false);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "example.com" }), { status: 200 })));
    expect(await verifyRecaptchaToken("wrong-host-token")).toBe(false);
  });
});
