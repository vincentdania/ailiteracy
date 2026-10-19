/**
 * Paid course access lasts ACCESS_DAYS (90 by default) from the payment or enrolment
 * date. Admins always have access, and an admin can grant a learner lifetime access.
 * Enforced when a page or action runs: nothing needs to be scheduled.
 */

const DEFAULT_ACCESS_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

export function accessDays() {
  const days = Number(process.env.ACCESS_DAYS);
  return Number.isInteger(days) && days > 0 ? days : DEFAULT_ACCESS_DAYS;
}

/** When access bought (or started) at `start` ends. */
export function accessExpiryFrom(start: Date) {
  return new Date(start.getTime() + accessDays() * DAY_MS);
}

export type AccessEnrollment = { enrolledAt: Date; expiresAt: Date | null; lifetimeAccess: boolean };

export type AccessStatus =
  | { active: true; kind: "admin"; endsAt: null }
  | { active: true; kind: "lifetime"; endsAt: null }
  | { active: true; kind: "timed"; endsAt: Date }
  | { active: false; kind: "expired"; endsAt: Date };

export function accessStatus(enrollment: AccessEnrollment, now: Date = new Date(), role?: string | null): AccessStatus {
  if (role === "ADMIN") return { active: true, kind: "admin", endsAt: null };
  if (enrollment.lifetimeAccess) return { active: true, kind: "lifetime", endsAt: null };
  // Every enrolment gets an expiry when it is created; fall back to the enrolment date just in case.
  const endsAt = enrollment.expiresAt ?? accessExpiryFrom(enrollment.enrolledAt);
  return now.getTime() < endsAt.getTime() ? { active: true, kind: "timed", endsAt } : { active: false, kind: "expired", endsAt };
}

export function hasActiveAccess(enrollment: AccessEnrollment, now: Date = new Date(), role?: string | null) {
  return accessStatus(enrollment, now, role).active;
}

/** Message returned by server actions when a learner's access has ended. */
export const ACCESS_ENDED_MESSAGE = "Your course access has ended. Visit your dashboard to get access again.";

export function formatAccessDate(date: Date, timeZone = "Africa/Lagos") {
  try {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone });
  } catch {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });
  }
}
