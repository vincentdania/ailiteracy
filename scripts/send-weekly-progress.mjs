#!/usr/bin/env node
/**
 * Weekly progress summary email for active Hyrax AI Academy learners.
 * Run inside the app container: node scripts/send-weekly-progress.mjs
 * Scheduled weekly (e.g. Mon 08:00 server time) via cron.
 * Uses the container's DATABASE_URL + RESEND_API_KEY env vars.
 */
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire("/app/package.json");
const COURSE_URL = process.env.NEXTAUTH_URL ?? "https://learn.hyrax.ng";
const FROM = process.env.EMAIL_FROM ?? "Hyrax AI Academy <noreply@updates.hyrax.ng>";
const REPLY_TO = process.env.SUPPORT_EMAIL ?? "team@hyrax.ng";

// Mirrors hasActiveAccess in src/lib/access.ts (this plain script cannot import TypeScript):
// admins and lifetime learners always have access, everyone else until expiresAt.
const DAY_MS = 24 * 60 * 60 * 1000;
const ACCESS_DAYS = Number.isInteger(Number(process.env.ACCESS_DAYS)) && Number(process.env.ACCESS_DAYS) > 0 ? Number(process.env.ACCESS_DAYS) : 90;
function hasActiveAccess(enrollment, now) {
  if (enrollment.user.role === "ADMIN" || enrollment.lifetimeAccess) return true;
  const endsAt = enrollment.expiresAt ?? new Date(enrollment.enrolledAt.getTime() + ACCESS_DAYS * DAY_MS);
  return now.getTime() < endsAt.getTime();
}

function mockOrSend(message) {
  if (process.env.INTEGRATION_MODE === "mock" || !process.env.RESEND_API_KEY) {
    console.info(`[email:mock] to=${message.to} subject=${message.subject}`);
    return Promise.resolve({ id: `mock-${Date.now()}` });
  }
  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({ from: FROM, replyTo: REPLY_TO, ...message }).then((r) => {
    if (r.error) throw new Error(r.error.message);
    return r.data;
  });
}

/**
 * Subject and body for one learner. Learners who have finished the course get a
 * completion message with their certificate link instead of "Next up".
 */
export function weeklyProgressEmail({ name, courseTitle, completed, total, unlockedDay, certificateHash }) {
  const finished = completed >= total;
  const nextDay = Math.min(unlockedDay + 1, total);
  const remaining = Math.max(total - completed, 0);
  const pct = Math.min(Math.round((completed / total) * 100), 100);
  const progressBar = "▓".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));
  const subject = completed === 0
    ? `Day 1 of ${courseTitle} is ready for you`
    : finished
      ? `You’ve finished ${courseTitle}`
      : `Your weekly progress: ${completed} of ${total} lessons complete`;

  if (finished) {
    const certificateUrl = certificateHash ? `${COURSE_URL}/verify/${certificateHash}` : `${COURSE_URL}/certificates`;
    const text = `Hi ${name},

Congratulations. You have completed all ${total} lessons of ${courseTitle}.

Progress: ${progressBar} ${pct}%

Your certificate is ready. View, download or share it here:
${certificateUrl}

You can come back to any lesson to replay missions or retake a knowledge check.

The Hyrax AI Academy team`;
    return { subject, text };
  }

  const text = `Hi ${name},

${completed === 0
  ? `Welcome to ${courseTitle}. Your first lesson is waiting.`
  : `You have completed ${completed} of ${total} lessons.`}

Progress: ${progressBar} ${pct}%

Next up: Day ${nextDay}
Lessons remaining: ${remaining}

Continue where you left off:
${COURSE_URL}/challenge

One lesson a day is enough to finish the course in ${total} days.

The Hyrax AI Academy team`;
  return { subject, text };
}

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const db = new PrismaClient();
  try {
    await sendAll(db);
  } finally {
    await db.$disconnect();
  }
}

async function sendAll(db) {
  const now = new Date();
  const candidates = await db.enrollment.findMany({
    where: { status: "ACTIVE" },
    include: { user: { select: { email: true, name: true, role: true } }, course: { select: { title: true, modules: { select: { _count: { select: { lessons: { where: { isBonus: false } } } } } } } } },
  });
  // No progress emails once a learner's access has ended.
  const enrollments = candidates.filter((enrollment) => hasActiveAccess(enrollment, now));

  let sent = 0;
  let skipped = 0;
  for (const enrollment of enrollments) {
    const email = enrollment.user.email;
    if (!email) { skipped++; continue; }
    const completed = enrollment.completedDays.length;
    const total = enrollment.course.modules.reduce((sum, m) => sum + m._count.lessons, 0) || 1;
    const certificate = completed >= total
      ? await db.certificate.findUnique({ where: { userId_courseId: { userId: enrollment.userId, courseId: enrollment.courseId } }, select: { uniqueHash: true } })
      : null;
    const { subject, text } = weeklyProgressEmail({
      name: enrollment.user.name?.split(" ")[0] ?? "there",
      courseTitle: enrollment.course.title,
      completed,
      total,
      unlockedDay: enrollment.unlockedDay,
      certificateHash: certificate?.uniqueHash ?? null,
    });

    try {
      await mockOrSend({ to: email, subject, text });
      sent++;
    } catch (error) {
      console.error(`Failed to send to ${email}: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(`Weekly progress email: ${sent} sent, ${skipped} skipped (no email), ${enrollments.length} active enrollments (${candidates.length - enrollments.length} with ended access not emailed)`);
}

const invokedDirectly = process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`;
if (invokedDirectly) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
