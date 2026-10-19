import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { activitiesProblems, gradeMission, optionId, parseActivities, quizPassed, quizPassMark, toPublicMission, type Mission } from "@/lib/learning/activities";
import { lessonBlockers, lessonReadyToComplete, moduleEligible, moduleRequirements, nextActivity, type LessonMastery } from "@/lib/learning/mastery";
import { BADGES, earnedBadgeKeys, levelFor, missionXp, XP, type BadgeStats } from "@/lib/learning/rewards";
import { isCredentialId, linkedInAddToProfileUrl, newCredentialId, shareLinks } from "@/lib/certificates";
import { splitLesson } from "@/lib/learning/lesson-sections";
import { qrMatrix } from "@/lib/qr";

const root = path.resolve(__dirname, "../..");
const day = (n: number, file: string) => readFileSync(path.join(root, "data", "track_a_course", `day${String(n).padStart(2, "0")}`, file), "utf8");

describe("course missions content", () => {
  it("every AI for Your Work lesson has valid objectives, missions and an advanced mission", () => {
    for (let n = 1; n <= 10; n++) {
      const raw = JSON.parse(day(n, "activities.json"));
      expect(activitiesProblems(raw), `day ${n}`).toEqual([]);
      const activities = parseActivities(raw)!;
      expect(activities.missions.length).toBeGreaterThanOrEqual(2);
      expect(activities.advanced).toBeDefined();
    }
  });

  it("uses more than multiple choice across the course", () => {
    const types = new Set<string>();
    for (let n = 1; n <= 10; n++) for (const m of parseActivities(JSON.parse(day(n, "activities.json")))!.missions) types.add(m.type);
    expect([...types].sort()).toEqual(["choice", "multi", "order", "sort"]);
  });

  it("keeps the mission the Fact Checker badge depends on", () => {
    const keys = parseActivities(JSON.parse(day(2, "activities.json")))!.missions.map((m) => m.key);
    expect(keys).toContain("verify");
  });

  it("rejects malformed activities", () => {
    expect(activitiesProblems({})).not.toEqual([]);
    expect(activitiesProblems({ objectives: {}, discover: {}, keyIdeas: [], device: "tablet", missions: [] }).length).toBeGreaterThan(3);
  });
});

const choice: Mission = { key: "m1", type: "choice", title: "T", prompt: "P", hint: "H", support: "S", explain: "E", options: [{ text: "a", feedback: "fa" }, { text: "b", feedback: "fb" }, { text: "c", feedback: "fc" }], correct: 1 };
const order: Mission = { key: "m2", type: "order", title: "T", prompt: "P", hint: "H", support: "S", explain: "E", items: ["one", "two", "three", "four"] };
const sort: Mission = { key: "m3", type: "sort", title: "T", prompt: "P", hint: "H", support: "S", explain: "E", categories: ["X", "Y"], items: [{ text: "x1", category: 0, feedback: "is X" }, { text: "y1", category: 1, feedback: "is Y" }, { text: "x2", category: 0, feedback: "is X" }] };
const multi: Mission = { key: "m4", type: "multi", title: "T", prompt: "P", hint: "H", support: "S", explain: "E", options: [{ text: "a", feedback: "fa" }, { text: "b", feedback: "fb" }, { text: "c", feedback: "fc" }], correct: [0, 2] };
const id = (m: Mission, i: number) => optionId("lesson1", m.key, i);

describe("mission grading", () => {
  it("never sends answers, feedback or hints to the browser", () => {
    for (const mission of [choice, order, sort, multi]) {
      const json = JSON.stringify(toPublicMission("lesson1", mission));
      for (const secret of ["correct", "feedback", "hint", "support", "explain", "category\""]) expect(json).not.toContain(secret);
    }
  });

  it("shuffles ordering tasks so the authored order is not given away", () => {
    const pub = toPublicMission("lesson1", order);
    if (pub.type !== "order") throw new Error("expected order");
    expect(pub.items.map((i) => i.text)).not.toEqual(["one", "two", "three", "four"]);
    expect(pub.items.map((i) => i.text).sort()).toEqual(["four", "one", "three", "two"]);
  });

  it("grades a choice and escalates help: hint, then simpler explanation, then the answer", () => {
    expect(gradeMission("lesson1", choice, id(choice, 1), 1)).toMatchObject({ correct: true, explain: "E" });
    const first = gradeMission("lesson1", choice, id(choice, 0), 1);
    expect(first).toMatchObject({ correct: false, hint: "H", feedback: ["fa"] });
    expect(first.support).toBeUndefined();
    expect(first.explain).toBeUndefined();
    expect(gradeMission("lesson1", choice, id(choice, 0), 2).support).toBe("S");
    expect(gradeMission("lesson1", choice, id(choice, 2), 3).reveal).toEqual(["b"]);
  });

  it("grades multi-select exactly and explains only the mistakes", () => {
    expect(gradeMission("lesson1", multi, [id(multi, 0), id(multi, 2)], 1).correct).toBe(true);
    const partial = gradeMission("lesson1", multi, [id(multi, 0)], 1);
    expect(partial.correct).toBe(false);
    expect(partial.feedback).toEqual(["fc"]);
    expect(gradeMission("lesson1", multi, [id(multi, 0), id(multi, 1), id(multi, 2)], 1).feedback).toEqual(["fb"]);
  });

  it("grades ordering and sorting", () => {
    expect(gradeMission("lesson1", order, [0, 1, 2, 3].map((i) => id(order, i)), 1).correct).toBe(true);
    const wrong = gradeMission("lesson1", order, [1, 0, 2, 3].map((i) => id(order, i)), 1);
    expect(wrong.correct).toBe(false);
    expect(wrong.feedback[0]).toContain("2 of 4");
    expect(gradeMission("lesson1", sort, { [id(sort, 0)]: 0, [id(sort, 1)]: 1, [id(sort, 2)]: 0 }, 1).correct).toBe(true);
    expect(gradeMission("lesson1", sort, { [id(sort, 0)]: 0, [id(sort, 1)]: 0, [id(sort, 2)]: 0 }, 1).feedback).toEqual(["“y1”: is Y"]);
  });

  it("treats garbage answers as wrong rather than crashing", () => {
    expect(gradeMission("lesson1", choice, "nope", 1).correct).toBe(false);
    expect(gradeMission("lesson1", order, "nope", 1).correct).toBe(false);
    expect(gradeMission("lesson1", sort, ["x"], 1).correct).toBe(false);
  });
});

