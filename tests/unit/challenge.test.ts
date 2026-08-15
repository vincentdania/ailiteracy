import { describe, expect, it } from "vitest";
import { canAccessLesson, localDateKey, nextStreak, unlockedDay } from "@/lib/challenge";

describe("challenge drip", () => {
  it("unlocks one day per learner-local calendar day", () => {
    const enrolled = new Date("2026-08-10T23:30:00Z");
    expect(unlockedDay(enrolled, new Date("2026-08-11T22:59:00Z"), "Africa/Lagos")).toBe(1);
    expect(unlockedDay(enrolled, new Date("2026-08-11T23:01:00Z"), "Africa/Lagos")).toBe(2);
  });

  it("caps at day 21 and supports the admin preview override", () => {
    expect(unlockedDay(new Date("2026-01-01"), new Date("2026-12-01"), "UTC")).toBe(21);
    expect(unlockedDay(new Date(), new Date(), "UTC", true)).toBe(21);
  });

  it("gates bonus lessons separately from the drip", () => {
    expect(canAccessLesson({ dayNumber: 2, isBonus: false, bonusUnlocked: false, unlockedDay: 1 })).toBe(false);
    expect(canAccessLesson({ dayNumber: 22, isBonus: true, bonusUnlocked: true, unlockedDay: 1 })).toBe(true);
  });
});

describe("streaks", () => {
  it("uses a freeze for a single missed day", () => {
    const result = nextStreak({ current: 5, longest: 7, lastActive: new Date("2026-08-10T10:00:00Z"), now: new Date("2026-08-12T10:00:00Z"), timezone: "UTC", freezeAvailable: true });
    expect(result).toEqual({ current: 6, longest: 7, freezeAvailable: false });
  });

  it("does not double-count same-day activity", () => {
    const lastActive = new Date("2026-08-15T00:10:00Z");
    expect(localDateKey(lastActive, "Africa/Lagos")).toBe("2026-08-15");
    expect(nextStreak({ current: 3, longest: 3, lastActive, now: new Date("2026-08-15T20:00:00Z"), timezone: "Africa/Lagos", freezeAvailable: true }).current).toBe(3);
  });
});
