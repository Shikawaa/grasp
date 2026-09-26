import { setLocale } from "@/app/actions/locale";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import styles from "@/styles/components.module.css";

export function LanguageSwitch({
  dictionary,
  locale,
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  return (
    <div className={styles["language-switch"]} aria-label={dictionary.language.switchToEnglish}>
      <form action={setLocale.bind(null, "fr")}>
        <button
          aria-label={dictionary.language.switchToFrench}
          aria-pressed={locale === "fr"}
          className={styles["language-switch__button"]}
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
          className={styles["language-switch__button"]}
          type="submit"
        >
          {dictionary.language.english}
        </button>
      </form>
    </div>
  );
}