describe("knowledge check mastery", () => {
  it("needs 75% or better", () => {
    expect(quizPassMark(4)).toBe(3);
    expect(quizPassMark(5)).toBe(4);
    expect(quizPassed(3, 4)).toBe(true);
    expect(quizPassed(3, 5)).toBe(false);
    expect(quizPassed(0, 0)).toBe(false);
  });
});

describe("XP and levels", () => {
  it("rewards first-try missions most and never goes below the floor", () => {
    expect(missionXp(1, false)).toBe(XP.missionFirstTry);
    expect(missionXp(2, false)).toBe(XP.missionSecondTry);
    expect(missionXp(9, false)).toBe(XP.missionLater);
    expect(missionXp(1, true)).toBe(XP.advancedMission);
  });

  it("maps XP to levels with progress to the next one", () => {
    expect(levelFor(0)).toMatchObject({ level: 1, title: "Curious", nextLevelXp: 150, progress: 0 });
    expect(levelFor(150)).toMatchObject({ level: 2, title: "Explorer" });
    expect(levelFor(275).progress).toBe(50);
    expect(levelFor(99_999)).toMatchObject({ level: 8, nextLevelXp: null, progress: 100, toNext: 0 });
  });
});

function lesson(overrides: Partial<LessonMastery> = {}): LessonMastery {
  return { id: "l", slug: "tracka-01", dayNumber: 1, title: "L", summary: null, isBonus: false, isCapstone: false, unlocked: true, completed: true, quiz: { total: 4, best: 4, passed: true, attempts: 1 }, missions: [{ key: "a", title: "A", solved: true, attempts: 1 }], advanced: null, practical: { score: 80, passed: true }, ...overrides };
}

describe("module certificate eligibility", () => {
  it("is earned only when every requirement is met", () => {
    expect(moduleEligible([lesson(), lesson({ id: "l2", practical: { score: null, passed: false } })])).toBe(true);
  });

  it("is withheld when a lesson, check, mission or practical is missing", () => {
    expect(moduleEligible([lesson({ completed: false })])).toBe(false);
    expect(moduleEligible([lesson({ quiz: { total: 4, best: 2, passed: false, attempts: 3 } })])).toBe(false);
    expect(moduleEligible([lesson({ missions: [{ key: "a", title: "A", solved: false, attempts: 2 }] })])).toBe(false);
    expect(moduleEligible([lesson({ practical: { score: 60, passed: false } })])).toBe(false);
    expect(moduleEligible([])).toBe(false);
  });

  it("explains what is left", () => {
    const requirements = moduleRequirements([lesson(), lesson({ id: "l2", completed: false, missions: [{ key: "a", title: "A", solved: false, attempts: 0 }] })]);
    expect(requirements.find((r) => r.key === "lessons")).toMatchObject({ done: 1, total: 2, met: false });
    expect(requirements.find((r) => r.key === "missions")).toMatchObject({ done: 1, total: 2, met: false });
  });

  it("blocks lesson completion until missions and the check are mastered", () => {
    const open = lesson({ completed: false, quiz: { total: 4, best: 1, passed: false, attempts: 1 }, missions: [{ key: "a", title: "A", solved: false, attempts: 0 }] });
    expect(lessonReadyToComplete(open)).toBe(false);
    expect(lessonBlockers(open)).toHaveLength(2);
    expect(lessonReadyToComplete(lesson({ quiz: null, missions: [] }))).toBe(true);
  });

  it("blocks a capstone until its submission scores 70 or more, matching completeLessonAction", () => {
    for (const practical of [{ score: null, passed: false }, { score: 0, passed: false }, { score: 69, passed: false }]) {
      const capstone = lesson({ isCapstone: true, completed: false, practical });
      expect(lessonReadyToComplete(capstone)).toBe(false);
      expect(lessonBlockers(capstone)).toEqual(["Submit your capstone and score 70 or more"]);
    }
    expect(lessonReadyToComplete(lesson({ isCapstone: true, completed: false, practical: { score: 70, passed: true } }))).toBe(true);
    // An ordinary lesson's practical stays optional.
    expect(lessonReadyToComplete(lesson({ completed: false, practical: { score: null, passed: false } }))).toBe(true);
  });

  it("points the learner at the most useful next step", () => {
    const modules = [{ title: "M1", lessons: [lesson(), lesson({ id: "l2", dayNumber: 2, completed: false })] }];
    expect(nextActivity(modules)).toMatchObject({ reason: "resume", lesson: { id: "l2" } });
    const missionLeft = [{ title: "M1", lessons: [lesson({ missions: [{ key: "a", title: "New one", solved: false, attempts: 0 }] })] }];
    expect(nextActivity(missionLeft)).toMatchObject({ reason: "mission" });
  });
});

