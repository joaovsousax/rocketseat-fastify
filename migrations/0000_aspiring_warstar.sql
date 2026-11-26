CREATE TABLE IF NOT EXISTS "transcriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"content" text NOT NULL,
	"youtube_url" text NOT NULL,
	"youtube_id" text NOT NULL
);
