"use server";

import { redirect } from "next/navigation";
import { auth, requireUser } from "@/lib/auth/server";

export async function signOut(): Promise<never> {
  await requireUser();
  await auth.signOut();
  redirect("/sign-in");
}
