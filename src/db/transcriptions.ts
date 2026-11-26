import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./index";
import { transcriptions, type TranscriptionRow } from "./schema";

type BaseTranscription = Pick<
  TranscriptionRow,
  "id" | "createdBy" | "createdAt" | "updatedAt" | "content"
>;

export type Transcription = BaseTranscription &
  Pick<TranscriptionRow, "youtubeUrl" | "youtubeId">;

export type VideoTranscription = BaseTranscription &
  Pick<TranscriptionRow, "videoUrl" | "videoId">;

/**
 * Writes both the legacy YouTube columns and the new video columns so that
 * both API versions can read the data regardless of when it was created.
 */
export async function createTranscription(
  videoUrl: string,
  videoId: string,
  userId: string,
): Promise<TranscriptionRow> {
  const now = new Date();

  const [transcription] = await db
    .insert(transcriptions)
    .values({
      id: nanoid(),
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      content: "Fake transcription",
      youtubeUrl: videoUrl,
      youtubeId: videoId,
      videoUrl,
      videoId,
    })
    .returning();

  return transcription!;
}

/**
 * v1 contract: only exposes the legacy YouTube columns.
 */
export async function getTranscriptions(): Promise<Transcription[]> {
  return db
    .select({
      id: transcriptions.id,
      createdBy: transcriptions.createdBy,
      createdAt: transcriptions.createdAt,
      updatedAt: transcriptions.updatedAt,
      content: transcriptions.content,
      youtubeUrl: transcriptions.youtubeUrl,
      youtubeId: transcriptions.youtubeId,
    })
    .from(transcriptions)
    .orderBy(desc(transcriptions.createdAt));
}

/**
 * v2 contract: only exposes the new video columns.
 */
export async function getVideoTranscriptions(): Promise<
  VideoTranscription[]
> {
  return db
    .select({
      id: transcriptions.id,
      createdBy: transcriptions.createdBy,
      createdAt: transcriptions.createdAt,
      updatedAt: transcriptions.updatedAt,
      content: transcriptions.content,
      videoUrl: transcriptions.videoUrl,
      videoId: transcriptions.videoId,
    })
    .from(transcriptions)
    .orderBy(desc(transcriptions.createdAt));
}
