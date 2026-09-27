import type { Locale } from "@/lib/i18n/config";
import { formatTypography } from "@/lib/i18n/typography";

type CardinalMessages = Readonly<{
  one: string;
  other: string;
}>;

export function formatCardinalMessage(
  messages: CardinalMessages,
  count: number,
  locale: Locale,
  values: Readonly<Record<string, number>> = {},
): string {
  const category = new Intl.PluralRules(locale).select(count);
  const template = category === "one" ? messages.one : messages.other;
  const replacements: Readonly<Record<string, number>> = { count, ...values };
  const message = template.replace(/\{([a-z]+)\}/giu, (placeholder, key: string) => {
    const value = replacements[key];
    return value === undefined ? placeholder : new Intl.NumberFormat(locale).format(value);
  });

  return formatTypography(message, locale);
}
