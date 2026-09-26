import { en } from "@/lib/i18n/en";
import { fr } from "@/lib/i18n/fr";
import type { Locale } from "@/lib/i18n/config";

export const dictionaries = { en, fr };

export type Dictionary = typeof fr | typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
