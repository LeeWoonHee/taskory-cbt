ALTER TABLE "exams" ALTER COLUMN "category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exams" ALTER COLUMN "organization" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "subject" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "options" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "correct_answer" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "explanation" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "question_type" varchar(20) DEFAULT 'objective' NOT NULL;