ALTER TABLE "posts" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "reads" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "status";