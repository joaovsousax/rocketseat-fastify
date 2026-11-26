import { z } from "zod";

export const validationErrorResponseSchema = z.object({
  message: z.literal("Validation error.").meta({
    description: "Message returned when the request fails validation.",
  }),
  errors: z.array(
    z.object({
      field: z.string().meta({
        description:
          "Path of the invalid field. Falls back to `body` when the issue is not tied to a specific field.",
        examples: ["url"],
      }),
      message: z.string().meta({
        description: "Human-readable description of the validation issue.",
        examples: ["Invalid URL"],
      }),
    }),
  ),
}).meta({ description: "Returned when the request payload is invalid." });

export const errorResponseSchema = z.object({
  message: z.string().meta({
    description: "Error message.",
    examples: ["Internal Server Error"],
  }),
}).meta({ description: "Generic error response." });
