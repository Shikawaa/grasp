import Link from "next/link";
import { Logo } from "@/components/carnet/logo";
import { Note } from "@/components/carnet/note";
import { getServerDictionary } from "@/lib/i18n/server";
import styles from "@/styles/components.module.css";

export default async function NotFound() {
  const { dictionary } = await getServerDictionary();

  return (
    <main className={styles["auth-shell"]}>
      <section className={styles["auth-page"]}>
        <Logo label={dictionary.brand} />
        <h1 className={styles["struck-title"]}>{dictionary.notFound.title}</h1>
        <Note>{dictionary.notFound.note}</Note>
        <Link className={`${styles["tape-button"]} ${styles["tape-button--link"]}`} href="/">
          {dictionary.navigation.home}
        </Link>
      </section>
    </main>
  );
}
