import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";
import { generateFlashcards } from "@/lib/generateFlashcards";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const { contentId } = body ?? {};

    if (!contentId) {
        return NextResponse.json({ error: "Missing contentId" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify ownership AND fetch summary in one query
    const checkRes = await query(
        "SELECT id, summary FROM public.contents WHERE id = $1 AND user_id = $2",
        [contentId, user.id],
        user.id
    );

    if (checkRes.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const content = checkRes.rows[0];

    if (!content.summary) {
        return NextResponse.json({ error: "Content has no summary to generate flashcards from" }, { status: 422 });
    }

    // Generate flashcards using user context
    await generateFlashcards({ contentId, summary: content.summary, userId: user.id });

    return NextResponse.json({ success: true });
}
