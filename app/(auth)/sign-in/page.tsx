import { SignInForm } from "@/components/auth/sign-in-form";
import { Logo } from "@/components/carnet/logo";
import { LanguageSwitch } from "@/components/carnet/language-switch";
import { getServerDictionary } from "@/lib/i18n/server";
import styles from "@/styles/components.module.css";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const { dictionary, locale } = await getServerDictionary();

  return (
    <main className={styles["auth-shell"]}>
      <section className={styles["auth-page"]}>
        <header className={styles["auth-header"]}>
          <Logo label={dictionary.brand} />
          <LanguageSwitch dictionary={dictionary} locale={locale} />
        </header>
        <h1>{dictionary.auth.signInTitle}</h1>
        <p className={styles["auth-description"]}>{dictionary.auth.signInDescription}</p>
        <SignInForm dictionary={dictionary} />
      </section>
    </main>
  );
}
