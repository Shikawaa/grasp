import { ProvisionalHome } from "@/components/carnet/provisional-home";
import { getServerDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const { dictionary, locale } = await getServerDictionary();
  return <ProvisionalHome dictionary={dictionary} locale={locale} />;
}
