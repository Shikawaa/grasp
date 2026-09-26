import type { Metadata } from "next";
import { Caveat, Fraunces } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { getServerDictionary } from "@/lib/i18n/server";
import "./globals.css";

const fraunces = Fraunces({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500"],
});

const caveat = Caveat({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { dictionary } = await getServerDictionary();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale } = await getServerDictionary();

  return (
    <html
      className={`${GeistSans.variable} ${fraunces.variable} ${caveat.variable}`}
      lang={locale}
    >
      <body>{children}</body>
    </html>
  );
}
