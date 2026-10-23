ALTER TABLE "Enrollment" DROP COLUMN "purchasedAt";
DROP INDEX IF EXISTS "Course_paystackProductCode_key";
ALTER TABLE "Course" DROP COLUMN "paystackProductCode";
