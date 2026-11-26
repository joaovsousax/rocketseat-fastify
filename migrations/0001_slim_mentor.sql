ALTER TABLE "transcriptions" ADD COLUMN "video_url" text;--> statement-breakpoint
ALTER TABLE "transcriptions" ADD COLUMN "video_id" text;--> statement-breakpoint
UPDATE "transcriptions" SET "video_url" = "youtube_url", "video_id" = "youtube_id";--> statement-breakpoint
ALTER TABLE "transcriptions" ALTER COLUMN "video_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transcriptions" ALTER COLUMN "video_id" SET NOT NULL;
