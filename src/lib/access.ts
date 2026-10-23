/** One purchase opens one track for three calendar months. */
export const ACCESS_MONTHS = 3;

export function accessExpiryFrom(purchasedAt: Date) {
  const year = purchasedAt.getUTCFullYear();
  const month = purchasedAt.getUTCMonth() + ACCESS_MONTHS;
  const day = purchasedAt.getUTCDate();
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(
    year,
    month,
    Math.min(day, lastDay),
    purchasedAt.getUTCHours(),
    purchasedAt.getUTCMinutes(),
    purchasedAt.getUTCSeconds(),
    purchasedAt.getUTCMilliseconds(),
  ));
}

export type AccessEnrollment = { purchasedAt: Date; expiresAt: Date | null; status: string };

export type AccessStatus =
  | { active: true; kind: "timed"; endsAt: Date }
  | { active: false; kind: "expired"; endsAt: Date };

export function accessStatus(enrollment: AccessEnrollment, now: Date = new Date()): AccessStatus {
  const endsAt = enrollment.expiresAt ?? accessExpiryFrom(enrollment.purchasedAt);
  const active = (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED") && now.getTime() < endsAt.getTime();
  return active ? { active: true, kind: "timed", endsAt } : { active: false, kind: "expired", endsAt };
}

export function hasActiveAccess(enrollment: AccessEnrollment, now: Date = new Date()) {
  return accessStatus(enrollment, now).active;
}

export function daysRemaining(endsAt: Date, now: Date = new Date()) {
  return Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / 86_400_000));
}

export const ACCESS_ENDED_MESSAGE = "Your track access has ended. Renew it from your dashboard to continue learning.";

export function formatAccessDate(date: Date, timeZone = "Africa/Lagos") {
  try {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone });
  } catch {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });
  }
}
