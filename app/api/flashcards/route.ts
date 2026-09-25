import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("contentId");

    if (!contentId) {
        return NextResponse.json({ error: "Missing contentId" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await query(
            `SELECT id, question, answer, status 
             FROM public.flashcards 
             WHERE content_id = $1 
             ORDER BY created_at ASC`,
            [contentId],
            user.id
        );

        return NextResponse.json(result.rows ?? []);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "DB error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("contentId");

    if (!contentId) {
        return NextResponse.json({ error: "Missing contentId" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify ownership via contents table
    const checkRes = await query(
        "SELECT id FROM public.contents WHERE id = $1 AND user_id = $2",
        [contentId, user.id],
        user.id
    );

    if (checkRes.rows.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
        const delRes = await query(
            "DELETE FROM public.flashcards WHERE content_id = $1",
            [contentId],
            user.id
        );

        return NextResponse.json({ success: true, deleted: delRes.rowCount });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "DB error" }, { status: 500 });
    }
}
