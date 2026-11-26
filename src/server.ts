import "./env";

import swagger from "@fastify/swagger";
import fastify from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { transcriptionRoutes } from "./routes/transcriptions";
import { UserPayload } from "./types/fastify";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler<Error & { statusCode?: number }>(
  (error, _request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
        message: "Validation error.",
        errors: error.validation.map((issue) => ({
          field: issue.instancePath.replace(/^\//, "") || "body",
          message: issue.message,
        })),
      });
    }

    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return reply.status(error.statusCode).send({ message: error.message });
    }

    app.log.error(error);

    return reply.status(500).send({ message: error.message });
  },
);

app.decorateRequest("user", null as unknown as UserPayload);

app.addHook("onRequest", async (request) => {
  request.user = {
    id: "mock-id",
    name: "Mock name",
    email: "mock@mail.co",
  };
});

async function start() {
  try {
    await app.register(swagger, {
      openapi: {
        openapi: "3.1.0",
        info: {
          title: "Videos API",
          description: "API for managing YouTube video transcriptions.",
          version: "1.0.0",
        },
        servers: [
          { url: "http://localhost:3333", description: "Local development" },
        ],
        tags: [
          {
            name: "Transcriptions",
            description: "Create and list video transcriptions.",
          },
        ],
      },
      transform: jsonSchemaTransform,
    });

    await app.register(import("@scalar/fastify-api-reference"), {
      routePrefix: "/api/docs",
      configuration: {
        title: "Videos API Reference",
      },
    });

    await app.register(transcriptionRoutes);

    await app.listen({ port: 3333, host: "0.0.0.0" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
