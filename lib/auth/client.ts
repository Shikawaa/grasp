import { createAuthClient } from "@neondatabase/auth/next";

// Connect to the local /api/auth proxy (configured with Neon Auth)
export const authClient = createAuthClient();

/**
 * Sign in with email and password
 */
export async function signInWithPassword(email: string, password: string) {
  return authClient.signIn.email({
    email,
    password,
  });
}

/**
 * Sign up with email, password, and optional name
 */
export async function signUp(email: string, password: string, name?: string) {
  return authClient.signUp.email({
    email,
    password,
    name: name || email.split("@")[0],
  });
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(callbackURL: string = "/library") {
  return authClient.signIn.social({
    provider: "google",
    callbackURL,
  });
}

/**
 * Sign out the current user
 */
export async function signOut() {
  return authClient.signOut();
}

/**
 * Send password reset email
 */
export async function forgetPassword(email: string, redirectTo?: string) {
  return (authClient as any).forgetPassword({
    email,
    redirectTo: redirectTo || `${window.location.origin}/reset-password`,
  });
}

/**
 * Reset password using token
 */
export async function resetPassword(newPassword: string, token: string) {
  return (authClient as any).resetPassword({
    newPassword,
    token,
  });
}

