-- A paid enrollment records the purchase time separately from the original
-- enrollment date. Course product codes identify the matching Paystack catalog
-- products; prices remain authoritative in Course.priceNgn.
ALTER TABLE "Course" ADD COLUMN "paystackProductCode" TEXT;
ALTER TABLE "Enrollment" ADD COLUMN "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "Enrollment" SET "purchasedAt" = "enrolledAt";

CREATE UNIQUE INDEX "Course_paystackProductCode_key" ON "Course"("paystackProductCode");
