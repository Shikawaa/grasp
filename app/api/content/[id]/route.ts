import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

interface RouteContext {
    params: { id: string };
}

// ── PATCH /api/content/[id] — rename title ────────────────────────────────
export async function PATCH(request: Request, { params }: RouteContext) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    let title: string;
    try {
        const body = await request.json();
        title = (body?.title ?? "").trim();
    } catch {
        return NextResponse.json({ error: "Invalid body." }, { status: 400 });
    }

    if (!title) {
        return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
    }

    const result = await query(
        `UPDATE public.contents
         SET title = $1
         WHERE id = $2 AND user_id = $3
         RETURNING id, title`,
        [title, params.id, user.id],
        user.id
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
}

// ── DELETE /api/content/[id] — delete row ────────────────────────────────
export async function DELETE(_request: Request, { params }: RouteContext) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const getRes = await query(
        "SELECT id, type, audio_url FROM public.contents WHERE id = $1 AND user_id = $2",
        [params.id, user.id],
        user.id
    );

    if (getRes.rows.length === 0) {
        return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }

    const item = getRes.rows[0];

    await query(
        "DELETE FROM public.contents WHERE id = $1 AND user_id = $2",
        [params.id, user.id],
        user.id
    );

    // Clean up associated files in Neon Object Storage
    if (item.type === "pdf") {
        try {
            await deleteFile("pdfs", `${user.id}/${item.id}.pdf`);
        } catch (e) {
            console.warn("Could not delete S3 PDF file:", e);
        }
    }
    if (item.audio_url) {
        try {
            await deleteFile("audio", `${user.id}/${item.id}.mp3`);
        } catch (e) {
            console.warn("Could not delete S3 audio file:", e);
        }
    }

    return NextResponse.json({ success: true }, { status: 200 });
}
