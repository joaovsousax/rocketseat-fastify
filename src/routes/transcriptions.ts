import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createTranscription, getTranscriptions } from "../db/transcriptions";
import { createTranscriptionBodySchema } from "../schemas/transcriptions";
import { extractYoutubeId } from "../utils/youtube";

export const transcriptionRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/api/v1/video/transcriptions", async () => {
    return getTranscriptions();
  });

  app.post(
    "/api/v1/video/transcriptions",
    {
      schema: {
        body: createTranscriptionBodySchema,
      },
    },
    async (request, reply) => {
      const { url } = request.body;

      const youtubeId = extractYoutubeId(url);

      await createTranscription(url, youtubeId, request.user.id);

      return reply
        .status(201)
        .send({ message: "Transcription created successfully." });
    },
  );
};
