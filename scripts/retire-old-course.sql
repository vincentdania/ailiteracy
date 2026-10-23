-- Run only after a verified full database and course-media backup.
-- This data deletion is reversible only by restoring that database backup.
BEGIN;

DELETE FROM "XpEvent"
WHERE "courseId" IN (SELECT id FROM "Course" WHERE slug = 'ai-for-your-work')
   OR "lessonId" IN (
     SELECT l.id FROM "Lesson" l JOIN "Module" m ON m.id = l."moduleId"
     JOIN "Course" c ON c.id = m."courseId" WHERE c.slug = 'ai-for-your-work'
   );
DELETE FROM "UserBadge"
WHERE "courseId" IN (SELECT id FROM "Course" WHERE slug = 'ai-for-your-work');
DELETE FROM "Transaction"
WHERE "courseId" IN (SELECT id FROM "Course" WHERE slug = 'ai-for-your-work');
-- Cascades delete its modules, lessons, attempts, submissions, plans,
-- enrollments and old certificates. User and admin accounts are retained.
DELETE FROM "Course" WHERE slug = 'ai-for-your-work';
-- Preserve every user and admin account, including the approved test buyer.

COMMIT;
