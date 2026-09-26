import { redirect } from "next/navigation";
import { requireUser, UnauthorizedError } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    await requireUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/sign-in");
    throw error;
  }

  return children;
}
