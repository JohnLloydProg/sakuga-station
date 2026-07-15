ALTER TABLE "comments" ADD COLUMN "is_approved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "comment_approval" boolean DEFAULT true NOT NULL;