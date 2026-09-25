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
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const result = await query(
            `SELECT id, role, body, created_at 
             FROM public.messages 
             WHERE content_id = $1 AND user_id = $2 
             ORDER BY created_at ASC 
             LIMIT 50`,
            [contentId, user.id],
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

    try {
        await query(
            "DELETE FROM public.messages WHERE content_id = $1 AND user_id = $2",
            [contentId, user.id],
            user.id
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "DB error" }, { status: 500 });
    }
}
