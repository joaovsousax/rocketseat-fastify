import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createTranscription, getTranscriptions } from "../db/transcriptions";
import {
  errorResponseSchema,
  validationErrorResponseSchema,
} from "../schemas/http";
import {
  createTranscriptionBodySchema,
  createTranscriptionResponseSchema,
  listTranscriptionsResponseSchema,
} from "../schemas/transcriptions";
import { extractYoutubeId } from "../utils/youtube";

export const transcriptionRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/v1/video/transcriptions",
    {
      schema: {
        tags: ["Transcriptions"],
        summary: "List transcriptions",
        description:
          "Returns all transcriptions ordered by creation date, newest first.",
        operationId: "listTranscriptions",
        response: {
          200: listTranscriptionsResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async () => {
      return getTranscriptions();
    },
  );

  app.post(
    "/api/v1/video/transcriptions",
    {
      schema: {
        tags: ["Transcriptions"],
        summary: "Create transcription",
        description:
          "Creates a transcription for the given YouTube URL. The transcription content is currently mocked.",
        operationId: "createTranscription",
        body: createTranscriptionBodySchema,
        response: {
          201: createTranscriptionResponseSchema,
          400: validationErrorResponseSchema,
          500: errorResponseSchema,
        },
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
