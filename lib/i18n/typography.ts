import type { Locale } from "@/lib/i18n/config";

const technicalTextPattern = /(?:https?:\/\/|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/;

export type TypographyDictionary<T> = T extends string
  ? string
  : T extends readonly unknown[]
    ? { readonly [Key in keyof T]: TypographyDictionary<T[Key]> }
    : T extends object
      ? { readonly [Key in keyof T]: TypographyDictionary<T[Key]> }
      : T;

export function formatTypography(text: string, locale: Locale): string {
  if (technicalTextPattern.test(text)) return text;

  const withCountSpacing = text.replace(/(\d)[ \t]+(?=[\p{L}])/gu, "$1\u00A0");
  if (locale !== "fr") return withCountSpacing;

  return withCountSpacing
    .replaceAll("'", "’")
    .replace(/(?<=[\p{L}»])[ \t\u00A0\u202F]*:/gu, "\u00A0:")
    .replace(/(?<=[\p{L}\d»])[ \t\u00A0\u202F]*([;!?])/gu, "\u202F$1")
    .replace(/«[ \t\u00A0\u202F]*/gu, "«\u202F")
    .replace(/[ \t\u00A0\u202F]*»/gu, "\u202F»");
}

export function applyTypography<T>(
  value: T,
  locale: Locale,
): TypographyDictionary<T> {
  if (typeof value === "string") {
    return formatTypography(value, locale) as TypographyDictionary<T>;
  }

  if (Array.isArray(value)) {
    return value.map((item) => applyTypography(item, locale)) as TypographyDictionary<T>;
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        key === "id" ? item : applyTypography(item, locale),
      ]),
    ) as TypographyDictionary<T>;
  }

  return value as TypographyDictionary<T>;
}
