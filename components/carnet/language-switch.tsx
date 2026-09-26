import { setLocale } from "@/app/actions/locale";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export function LanguageSwitch({
  dictionary,
  locale,
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  return (
    <div className="language-switch" aria-label={dictionary.language.switchToEnglish}>
      <form action={setLocale.bind(null, "fr")}>
        <button
          aria-label={dictionary.language.switchToFrench}
          aria-pressed={locale === "fr"}
          className="language-switch__button"
          type="submit"
        >
          {dictionary.language.french}
        </button>
      </form>
      <span aria-hidden="true">/</span>
      <form action={setLocale.bind(null, "en")}>
        <button
          aria-label={dictionary.language.switchToEnglish}
          aria-pressed={locale === "en"}
          className="language-switch__button"
          type="submit"
        >
          {dictionary.language.english}
        </button>
      </form>
    </div>
  );
}
