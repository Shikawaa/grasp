import type { Metadata } from "next";
import Link from "next/link";
import { LanguageSwitch } from "@/components/carnet/language-switch";
import { Logo } from "@/components/carnet/logo";
import { DrawingsSection } from "@/components/styleguide/drawings-section";
import { getServerDictionary } from "@/lib/i18n/server";
import styles from "@/app/(marketing)/styleguide/styleguide.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { dictionary } = await getServerDictionary();

  return {
    title: dictionary.styleguide.metadataTitle,
    robots: {
      follow: false,
      index: false,
    },
  };
}

export default async function StyleguidePage() {
  const { dictionary, locale } = await getServerDictionary();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Logo label={dictionary.brand} />
        <div className={styles.actions}>
          <LanguageSwitch dictionary={dictionary} locale={locale} />
          <Link href="/">{dictionary.styleguide.backHome}</Link>
        </div>
      </header>

      <div className={styles.introduction}>
        <h1>{dictionary.styleguide.title}</h1>
        <p>{dictionary.styleguide.intro}</p>
      </div>

      <DrawingsSection copy={dictionary.styleguide} />
    </main>
  );
}