describe("badges", () => {
  const empty: BadgeStats = { lessonsCompleted: 0, missionsSolved: 0, missionsSolvedAfterRetry: 0, advancedSolved: 0, perfectChecks: 0, practicalsPassed: 0, modulesMastered: 0, coursesCompleted: 0, solvedMissionRefs: [], masteredModuleRefs: [] };

  it("has unique keys and an earning rule for each", () => {
    expect(new Set(BADGES.map((b) => b.key)).size).toBe(BADGES.length);
  });

  it("awards nothing for nothing, and course badges only in that course", () => {
    expect(earnedBadgeKeys(empty, ["ai-for-your-work"])).toEqual([]);
    const stats = { ...empty, missionsSolved: 1, missionsSolvedAfterRetry: 1, solvedMissionRefs: ["tracka-02:verify"], modulesMastered: 1, masteredModuleRefs: ["ai-for-your-work:1"] };
    expect(earnedBadgeKeys(stats, ["ai-for-your-work"])).toEqual(expect.arrayContaining(["first-mission", "comeback", "fact-checker", "module-master", "ai-foundations"]));
    expect(earnedBadgeKeys(stats, ["hermes-agent-masterclass"])).not.toContain("fact-checker");
  });
});

describe("certificates", () => {
  it("issues readable, unguessable credential ids", () => {
    const ids = new Set(Array.from({ length: 2000 }, newCredentialId));
    expect(ids.size).toBe(2000);
    for (const value of [...ids].slice(0, 50)) expect(isCredentialId(value)).toBe(true);
    expect(isCredentialId("HYX-OOOO-IIII-LLLL")).toBe(false);
    expect(isCredentialId("../etc/passwd")).toBe(false);
  });

  it("builds LinkedIn's add-to-profile link with the credential fields", () => {
    const url = new URL(linkedInAddToProfileUrl({ name: "Week One: AI on Your Job", issuedAt: new Date("2026-10-19T10:00:00Z"), credentialId: "HYX-AAAA-BBBB-CCCC", url: "https://learn.hyrax.ng/verify/HYX-AAAA-BBBB-CCCC" }));
    expect(url.origin + url.pathname).toBe("https://www.linkedin.com/profile/add");
    expect(Object.fromEntries(url.searchParams)).toMatchObject({ startTask: "CERTIFICATION_NAME", organizationName: "Hyrax", issueYear: "2026", issueMonth: "10", certId: "HYX-AAAA-BBBB-CCCC", certUrl: "https://learn.hyrax.ng/verify/HYX-AAAA-BBBB-CCCC" });
  });

  it("uses each platform's documented share URL", () => {
    const links = shareLinks("https://learn.hyrax.ng/verify/X", "I did it");
    expect(links.linkedin).toBe("https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Flearn.hyrax.ng%2Fverify%2FX");
    expect(links.facebook).toContain("facebook.com/sharer/sharer.php?u=");
    expect(links.whatsapp).toBe("https://wa.me/?text=I%20did%20it%20https%3A%2F%2Flearn.hyrax.ng%2Fverify%2FX");
  });

  it("encodes the verification URL in a QR code", () => {
    const { size } = qrMatrix("https://learn.hyrax.ng/verify/HYX-AAAA-BBBB-CCCC");
    expect(size).toBeGreaterThanOrEqual(21);
  });
});

describe("lesson reader", () => {
  it("splits a lesson into beats and lifts out the task and output", () => {
    const raw = day(1, "lesson.md").replace(/^---[\s\S]*?---\s*/, "");
    const { beats, task, output, footnote } = splitLesson(raw);
    expect(beats.length).toBeGreaterThanOrEqual(5);
    expect(beats.map((b) => b.title)).not.toContain("🎯 Task");
    expect(task).toContain("Open ChatGPT or Gemini");
    expect(output).toContain("One finished report");
    expect(footnote).toContain("Privacy note");
  });

  it("ignores headings inside code blocks", () => {
    const { beats } = splitLesson("## One\n\n```\n## not a heading\n```\n\n## Two\ntext");
    expect(beats.map((b) => b.title)).toEqual(["One", "Two"]);
  });
});
