import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

import fastify from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
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

    console.log(error);

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

app.register(transcriptionRoutes);

async function start() {
  try {
    await app.listen({ port: 3333, host: "0.0.0.0" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
