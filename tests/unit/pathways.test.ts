import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import { PATHWAY_PASS_MARK, PATHWAYS } from "@/lib/pathways";
import { TRACKS } from "@/lib/tracks";

const ROOT = path.resolve(__dirname, "..", "..");

function lessonPath(pathway: string, slug: string) {
  return [pathway, "shared"].map((folder) => path.join(ROOT, "content", "lessons", folder, `${slug}.md`)).find(existsSync);
}

function brief(pathway: string, name: string) {
  return matter(readFileSync(path.join(ROOT, "content", "assignments", pathway, `${name}.md`), "utf8"));
}

describe("competence pathways", () => {
  it("defines four pathways whose slugs don't clash with the self-paced tracks", () => {
    expect(PATHWAYS).toHaveLength(4);
    const slugs = [...PATHWAYS.map((p) => p.slug), ...TRACKS.map((t) => t.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(PATHWAYS.map((p) => p.productCode)).size).toBe(4);
    expect(PATHWAY_PASS_MARK).toBe(80);
  });

  for (const pathway of PATHWAYS) {
    describe(pathway.title, () => {
      it("follows the handbook shape: five competencies, eight weeks, a rubric worth 100%", () => {
        expect(pathway.competencies).toHaveLength(5);
        expect(pathway.weeks.map((w) => w.week)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        expect(pathway.rubric.reduce((sum, d) => sum + d.weight, 0)).toBe(100);
        expect(pathway.modules).toHaveLength(9);
        expect(pathway.modules[8]?.title).toMatch(/Week 8 · Independent competence assessment/);
      });

      it("has a written lesson with a summary and a valid quiz for every lesson", () => {
        const slugs = pathway.modules.flatMap((m) => m.lessons.map((l) => l.slug));
        expect(new Set(slugs).size).toBe(slugs.length);
        for (const slug of slugs) {
          const file = lessonPath(pathway.slug, slug);
          expect(file, `${pathway.slug}/${slug}.md`).toBeDefined();
          const { data, content } = matter(readFileSync(file!, "utf8"));
          expect(typeof data.summary).toBe("string");
          expect(data.quiz).toHaveLength(3);
          for (const q of data.quiz as { options: string[]; answer: number }[]) expect(q.options[q.answer]).toBeDefined();
          expect(content).toMatch(/^## /m);
        }
      });

      it("has a baseline, eight weekly evidence briefs and a portfolio brief", () => {
        expect(brief(pathway.slug, "baseline").data).toMatchObject({ pathway: pathway.slug, week: 0 });
        for (const week of pathway.weeks) {
          const { data, content } = brief(pathway.slug, `week-${week.week}`);
          expect(data).toMatchObject({ pathway: pathway.slug, week: week.week, evidence: week.evidence });
          expect(content).toMatch(/### What to submit\n\n1\. \*\*/);
          for (const lesson of data.lessons as string[]) expect(lessonPath(pathway.slug, lesson), lesson).toBeDefined();
        }
        expect(brief(pathway.slug, "portfolio").data).toMatchObject({ pathway: pathway.slug, week: 8 });
      });

      it("keeps the assessor guide (with the unseen briefs) out of learner content", () => {
        expect(existsSync(path.join(ROOT, "docs", "pathways", `${pathway.slug}-assessor-guide.md`))).toBe(true);
        expect(existsSync(path.join(ROOT, "content", "lessons", pathway.slug, "assessor-guide.md"))).toBe(false);
      });
    });
  }
});
