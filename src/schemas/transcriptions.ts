import { z } from "zod";

export const createTranscriptionBodySchema = z.object({
  url: z.url(),
});

export type CreateTranscriptionBody = z.infer<
  typeof createTranscriptionBodySchema
>;
