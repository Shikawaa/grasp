import "server-only";

import { cookies, headers } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import {
  languageCookieName,
  resolveLocale,
  type Locale,
} from "@/lib/i18n/config";

export async function getLocale(): Promise<Locale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  return resolveLocale({
    cookieLanguage: cookieStore.get(languageCookieName)?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
}

export async function getServerDictionary() {
  const locale = await getLocale();
  return { dictionary: getDictionary(locale), locale };
}
