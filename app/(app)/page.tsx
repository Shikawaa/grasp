import { signOut } from "@/app/actions/auth";
import { Logo } from "@/components/carnet/logo";
import { requireUser } from "@/lib/auth/server";
import { getServerDictionary } from "@/lib/i18n/server";
import styles from "@/styles/components.module.css";

export const dynamic = "force-dynamic";

export default async function PrivateHomePage() {
  await requireUser();
  const { dictionary } = await getServerDictionary();

  return (
    <main className={styles["auth-shell"]}>
      <section className={styles["auth-page"]}>
        <Logo label={dictionary.brand} />
        <h1>{dictionary.privateHome.title}</h1>
        <p className={styles["auth-description"]}>{dictionary.privateHome.description}</p>
        <form action={signOut}>
          <button className={styles["quiet-button"]} type="submit">
            {dictionary.navigation.signOut}
          </button>
        </form>
      </section>
    </main>
  );
}
