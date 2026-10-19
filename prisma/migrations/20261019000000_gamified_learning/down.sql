-- Manual rollback for 20261019000000_gamified_learning. Prisma does not run this file.
-- Run with psql only after a backup, then delete the row for this migration from "_prisma_migrations".
-- It drops the gamification tables (XP, badges, mission attempts, module certificates) and the new columns.
-- Learner accounts, enrolments, lesson progress, quiz scores and course certificates are untouched.
DROP TABLE IF EXISTS "ModuleCertificate";
DROP TABLE IF EXISTS "ActivityAttempt";
DROP TABLE IF EXISTS "UserBadge";
DROP TABLE IF EXISTS "XpEvent";
ALTER TABLE "User" DROP COLUMN IF EXISTS "effectsEnabled", DROP COLUMN IF EXISTS "soundEnabled";
ALTER TABLE "QuizAttempt" DROP COLUMN IF EXISTS "attemptCount", DROP COLUMN IF EXISTS "lastScore", DROP COLUMN IF EXISTS "passedAt";
ALTER TABLE "Lesson" DROP COLUMN IF EXISTS "activitiesJson";
ALTER TABLE "Certificate" DROP COLUMN IF EXISTS "showName";
