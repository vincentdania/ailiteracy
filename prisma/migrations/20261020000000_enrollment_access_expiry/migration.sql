-- Paid course access lasts 90 days from enrolment unless an admin grants lifetime access.
-- Additive only: new nullable columns and a boolean with a default, so existing rows are kept.
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "lifetimeAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "lifetimeGrantedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "lifetimeGrantedBy" TEXT;

-- Backfill: existing enrolments get 90 days from their original enrolment date.
-- Only rows without an expiry are touched, so re-running this is harmless.
UPDATE "Enrollment" SET "expiresAt" = "enrolledAt" + INTERVAL '90 days' WHERE "expiresAt" IS NULL;
