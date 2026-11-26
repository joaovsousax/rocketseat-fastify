import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  createTranscription,
  getTranscriptions,
  getVideoTranscriptions,
} from "../db/transcriptions";
import {
  errorResponseSchema,
  validationErrorResponseSchema,
} from "../schemas/http";
import {
  createTranscriptionBodySchema,
  createTranscriptionResponseSchema,
  listTranscriptionsResponseSchema,
  listVideoTranscriptionsResponseSchema,
} from "../schemas/transcriptions";
import { extractVideoId } from "../utils/youtube";

export const transcriptionRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/v1/video/transcriptions",
    {
      schema: {
        tags: ["Transcriptions"],
        summary: "List transcriptions",
        description:
          "Returns all transcriptions ordered by creation date, newest first. Exposes the legacy YouTube URL and ID fields.",
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

      const videoId = extractVideoId(url);

      await createTranscription(url, videoId, request.user.id);

      return reply
        .status(201)
        .send({ message: "Transcription created successfully." });
    },
  );

  app.get(
    "/api/v2/video/transcriptions",
    {
      schema: {
        tags: ["Transcriptions"],
        summary: "List transcriptions (v2)",
        description:
          "Returns all transcriptions ordered by creation date, newest first. Exposes the video URL and ID fields.",
        operationId: "listVideoTranscriptions",
        response: {
          200: listVideoTranscriptionsResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async () => {
      return getVideoTranscriptions();
    },
  );

  app.post(
    "/api/v2/video/transcriptions",
    {
      schema: {
        tags: ["Transcriptions"],
        summary: "Create transcription (v2)",
        description:
          "Creates a transcription for the given video URL. The transcription content is currently mocked.",
        operationId: "createVideoTranscription",
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

      const videoId = extractVideoId(url);

      await createTranscription(url, videoId, request.user.id);

      return reply
        .status(201)
        .send({ message: "Transcription created successfully." });
    },
  );
};
