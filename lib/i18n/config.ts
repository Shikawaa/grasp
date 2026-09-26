export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";
export const languageCookieName = "lang";

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function resolveLocale({
  profileLanguage,
  cookieLanguage,
  acceptLanguage,
}: {
  profileLanguage?: string | null;
  cookieLanguage?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (isLocale(profileLanguage)) return profileLanguage;
  if (isLocale(cookieLanguage)) return cookieLanguage;

  const preferredLanguage = acceptLanguage
    ?.split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase())
    .find(Boolean);

  return preferredLanguage?.startsWith("fr") ? "fr" : acceptLanguage ? "en" : defaultLocale;
}
