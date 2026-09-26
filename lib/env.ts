import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  NEON_AUTH_BASE_URL: z.url(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32),
  OWNER_EMAILS: z
    .string()
    .min(1)
    .transform((value) =>
      new Set(
        value
          .split(",")
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean),
      ),
    ),
});

export function getAuthEnv() {
  return serverEnvSchema.parse({
    NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL,
    NEON_AUTH_COOKIE_SECRET: process.env.NEON_AUTH_COOKIE_SECRET,
    OWNER_EMAILS: process.env.OWNER_EMAILS,
  });
}
