import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./index";
import { transcriptions, type TranscriptionRow } from "./schema";

export type Transcription = TranscriptionRow;

export async function createTranscription(
  youtubeUrl: string,
  youtubeId: string,
  userId: string,
): Promise<Transcription> {
  const now = new Date();

  const [transcription] = await db
    .insert(transcriptions)
    .values({
      id: nanoid(),
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      content: "Fake transcription",
      youtubeUrl,
      youtubeId,
    })
    .returning();

  return transcription!;
}

export async function getTranscriptions(): Promise<Transcription[]> {
  return db
    .select()
    .from(transcriptions)
    .orderBy(desc(transcriptions.createdAt));
}
