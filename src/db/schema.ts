import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const transcriptions = pgTable("transcriptions", {
  id: text("id").primaryKey(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  content: text("content").notNull(),
  videoUrl: text("video_url").notNull(),
  videoId: text("video_id").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  youtubeId: text("youtube_id").notNull(),
});

export type TranscriptionRow = typeof transcriptions.$inferSelect;
