#!/usr/bin/env node
/**
 * Durable course-content validation.
 *
 * Single source of truth used by:
 *   - the CLI gate:  node scripts/validate-course-content.mjs   (npm run validate:content)
 *   - the unit test: tests/unit/course-content.test.ts
 *
 * Checks: frontmatter integrity, manifest <-> directories, quizzes, hero assets,
 * slug mappings, markdown rendering sanity, heading structure, and the honesty
 * rules (no unfulfilled instructor-recording promises, no income/employment
 * guarantees, no premature certificate claims).
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

export const COURSES = [
  { dir: "hermes_agent_course", heroPrefix: "hermes-", slugPrefix: "hermes-", expectedLessons: 22 },
  { dir: "track_a_course", heroPrefix: "tracka-", slugPrefix: "tracka-", expectedLessons: 10 },
];

export const MIN_CAPSTONE_SCORE = 70; // must match src/app/actions/submissions.ts

function list(md) {
  return md.match(/^\s*[-*]\s+/gm) ?? [];
}

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return null;
  const meta = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^(["'])(.*)\1$/, "$2").trim();
  }
  return { meta, body: raw.slice(match[0].length), bodyStart: match[0].length };
}

export function headingLevels(body) {
  let fenced = false;
  return body
    .split("\n")
    .filter((line) => {
      if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return false; }
      return !fenced;
    })
    .map((line) => line.match(/^(#{1,6})\s+\S/))
    .filter(Boolean)
    .map((m) => m[1].length);
}

const FORBIDDEN = [
  {
    id: "unfulfilled-recording-promise",
    re: /\b(watch the recording|screen recording|recorded (agent run|video|lesson)|in the video below)\b/i,
    why: "promises an instructor recording/video; no such asset ships with the course",
  },
  {
    id: "income-or-employment-guarantee",
    re: /\b(guaranteed? (income|job|employment|placement)|guarantee you (a job|an income)|earn (₦|\$|USD ?\d)|double your (income|salary))\b/i,
    why: "income/employment guarantee; the course makes no such promise",
  },
  {
    id: "premature-certificate",
    re: /\bget your (verified )?certificate\b/i,
    why: "certificate is issued only after all days are complete (final lesson only)",
  },
];

export function validateCourse(root, course) {
  const errors = [];
  const warnings = [];
  const dataDir = path.join(root, "data", course.dir);
  const manifestPath = path.join(dataDir, "manifest.json");

  if (!existsSync(manifestPath)) {
    errors.push(`${course.dir}: missing manifest.json`);
    return { errors, warnings, lessons: 0 };
  }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`${course.dir}/manifest.json: invalid JSON (${error.message})`);
    return { errors, warnings, lessons: 0 };
  }

  for (const key of ["slug", "title", "description", "priceNgn", "priceUsd"]) {
    if (manifest[key] === undefined || manifest[key] === "") errors.push(`${course.dir}/manifest.json: missing "${key}"`);
  }
  if (course.dir === "track_a_course" ? manifest.slug !== "ai-for-your-work" : !manifest.slug?.startsWith(course.slugPrefix)) {
    errors.push(`${course.dir}/manifest.json: slug "${manifest.slug}" does not use prefix "${course.slugPrefix}"`);
  }

  const listedDays = [];
  for (const mod of manifest.modules ?? []) {
    if (!Number.isInteger(mod.orderIndex)) errors.push(`${course.dir}/manifest.json: module "${mod.title}" has non-integer orderIndex`);
    if (!mod.title) errors.push(`${course.dir}/manifest.json: module at orderIndex ${mod.orderIndex} has no title`);
    for (const day of mod.lessons ?? []) listedDays.push(day);
  }
  const duplicates = listedDays.filter((d, i) => listedDays.indexOf(d) !== i);
  if (duplicates.length) errors.push(`${course.dir}/manifest.json: duplicate day numbers ${[...new Set(duplicates)].join(", ")}`);

  const dayDirs = readdirSync(dataDir)
    .filter((entry) => /^day\d{2}$/.test(entry) && statSync(path.join(dataDir, entry)).isDirectory())
    .sort();
  const dayNumbers = dayDirs.map((d) => Number(d.slice(3)));
  const orphanDirs = dayNumbers.filter((d) => !listedDays.includes(d));
  if (orphanDirs.length) errors.push(`${course.dir}: dir(s) not listed in any module: ${orphanDirs.join(", ")}`);

  if (course.expectedLessons && listedDays.length !== course.expectedLessons) {
    errors.push(`${course.dir}/manifest.json: lists ${listedDays.length} lessons, expected ${course.expectedLessons}`);
  }

  const titles = new Map();
  const slugs = new Map();
  let checked = 0;

  for (const day of listedDays) {
    const name = `day${String(day).padStart(2, "0")}`;
    const dir = path.join(dataDir, name);
    const lessonPath = path.join(dir, "lesson.md");
    const tag = `${course.dir}/${name}`;

    if (!existsSync(lessonPath)) {
      errors.push(`${tag}: missing lesson.md`);
      continue;
    }
    const raw = readFileSync(lessonPath, "utf8");
    const fm = parseFrontmatter(raw);
    if (!fm) {
      errors.push(`${tag}/lesson.md: missing YAML frontmatter block`);
      continue;
    }
    checked += 1;

    if (fm.meta.day !== undefined && Number(fm.meta.day) !== day) {
      errors.push(`${tag}/lesson.md: frontmatter day=${fm.meta.day} does not match directory ${name}`);
    }
    if (!fm.meta.title) errors.push(`${tag}/lesson.md: frontmatter "title" is empty`);
    if (!fm.meta.subtitle) errors.push(`${tag}/lesson.md: frontmatter "subtitle" is empty`);

    const slug = `${course.slugPrefix}${String(day).padStart(2, "0")}`;
    if (slugs.has(slug)) errors.push(`${tag}: slug "${slug}" collides with ${slugs.get(slug)}`);
    slugs.set(slug, tag);
    if (titles.has(fm.meta.title)) warnings.push(`${tag}/lesson.md: title duplicated with ${titles.get(fm.meta.title)}`);
    titles.set(fm.meta.title, tag);

    // hero asset
    const hero = path.join(root, "public", "lessons", `${course.heroPrefix}${name}_hero.png`);
    if (!existsSync(hero)) errors.push(`${tag}: hero image missing -> public/lessons/${course.heroPrefix}${name}_hero.png`);

    // markdown sanity + heading structure
    const levels = headingLevels(fm.body);
    if (levels.length && levels[0] !== 1) errors.push(`${tag}/lesson.md: first heading is H${levels[0]}, expected H1`);
    if (levels.filter((l) => l === 1).length > 1) errors.push(`${tag}/lesson.md: more than one H1 heading`);
    for (let i = 1; i < levels.length; i += 1) {
      if (levels[i] - levels[i - 1] > 1) errors.push(`${tag}/lesson.md: heading level jumps H${levels[i - 1]} -> H${levels[i]}`);
    }
    if (!/^#\s+\S/m.test(fm.body)) errors.push(`${tag}/lesson.md: body has no H1`);
    if ((fm.body.match(/\*\*/g) ?? []).length % 2 !== 0) errors.push(`${tag}/lesson.md: unbalanced ** bold markers`);
    if (/\{\{|\[\[|TODO:|Lorem ipsum/.test(fm.body)) errors.push(`${tag}/lesson.md: unrendered placeholder content`);
    if (/\]\(\s*\)/.test(fm.body)) errors.push(`${tag}/lesson.md: markdown link with empty target`);

    // honesty rules
    const isFinal = day === dayNumbers[dayNumbers.length - 1];
    for (const rule of FORBIDDEN) {
      if (!rule.re.test(fm.body)) continue;
      if (rule.id === "premature-certificate" && isFinal) continue;
      errors.push(`${tag}/lesson.md: ${rule.why}`);
    }

    // quizzes (optional per lesson, every present one must be valid)
    const quizPath = path.join(dir, "quiz.json");
    if (existsSync(quizPath)) {
      let quiz;
      try {
        quiz = JSON.parse(readFileSync(quizPath, "utf8"));
      } catch (error) {
        errors.push(`${tag}/quiz.json: invalid JSON (${error.message})`);
        continue;
      }
      if (!Array.isArray(quiz) || quiz.length === 0) {
        errors.push(`${tag}/quiz.json: must be a non-empty array of questions`);
        continue;
      }
      quiz.forEach((q, i) => {
        const where = `${tag}/quiz.json[${i}]`;
        if (!q?.q) errors.push(`${where}: missing "q"`);
        if (!Array.isArray(q?.options) || q.options.length !== 4) errors.push(`${where}: expected exactly 4 options`);
        if (!Number.isInteger(q?.answer) || q.answer < 0 || q.answer >= (q?.options?.length ?? 0)) errors.push(`${where}: "answer" index out of range`);
        if (!q?.explanation) errors.push(`${where}: missing "explanation"`);
        if (q?.options?.some((o) => typeof o !== "string" || !o.trim())) errors.push(`${where}: empty option text`);
      });
    }

    // capstone lesson must be detectable by isCapstoneLesson()/the certificate gate
    if (/(?:^|\()\s*capstone\b/i.test(fm.meta.title ?? "")) {
      if (!fm.body.includes(String(MIN_CAPSTONE_SCORE))) {
        errors.push(`${tag}/lesson.md: capstone lesson must state the ${MIN_CAPSTONE_SCORE}-point submission gate`);
      }
    }
  }

  return { errors, warnings, lessons: checked };
}

export function validateAll(root = process.cwd()) {
  const errors = [];
  const warnings = [];
  let total = 0;
  for (const course of COURSES) {
    const result = validateCourse(root, course);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    total += result.lessons;
  }
  // copy that must stay consistent with the capstone gate
  const gate = path.join(root, "src", "app", "actions", "submissions.ts");
  if (existsSync(gate) && !readFileSync(gate, "utf8").includes(String(MIN_CAPSTONE_SCORE))) {
    errors.push(`src/app/actions/submissions.ts: capstone pass threshold does not reference ${MIN_CAPSTONE_SCORE}`);
  }
  return { errors, warnings, lessons: total };
}

const invokedDirectly = process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`;
if (invokedDirectly) {
  const { errors, warnings, lessons } = validateAll();
  for (const warning of warnings) console.warn(`warn: ${warning}`);
  for (const error of errors) console.error(`error: ${error}`);
  console.log(`validated ${lessons} lessons across ${COURSES.length} courses: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}
