import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
const findUser = vi.fn();
const sendEmail = vi.fn();
const enforceRateLimit = vi.fn();
const transaction = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: () => auth(), signIn: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendEmail: (...args: unknown[]) => sendEmail(...args) }));
vi.mock("@/lib/redis", () => ({ enforceRateLimit: (...args: unknown[]) => enforceRateLimit(...args) }));
vi.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: (...args: unknown[]) => findUser(...args) },
    emailVerificationToken: { updateMany: vi.fn(() => "invalidate"), create: vi.fn((args: unknown) => args) },
    $transaction: (...args: unknown[]) => transaction(...args),
  },
}));

const { resendVerificationAction } = await import("@/app/actions/auth");
const form = (email?: string) => { const data = new FormData(); if (email) data.set("email", email); return data; };
const initial = { ok: false, message: "" };

describe("resend verification link", () => {
  beforeEach(() => {
    for (const mock of [auth, findUser, sendEmail, enforceRateLimit, transaction]) mock.mockReset();
    auth.mockResolvedValue(null);
    enforceRateLimit.mockResolvedValue({ allowed: true, remaining: 2 });
  });

  it("sends a fresh link to an unverified account", async () => {
    findUser.mockResolvedValue({ id: "u1", email: "ada@example.com", emailVerified: null });
    const result = await resendVerificationAction(initial, form("Ada@Example.com"));
    expect(result.ok).toBe(true);
    expect(enforceRateLimit).toHaveBeenCalledWith("verify-resend:ada@example.com", 3, 3600);
    expect(transaction).toHaveBeenCalledOnce();
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "ada@example.com", text: expect.stringContaining("/verify-email?token=") }));
  });

  it("gives the same answer whether or not the address has an account", async () => {
    findUser.mockResolvedValue({ id: "u1", email: "ada@example.com", emailVerified: null });
    const known = await resendVerificationAction(initial, form("ada@example.com"));
    findUser.mockResolvedValue(null);
    const unknown = await resendVerificationAction(initial, form("nobody@example.com"));
    findUser.mockResolvedValue({ id: "u2", email: "done@example.com", emailVerified: new Date() });
    const verified = await resendVerificationAction(initial, form("done@example.com"));
    expect(unknown).toEqual(known);
    expect(verified).toEqual(known);
    expect(sendEmail).toHaveBeenCalledOnce();
  });

  it("uses the signed-in learner's own address", async () => {
    auth.mockResolvedValue({ user: { id: "u1", email: "ada@example.com" } });
    findUser.mockResolvedValue({ id: "u1", email: "ada@example.com", emailVerified: null });
    await resendVerificationAction(initial, form("someone-else@example.com"));
    expect(findUser).toHaveBeenCalledWith(expect.objectContaining({ where: { email: "ada@example.com" } }));
  });

  it("stops when the rate limit is reached", async () => {
    enforceRateLimit.mockResolvedValue({ allowed: false, remaining: 0 });
    const result = await resendVerificationAction(initial, form("ada@example.com"));
    expect(result.ok).toBe(false);
    expect(findUser).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("asks for a valid email when signed out", async () => {
    expect(await resendVerificationAction(initial, form())).toMatchObject({ ok: false, message: "Enter a valid email address." });
  });
});
