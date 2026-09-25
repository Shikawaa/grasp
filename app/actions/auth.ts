"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  const cookieStore = cookies();
  const authBaseUrl = process.env.NEON_AUTH_BASE_URL;

  if (authBaseUrl) {
    try {
      await fetch(`${authBaseUrl.replace(/\/$/, "")}/sign-out`, {
        method: "POST",
        headers: {
          cookie: cookieStore.toString(),
        },
      });
    } catch (error) {
      console.error("Error signing out from Neon Auth:", error);
    }
  }

  // Explicitly clear session cookies
  const cookieNames = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
    "neon-auth.session_token",
    "__Secure-neon-auth.session_token",
  ];

  for (const name of cookieNames) {
    cookieStore.delete(name);
  }

  redirect("/sign-in");
}
