-- Personalized learning profiles, plans, practice evidence and AI cost telemetry.
CREATE TYPE "LearningTrack" AS ENUM ('CAREER_PRODUCTIVITY', 'BUSINESS_GROWTH', 'CREATIVE_CONTENT', 'DATA_DECISIONS', 'ENTREPRENEURSHIP', 'EDUCATION_RESEARCH');
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'EXPLORER', 'PRACTITIONER');
CREATE TYPE "LearningFormat" AS ENUM ('PRACTICAL', 'VISUAL', 'READING', 'MIXED');
CREATE TYPE "GenerationSource" AS ENUM ('CURATED', 'DEEPSEEK');
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEWED');
CREATE TYPE "AiUsageStatus" AS ENUM ('SUCCESS', 'FAILED', 'SKIPPED');

ALTER TABLE "UserProfile"
  ADD COLUMN "country" TEXT NOT NULL DEFAULT 'Nigeria',
  ADD COLUMN "skillLevel" "SkillLevel" NOT NULL DEFAULT 'BEGINNER',
  ADD COLUMN "weeklyMinutes" INTEGER NOT NULL DEFAULT 140,
  ADD COLUMN "learningFormat" "LearningFormat" NOT NULL DEFAULT 'PRACTICAL',
  ADD COLUMN "learningTrack" "LearningTrack",
  ADD COLUMN "preferredTools" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "Enrollment"
  ADD COLUMN "capstonePassed" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "assessmentScore" INTEGER;

CREATE TABLE "LearningPlan" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL,
  "track" "LearningTrack" NOT NULL, "title" TEXT NOT NULL, "outcomeSummary" TEXT NOT NULL,
  "milestones" JSONB NOT NULL, "recommendedTools" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "caseStudySlugs" TEXT[] DEFAULT ARRAY[]::TEXT[], "source" "GenerationSource" NOT NULL DEFAULT 'CURATED',
  "model" TEXT, "promptVersion" TEXT NOT NULL DEFAULT 'plan-v1',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LearningPlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PersonalizedLesson" (
  "id" TEXT NOT NULL, "learningPlanId" TEXT NOT NULL, "lessonId" TEXT NOT NULL,
  "whyItMatters" TEXT NOT NULL, "tailoredExample" TEXT NOT NULL, "practiceBrief" TEXT NOT NULL,
  "successCriteria" TEXT[] DEFAULT ARRAY[]::TEXT[], "caseStudySlug" TEXT,
  "source" "GenerationSource" NOT NULL DEFAULT 'CURATED', "model" TEXT, "inputHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PersonalizedLesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectSubmission" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "lessonId" TEXT NOT NULL,
  "title" TEXT NOT NULL, "content" TEXT NOT NULL, "artifactUrl" TEXT,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED', "score" INTEGER, "aiFeedback" JSONB,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "reviewedAt" TIMESTAMP(3), "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProjectSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiUsageEvent" (
  "id" TEXT NOT NULL, "userId" TEXT, "operation" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'deepseek', "model" TEXT NOT NULL,
  "inputTokens" INTEGER, "outputTokens" INTEGER, "estimatedCostUsd" DECIMAL(12,8),
  "cacheHit" BOOLEAN NOT NULL DEFAULT false, "latencyMs" INTEGER,
  "status" "AiUsageStatus" NOT NULL, "errorCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiUsageEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LearningPlan_userId_courseId_key" ON "LearningPlan"("userId", "courseId");
CREATE INDEX "LearningPlan_track_idx" ON "LearningPlan"("track");
CREATE UNIQUE INDEX "PersonalizedLesson_learningPlanId_lessonId_key" ON "PersonalizedLesson"("learningPlanId", "lessonId");
CREATE INDEX "PersonalizedLesson_lessonId_idx" ON "PersonalizedLesson"("lessonId");
CREATE UNIQUE INDEX "ProjectSubmission_userId_lessonId_key" ON "ProjectSubmission"("userId", "lessonId");
CREATE INDEX "ProjectSubmission_userId_status_idx" ON "ProjectSubmission"("userId", "status");
CREATE INDEX "AiUsageEvent_userId_createdAt_idx" ON "AiUsageEvent"("userId", "createdAt");
CREATE INDEX "AiUsageEvent_operation_status_createdAt_idx" ON "AiUsageEvent"("operation", "status", "createdAt");

ALTER TABLE "LearningPlan" ADD CONSTRAINT "LearningPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningPlan" ADD CONSTRAINT "LearningPlan_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalizedLesson" ADD CONSTRAINT "PersonalizedLesson_learningPlanId_fkey" FOREIGN KEY ("learningPlanId") REFERENCES "LearningPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalizedLesson" ADD CONSTRAINT "PersonalizedLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectSubmission" ADD CONSTRAINT "ProjectSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectSubmission" ADD CONSTRAINT "ProjectSubmission_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiUsageEvent" ADD CONSTRAINT "AiUsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
