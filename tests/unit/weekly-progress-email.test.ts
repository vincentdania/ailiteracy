import { describe, expect, it } from "vitest";
// @ts-expect-error -- plain .mjs cron script (scripts/send-weekly-progress.mjs)
import { weeklyProgressEmail } from "../../scripts/send-weekly-progress.mjs";

const base = { name: "Ada", courseTitle: "AI at Work", total: 10, unlockedDay: 4, certificateHash: null };

describe("weekly progress email", () => {
  it("shows what is next while the course is in progress", () => {
    const { subject, text } = weeklyProgressEmail({ ...base, completed: 4 });
    expect(subject).toBe("Your weekly progress: 4 of 10 lessons complete");
    expect(text).toContain("Next up: Day 5");
    expect(text).toContain("Lessons remaining: 6");
  });

  it("congratulates finished learners and links their certificate instead of Next up", () => {
    const { subject, text } = weeklyProgressEmail({ ...base, completed: 10, unlockedDay: 10, certificateHash: "a".repeat(64) });
    expect(subject).toBe("You’ve finished AI at Work");
    expect(text).toContain("Congratulations.");
    expect(text).toContain(`/verify/${"a".repeat(64)}`);
    expect(text).not.toMatch(/Next up|Lessons remaining|Continue where you left off|streak/);
    expect(text).not.toContain("—");
  });

  it("falls back to the certificates page when no certificate record is found", () => {
    const { text } = weeklyProgressEmail({ ...base, completed: 10 });
    expect(text).toMatch(/\/certificates\n/);
    expect(text).not.toContain("Next up");
  });
});
