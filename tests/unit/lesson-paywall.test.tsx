import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), lesson: vi.fn(), content: vi.fn(), enrollment: vi.fn() }));
vi.mock("@/lib/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/db", () => ({ db: { lesson: { findFirst: mocks.lesson, findUnique: mocks.content }, enrollment: { findUnique: mocks.enrollment } } }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`redirect:${url}`); }, notFound: () => { throw new Error("not found"); } }));
vi.mock("@/components/challenge/complete-button", () => ({ CompleteButton: () => null }));
const { default: LessonPage } = await import("@/app/(dashboard)/challenge/[course]/[slug]/page");

const lesson = { id: "lesson1", slug: "agent-foundations", dayNumber: 1, title: "Agent foundations", summary: null, contentMarkdown: "SECRET PAID CONTENT", module: { title: "Module 0", courseId: "course1", course: { slug: "small-business", title: "Small business" } } };

describe("server lesson paywall", () => {
  beforeEach(() => {
    mocks.auth.mockReset().mockResolvedValue({ user: { id: "user1" } });
    mocks.lesson.mockReset().mockResolvedValue(lesson);
    mocks.enrollment.mockReset().mockResolvedValue(null);
    mocks.content.mockReset().mockResolvedValue({ contentMarkdown: "SECRET PAID CONTENT" });
  });

  it("hides every lesson from someone without a purchase", async () => {
    const html = renderToStaticMarkup(await LessonPage({ params: Promise.resolve({ course: "small-business", slug: lesson.slug }) }));
    expect(html).toContain("Enrol to open this lesson");
    expect(html).not.toContain("SECRET PAID CONTENT");
    expect(mocks.content).not.toHaveBeenCalled();
  });

  it("hides content from an expired learner", async () => {
    mocks.enrollment.mockResolvedValue({ status: "ACTIVE", purchasedAt: new Date("2025-01-01T00:00:00Z"), expiresAt: new Date("2025-04-01T00:00:00Z"), completedDays: [] });
    const html = renderToStaticMarkup(await LessonPage({ params: Promise.resolve({ course: "small-business", slug: lesson.slug }) }));
    expect(html).not.toContain("SECRET PAID CONTENT");
    expect(mocks.content).not.toHaveBeenCalled();
    expect(html).toMatch(/renew|Renew/);
  });

  it("renders content only for a paid, unexpired enrollment", async () => {
    mocks.enrollment.mockResolvedValue({ status: "ACTIVE", purchasedAt: new Date("2026-10-01T00:00:00Z"), expiresAt: new Date("2099-01-01T00:00:00Z"), completedDays: [] });
    const html = renderToStaticMarkup(await LessonPage({ params: Promise.resolve({ course: "small-business", slug: lesson.slug }) }));
    expect(html).toContain("SECRET PAID CONTENT");
  });
});
