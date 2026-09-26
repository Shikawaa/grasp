import Link from "next/link";
import { Logo } from "@/components/carnet/logo";
import { Note } from "@/components/carnet/note";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const { dictionary } = await getServerDictionary();

  return (
    <main className="auth-shell">
      <section className="auth-page">
        <Logo label={dictionary.brand} />
        <h1 className="struck-title">{dictionary.notFound.title}</h1>
        <Note>{dictionary.notFound.note}</Note>
        <Link className="tape-button tape-button--link" href="/">
          {dictionary.navigation.home}
        </Link>
      </section>
    </main>
  );
}
