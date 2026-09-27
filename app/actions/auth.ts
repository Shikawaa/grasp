"use server";

import { redirect } from "next/navigation";
import { getAuth, requireUser } from "@/lib/auth/server";

export async function signOut(): Promise<never> {
  await requireUser();
  await getAuth().signOut();
  redirect("/sign-in");
}
