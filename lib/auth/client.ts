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
  try {
    const res = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        redirectTo: redirectTo || `${window.location.origin}/reset-password`,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: { message: data?.message || "Failed to send reset email" } };
    }
    return { data };
  } catch (err: any) {
    return { error: { message: err?.message || "Failed to send reset email" } };
  }
}

/**
 * Reset password using token
 */
export async function resetPassword(newPassword: string, token: string) {
  try {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword,
        token,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: { message: data?.message || "Failed to reset password" } };
    }
    return { data };
  } catch (err: any) {
    return { error: { message: err?.message || "Failed to reset password" } };
  }
}

