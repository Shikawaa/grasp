import "server-only";

import { authEnvKeys, parseAuthEnv } from "@/lib/env-validation";

export function getAuthEnv() {
  return parseAuthEnv({
    NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL,
    NEON_AUTH_COOKIE_SECRET: process.env.NEON_AUTH_COOKIE_SECRET,
    OWNER_EMAILS: process.env.OWNER_EMAILS,
  });
}

export function hasAuthEnv(): boolean {
  return authEnvKeys.every((key) => Boolean(process.env[key]?.trim()));
}
