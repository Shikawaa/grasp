import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: string;
  token?: string;
}

export interface SessionData {
  user: AuthUser;
  session: AuthSession;
}

/**
 * Get the current user session from Neon Auth on the server.
 * Reads cookies from next/headers and validates with Neon Auth endpoint.
 */
export async function getServerSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) {
    return null;
  }

  const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
  if (!authBaseUrl) {
    console.error("NEON_AUTH_BASE_URL is not set.");
    return null;
  }

  try {
    const res = await fetch(`${authBaseUrl.replace(/\/$/, "")}/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!data || !data.user) {
      return null;
    }

    return data as SessionData;
  } catch (error) {
    console.error("Error retrieving Neon Auth server session:", error);
    return null;
  }
}

/**
 * Convenience helper returning only the user object or null.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const sessionData = await getServerSession();
  return sessionData ? sessionData.user : null;
}
