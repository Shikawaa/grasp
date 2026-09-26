import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";
import { getAuthEnv } from "@/lib/env";

const env = getAuthEnv();

export const auth = createNeonAuth({
  baseUrl: env.NEON_AUTH_BASE_URL,
  cookies: {
    secret: env.NEON_AUTH_COOKIE_SECRET,
  },
});

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export async function getCurrentUser() {
  const { data, error } = await auth.getSession();
  if (error || !data?.user?.email) return null;
  if (!env.OWNER_EMAILS.has(data.user.email.toLowerCase())) return null;
  return data.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
