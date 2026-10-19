import { readFileSync } from "node:fs";
import path from "node:path";

export type OutlineModule = { title: string; lessons: { day: number; title: string }[] };

const COURSE_DIR = path.join(process.cwd(), "data", "track_a_course");

let cached: OutlineModule[] | null = null;

function lessonTitle(day: number) {
  const raw = readFileSync(path.join(COURSE_DIR, `day${String(day).padStart(2, "0")}`, "lesson.md"), "utf8");
  const title = raw.match(/^---\s*\n[\s\S]*?^title:\s*(.+)$/m)?.[1]?.trim().replace(/^(["'])(.*)\1$/, "$2");
  return title ?? `Day ${day}`;
}

// The public course outline, read from the same manifest and lesson files the seed uses,
// so the homepage always matches the course learners get.
export function getCourseOutline(): OutlineModule[] {
  if (cached) return cached;
  const manifest = JSON.parse(readFileSync(path.join(COURSE_DIR, "manifest.json"), "utf8")) as { modules: { orderIndex: number; title: string; lessons: number[] }[] };
  cached = [...manifest.modules]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((courseModule) => ({ title: courseModule.title, lessons: courseModule.lessons.map((day) => ({ day, title: lessonTitle(day) })) }));
  return cached;
}
