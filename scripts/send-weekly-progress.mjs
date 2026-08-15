#!/usr/bin/env node
/**
 * Weekly progress summary email for active AI Literacy learners.
 * Run inside the app container: node scripts/send-weekly-progress.mjs
 * Scheduled weekly (e.g. Mon 08:00 server time) via cron.
 * Uses the container's DATABASE_URL + RESEND_API_KEY env vars.
 */
import { createRequire } from "node:module";
const require = createRequire("/app/package.json");
const { PrismaClient } = require("@prisma/client");
const { Resend } = require("resend");

const db = new PrismaClient();
const COURSE_URL = process.env.NEXTAUTH_URL ?? "https://ailiteracy.ng";
const FROM = process.env.EMAIL_FROM ?? "AI Literacy <noreply@ailiteracy.ng>";

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
  const enrollments = await db.enrollment.findMany({
    where: { status: "ACTIVE" },
    include: { user: { select: { email: true, name: true } } },
  });

  let sent = 0;
  let skipped = 0;
  for (const enrollment of enrollments) {
    const email = enrollment.user.email;
    if (!email) { skipped++; continue; }
    const completed = enrollment.completedDays.length;
    const total = 21;
    const nextDay = Math.min(enrollment.unlockedDay + 1, total);
    const remaining = Math.max(total - completed, 0);
    const pct = Math.round((completed / total) * 100);
    const name = enrollment.user.name?.split(" ")[0] ?? "there";

    const progressBar = "▓".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));
    const subject = completed === 0
      ? "Your AI Literacy journey starts with Day 1"
      : completed >= total
        ? `You finished the 21-day AI challenge 🎉`
        : `Your AI Literacy progress: ${completed}/21 lessons complete`;

    const text = `Hi ${name},

${completed === 0
  ? "Welcome to the AI Literacy 21-day challenge. Your first lesson is waiting."
  : completed >= total
    ? "Congratulations — you have completed all 21 lessons. Your certificate is ready in your dashboard."
    : `You have completed ${completed} of ${total} lessons.`}

Progress: ${progressBar} ${pct}%

Next up: Day ${nextDay}
Lessons remaining: ${remaining}

Continue where you left off:
${COURSE_URL}/challenge

Keep the streak alive — one focused lesson a day is enough.

— The AI Literacy team`;

    try {
      await mockOrSend({ to: email, subject, text });
      sent++;
    } catch (error) {
      console.error(`Failed to send to ${email}: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(`Weekly progress email: ${sent} sent, ${skipped} skipped (no email), ${enrollments.length} active enrollments`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
