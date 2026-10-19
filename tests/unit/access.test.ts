import { afterEach, describe, expect, it, vi } from "vitest";
import { accessDays, accessExpiryFrom, accessStatus, formatAccessDate, hasActiveAccess } from "@/lib/access";

const enrolledAt = new Date("2026-10-19T09:00:00.000Z");
const expiresAt = new Date("2027-01-17T09:00:00.000Z");
const paid = { enrolledAt, expiresAt, lifetimeAccess: false };

describe("course access", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("lasts 90 days by default and can be configured", () => {
    expect(accessDays()).toBe(90);
    expect(accessExpiryFrom(enrolledAt).toISOString()).toBe(expiresAt.toISOString());
    vi.stubEnv("ACCESS_DAYS", "30");
    expect(accessDays()).toBe(30);
    vi.stubEnv("ACCESS_DAYS", "not a number");
    expect(accessDays()).toBe(90);
  });

  it("is active before the end date", () => {
    expect(accessStatus(paid, new Date("2026-12-01T00:00:00Z"))).toEqual({ active: true, kind: "timed", endsAt: expiresAt });
    expect(hasActiveAccess(paid, new Date(expiresAt.getTime() - 1))).toBe(true);
  });

  it("ends exactly at the end date", () => {
    expect(hasActiveAccess(paid, expiresAt)).toBe(false);
    expect(accessStatus(paid, new Date("2027-02-01T00:00:00Z"))).toEqual({ active: false, kind: "expired", endsAt: expiresAt });
  });

  it("falls back to 90 days from enrolment when no end date is stored", () => {
    const legacy = { enrolledAt, expiresAt: null, lifetimeAccess: false };
    expect(hasActiveAccess(legacy, new Date(expiresAt.getTime() - 1))).toBe(true);
    expect(hasActiveAccess(legacy, expiresAt)).toBe(false);
  });

  it("never ends with lifetime access", () => {
    const lifetime = { ...paid, lifetimeAccess: true };
    expect(accessStatus(lifetime, new Date("2030-01-01T00:00:00Z"))).toEqual({ active: true, kind: "lifetime", endsAt: null });
  });

  it("never cuts off admins", () => {
    expect(accessStatus(paid, new Date("2030-01-01T00:00:00Z"), "ADMIN")).toEqual({ active: true, kind: "admin", endsAt: null });
    expect(hasActiveAccess(paid, new Date("2030-01-01T00:00:00Z"), "USER")).toBe(false);
  });

  it("formats dates in British style", () => {
    expect(formatAccessDate(expiresAt)).toBe("17 January 2027");
    expect(formatAccessDate(expiresAt, "Not/AZone")).toBe("17 January 2027");
  });
});
