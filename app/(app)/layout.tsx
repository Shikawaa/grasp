import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { AppLayoutClient } from "@/components/app-layout-client";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <AppLayoutClient userEmail={user.email ?? ""}>
            {children}
        </AppLayoutClient>
    );
}
