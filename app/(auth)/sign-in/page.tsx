import { SignInForm } from "@/components/auth/sign-in-form";
import { Logo } from "@/components/carnet/logo";
import { LanguageSwitch } from "@/components/carnet/language-switch";
import { getServerDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const { dictionary, locale } = await getServerDictionary();

  return (
    <main className="auth-shell">
      <section className="auth-page">
        <header className="auth-header">
          <Logo label={dictionary.brand} />
          <LanguageSwitch dictionary={dictionary} locale={locale} />
        </header>
        <h1>{dictionary.auth.signInTitle}</h1>
        <p className="auth-description">{dictionary.auth.signInDescription}</p>
        <SignInForm dictionary={dictionary} />
      </section>
    </main>
  );
}
