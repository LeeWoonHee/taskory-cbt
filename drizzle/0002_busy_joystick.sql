ALTER TABLE "exams" ADD COLUMN "series_id" varchar(160) NOT NULL;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "level" varchar(40) NOT NULL;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "exam_year" integer NOT NULL;