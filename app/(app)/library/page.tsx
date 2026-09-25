import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";
import { LibraryContent } from "@/components/library-content";
import type { ContentItem } from "@/components/content-card";

export default async function LibraryPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const result = await query(
        `SELECT id, title, type, source_url, created_at 
         FROM public.contents 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 200`,
        [user.id],
        user.id
    );

    const items = (result.rows ?? []) as ContentItem[];

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#F4F4F5] tracking-tight">Library</h1>
                <p className="text-sm text-[#A1A1AA] mt-1">All your imported content</p>
            </div>
            <LibraryContent initialItems={items} />
        </div>
    );
}
