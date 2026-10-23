import { describe, expect, it } from "vitest";
import { ACCESS_MONTHS, accessExpiryFrom, accessStatus, daysRemaining, hasActiveAccess } from "@/lib/access";

const purchasedAt = new Date("2026-10-22T12:30:00.000Z");
const expiresAt = new Date("2027-01-22T12:30:00.000Z");
const paid = { purchasedAt, expiresAt, status: "ACTIVE" };

describe("three-calendar-month enrollment", () => {
  it("has one configurable duration and preserves the purchase time", () => {
    expect(ACCESS_MONTHS).toBe(3);
    expect(accessExpiryFrom(purchasedAt)).toEqual(expiresAt);
    expect(accessExpiryFrom(new Date("2026-11-30T10:00:00Z"))).toEqual(new Date("2027-02-28T10:00:00Z"));
    expect(accessExpiryFrom(new Date("2023-11-30T10:00:00Z"))).toEqual(new Date("2024-02-29T10:00:00Z"));
  });

  it("locks exactly at expiry, including an admin or old lifetime flag", () => {
    expect(hasActiveAccess(paid, new Date(expiresAt.getTime() - 1))).toBe(true);
    expect(hasActiveAccess(paid, expiresAt)).toBe(false);
    expect(accessStatus(paid, expiresAt)).toMatchObject({ active: false, kind: "expired" });
    expect(hasActiveAccess({ ...paid, status: "REFUNDED" }, purchasedAt)).toBe(false);
    expect(hasActiveAccess({ ...paid, expiresAt: null }, new Date("2027-01-23T12:30:00Z"))).toBe(false);
    expect(daysRemaining(expiresAt, new Date("2027-01-22T00:00:00Z"))).toBe(1);
  });
});
