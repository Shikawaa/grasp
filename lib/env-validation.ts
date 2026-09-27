import { z } from "zod";

const authEnvSchema = z.object({
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

export const authEnvKeys = [
  "NEON_AUTH_BASE_URL",
  "NEON_AUTH_COOKIE_SECRET",
  "OWNER_EMAILS",
] as const;

export type AuthEnv = z.infer<typeof authEnvSchema>;

export class AuthConfigurationError extends Error {
  constructor(fields: readonly string[]) {
    super(
      `Configuration Neon Auth invalide. Vérifie les variables serveur suivantes : ${fields.join(", ")}.`,
    );
    this.name = "AuthConfigurationError";
  }
}

export function parseAuthEnv(input: Record<string, string | undefined>): AuthEnv {
  const result = authEnvSchema.safeParse(input);
  if (result.success) return result.data;

  const fields = [
    ...new Set(
      result.error.issues.map((issue) => String(issue.path[0] ?? "configuration inconnue")),
    ),
  ];
  throw new AuthConfigurationError(fields);
}

export function isAuthConfigurationError(
  error: unknown,
): error is AuthConfigurationError {
  return error instanceof AuthConfigurationError;
}
