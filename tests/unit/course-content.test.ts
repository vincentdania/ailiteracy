import { describe, expect, it } from "vitest";
import path from "node:path";
// @ts-expect-error -- plain .mjs validator shared with the CLI gate (npm run validate:content)
import { COURSES, validateAll, validateCourse } from "../../scripts/validate-course-content.mjs";

const root = path.resolve(__dirname, "../..");

describe("course content integrity", () => {
  const result = validateAll(root);

  it("reports no content errors across all seeded courses", () => {
    expect(result.errors).toEqual([]);
  });

  it("validates every lesson of every course", () => {
    for (const course of COURSES) {
      const single = validateCourse(root, course);
      expect(single.errors, `${course.dir} errors`).toEqual([]);
      expect(single.lessons).toBe(course.expectedLessons);
    }
  });

  it("keeps the capstone gate realistic and reachable", () => {
    const trackA = validateCourse(root, COURSES.find((c: { dir: string }) => c.dir === "track_a_course"));
    expect(trackA.errors).toEqual([]);
  });
});
