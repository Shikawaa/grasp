import "server-only";

import {
  createNeonAuth,
  type NeonAuth,
} from "@neondatabase/auth/next/server";
import { getAuthEnv } from "@/lib/env";

let authInstance: NeonAuth | undefined;

export function getAuth(): NeonAuth {
  if (authInstance) return authInstance;

  const env = getAuthEnv();
  authInstance = createNeonAuth({
    baseUrl: env.NEON_AUTH_BASE_URL,
    cookies: {
      secret: env.NEON_AUTH_COOKIE_SECRET,
    },
  });
  return authInstance;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export async function getCurrentUser() {
  const env = getAuthEnv();
  const { data, error } = await getAuth().getSession();
  if (error || !data?.user?.email) return null;
  if (!env.OWNER_EMAILS.has(data.user.email.toLowerCase())) return null;
  return data.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
