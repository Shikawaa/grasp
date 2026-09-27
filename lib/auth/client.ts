import { createAuthClient } from "@neondatabase/auth/next";

// Connect to the local /api/auth proxy (configured with Neon Auth)
export const authClient = createAuthClient();

export function isAuthUnavailable(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 503
  );
}

export async function signInWithPassword(email: string, password: string) {
  return authClient.signIn.email({
    email,
    password,
  });
}

export async function signOut() {
  return authClient.signOut();
}

export async function requestPasswordReset(email: string, redirectTo: string) {
  return authClient.requestPasswordReset({ email, redirectTo });
}

export async function resetPassword(newPassword: string, token: string) {
  return authClient.resetPassword({ newPassword, token });
}
