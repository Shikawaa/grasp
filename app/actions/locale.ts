"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  isLocale,
  languageCookieName,
  type Locale,
} from "@/lib/i18n/config";

export async function setLocale(locale: Locale): Promise<void> {
  if (!isLocale(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set(languageCookieName, locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  revalidatePath("/", "layout");
}
