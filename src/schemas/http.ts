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

const databaseErrorCauseSchema = z.object({
  message: z.string().meta({
    description: "Underlying database error message.",
  }),
  code: z.string().optional().meta({
    description: "Database driver error code, when available.",
    examples: ["23505"],
  }),
  detail: z.string().optional().meta({
    description: "Additional detail provided by the database.",
  }),
  constraint: z.string().optional().meta({
    description: "Database constraint that triggered the error, if any.",
  }),
  table: z.string().optional().meta({
    description: "Database table related to the error, if any.",
  }),
  column: z.string().optional().meta({
    description: "Database column related to the error, if any.",
  }),
});

export const errorResponseSchema = z.object({
  message: z.string().meta({
    description: "Error message.",
    examples: ["Internal Server Error"],
  }),
  query: z.string().optional().meta({
    description: "SQL query that failed, for Drizzle query errors.",
  }),
  params: z.array(z.unknown()).optional().meta({
    description: "Parameters bound to the failed query.",
  }),
  cause: databaseErrorCauseSchema.optional().meta({
    description: "Details about the underlying database error.",
  }),
}).meta({ description: "Generic error response." });
