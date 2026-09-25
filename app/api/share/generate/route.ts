import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { content_id } = body;

        if (!content_id) {
            return NextResponse.json({ error: "Missing content_id" }, { status: 400 });
        }

        // 1. Verify ownership and get existing token
        const checkRes = await query(
            "SELECT id, share_token FROM public.contents WHERE id = $1 AND user_id = $2",
            [content_id, user.id],
            user.id
        );

        if (checkRes.rows.length === 0) {
            return NextResponse.json({ error: "Content not found or unauthorized" }, { status: 404 });
        }

        const content = checkRes.rows[0];

        // 2. Return existing if present
        if (content.share_token) {
            return NextResponse.json({ share_token: content.share_token });
        }

        // 3. Generate new UUID
        const updateRes = await query(
            `UPDATE public.contents
             SET share_token = gen_random_uuid()
             WHERE id = $1 AND user_id = $2
             RETURNING share_token`,
            [content_id, user.id],
            user.id
        );

        if (updateRes.rows.length === 0) {
            return NextResponse.json({ error: "Failed to generate share token" }, { status: 500 });
        }

        return NextResponse.json({ share_token: updateRes.rows[0].share_token });
    } catch (err) {
        console.error("Share generate error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
