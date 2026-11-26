import { z } from "zod";

export const createTranscriptionBodySchema = z.object({
  url: z.url().meta({
    description: "URL of the YouTube video to be transcribed.",
    examples: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
  }),
});

export type CreateTranscriptionBody = z.infer<
  typeof createTranscriptionBodySchema
>;

export const transcriptionSchema = z.object({
  id: z.string().meta({
    description: "Unique identifier of the transcription.",
  }),
  createdBy: z.string().meta({
    description: "Identifier of the user who created the transcription.",
  }),
  createdAt: z.date().meta({
    description: "Creation date and time (ISO 8601).",
  }),
  updatedAt: z.date().meta({
    description: "Last update date and time (ISO 8601).",
  }),
  content: z.string().meta({
    description: "Transcribed text content.",
  }),
  youtubeUrl: z.url().meta({
    description: "Original YouTube URL.",
  }),
  youtubeId: z.string().meta({
    description: "YouTube video identifier extracted from the URL.",
  }),
});

export const listTranscriptionsResponseSchema = z
  .array(transcriptionSchema)
  .meta({
    description: "Transcriptions ordered by creation date, newest first.",
  });

export const createTranscriptionResponseSchema = z
  .object({
    message: z.literal("Transcription created successfully.").meta({
      description: "Confirmation message.",
    }),
  })
  .meta({ description: "Transcription created successfully." });
