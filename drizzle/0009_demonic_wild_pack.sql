ALTER TABLE "attempts" ADD COLUMN "exam_title" varchar(200);
UPDATE "attempts" SET "exam_title" = COALESCE((SELECT "title" FROM "exams" WHERE "exams"."id" = "attempts"."exam_id"), "exam_id") WHERE "exam_title" IS NULL;
ALTER TABLE "attempts" ALTER COLUMN "exam_title" SET NOT NULL;
