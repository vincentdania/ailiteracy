#!/usr/bin/env node
/**
 * Weekly progress summary email for active Hyrax AI Academy learners.
 * Run inside the app container: node scripts/send-weekly-progress.mjs
 * Scheduled weekly (e.g. Mon 08:00 server time) via cron.
 * Uses the container's DATABASE_URL + RESEND_API_KEY env vars.
 */
import { createRequire } from "node:module";
const require = createRequire("/app/package.json");
const { PrismaClient } = require("@prisma/client");
const { Resend } = require("resend");

const db = new PrismaClient();
const COURSE_URL = process.env.NEXTAUTH_URL ?? "https://learn.hyrax.ng";
const FROM = process.env.EMAIL_FROM ?? "Hyrax AI Academy <noreply@ailiteracy.ng>";

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
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({ from: FROM, ...message }).then((r) => {
    if (r.error) throw new Error(r.error.message);
    return r.data;
  });
}

async function main() {
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
    const nextDay = Math.min(enrollment.unlockedDay + 1, total);
    const remaining = Math.max(total - completed, 0);
    const pct = Math.round((completed / total) * 100);
    const name = enrollment.user.name?.split(" ")[0] ?? "there";

    const progressBar = "▓".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));
    const subject = completed === 0
      ? "Your Hyrax AI Academy journey starts with Day 1"
      : completed >= total
        ? `You finished ${enrollment.course.title} 🎉`
        : `Your Hyrax AI Academy progress: ${completed}/${total} lessons complete`;

    const text = `Hi ${name},

${completed === 0
  ? `Welcome to ${enrollment.course.title}. Your first lesson is waiting.`
  : completed >= total
    ? `Congratulations — you have completed all ${total} lessons. Your certificate is ready in your dashboard.`
    : `You have completed ${completed} of ${total} lessons.`}

Progress: ${progressBar} ${pct}%

Next up: Day ${nextDay}
Lessons remaining: ${remaining}

Continue where you left off:
${COURSE_URL}/challenge

Keep the streak alive — one focused lesson a day is enough.

— The Hyrax AI Academy team`;

    try {
      await mockOrSend({ to: email, subject, text });
      sent++;
    } catch (error) {
      console.error(`Failed to send to ${email}: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(`Weekly progress email: ${sent} sent, ${skipped} skipped (no email), ${enrollments.length} active enrollments (${candidates.length - enrollments.length} with ended access not emailed)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
