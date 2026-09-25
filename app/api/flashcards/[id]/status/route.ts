import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";

const VALID_STATUSES = ["new", "known", "review"] as const;
type Status = typeof VALID_STATUSES[number];

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const flashcardId = params.id;

    const body = await request.json().catch(() => null);
    const { status } = body ?? {};

    if (!VALID_STATUSES.includes(status as Status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify ownership via JOIN with contents
    const checkRes = await query(
        `SELECT f.id 
         FROM public.flashcards f
         JOIN public.contents c ON c.id = f.content_id
         WHERE f.id = $1 AND c.user_id = $2`,
        [flashcardId, user.id],
        user.id
    );

    if (checkRes.rows.length === 0) {
        return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
    }

    try {
        await query(
            "UPDATE public.flashcards SET status = $1 WHERE id = $2",
            [status, flashcardId],
            user.id
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "DB error" }, { status: 500 });
    }
}
