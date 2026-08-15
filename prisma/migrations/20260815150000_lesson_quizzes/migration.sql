-- Per-lesson "check your understanding" quizzes and learner attempts.
ALTER TABLE "Lesson"
  ADD COLUMN "quizJson" JSONB;

CREATE TABLE "QuizAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "total" INTEGER NOT NULL,
  "answers" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "QuizAttempt_userId_lessonId_key" ON "QuizAttempt"("userId", "lessonId");
CREATE INDEX "QuizAttempt_userId_idx" ON "QuizAttempt"("userId");

ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
