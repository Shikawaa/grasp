import Link from "next/link";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Logo } from "@/components/carnet/logo";
import { getServerDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const { dictionary } = await getServerDictionary();

  return (
    <main className="auth-shell">
      <section className="auth-page">
        <Logo label={dictionary.brand} />
        <h1>{dictionary.auth.resetTitle}</h1>
        <p className="auth-description">{dictionary.auth.resetDescription}</p>
        <Suspense fallback={null}>
          <ResetPasswordForm dictionary={dictionary} />
        </Suspense>
        <Link className="quiet-link" href="/sign-in">
          {dictionary.auth.backToSignIn}
        </Link>
      </section>
    </main>
  );
}
