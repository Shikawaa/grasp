import { NextResponse } from "next/server";
import { summarize, extractTitle } from "@/lib/gemini";
import { fetchYouTubeTranscript, TranscriptError } from "@/lib/youtube";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";
import { generateFlashcards } from "@/lib/generateFlashcards";

const YOUTUBE_REGEX =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(?:[?&].*)?$/;

function parseVideoId(url: string): string | null {
    try {
        const u = new URL(url.startsWith("http") ? url : `https://${url}`);
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
        if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
        return u.searchParams.get("v");
    } catch {
        return null;
    }
}

export async function POST(request: Request) {
    // ── 1. Parse & validate URL ──────────────────────────────────
    let url: string;
    try {
        const body = await request.json();
        url = (body?.url ?? "").trim();
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (!url || !YOUTUBE_REGEX.test(url)) {
        return NextResponse.json(
            { error: "Invalid YouTube URL. Please provide a valid youtube.com or youtu.be link." },
            { status: 400 }
        );
    }

    const videoId = parseVideoId(url);
    if (!videoId) {
        return NextResponse.json(
            { error: "Could not extract video ID from URL." },
            { status: 400 }
        );
    }

    // ── 2. Extract transcript ─────────────────────────────────────
    let transcript: string;
    let title: string;

    try {
        const result = await fetchYouTubeTranscript(videoId);
        transcript = result.transcript;
        title = result.title;
    } catch (err: any) {
        if (err instanceof TranscriptError) {
            const status = err.code === "NOT_FOUND" ? 404 : 422;
            return NextResponse.json({ error: err.message }, { status });
        }
        console.error("Transcript error:", err);
        return NextResponse.json(
            { error: `Transcript extraction failed: ${err?.message || "Please check SUPADATA_API_KEY or video availability"}` },
            { status: 502 }
        );
    }

    // ── 3. Summarise with Gemini ──────────────────────────────────
    let summary: string;
    let aiTitle: string = title;
    try {
        const raw = await summarize(transcript, "youtube");
        if (!raw) {
            return NextResponse.json(
                { error: "Could not generate summary (empty AI response)." },
                { status: 502 }
            );
        }
        ({ title: aiTitle, summary } = extractTitle(raw, title));
    } catch (err: any) {
        console.error("Gemini error:", err);
        return NextResponse.json(
            { error: `Gemini AI error: ${err?.message || "Please check GEMINI_API_KEY"}` },
            { status: 502 }
        );
    }

    // ── 4. Save to Postgres ───────────────────────────────────────
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const result = await query(
            `INSERT INTO public.contents (user_id, title, type, source_url, raw_text, summary, is_public)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [user.id, aiTitle, "youtube", url, transcript, summary, false],
            user.id
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Failed to save content." }, { status: 500 });
        }

        const contentId = result.rows[0].id;

        // Fire & forget — don't block the response
        generateFlashcards({ contentId, summary, userId: user.id }).catch(console.error);

        return NextResponse.json({ id: contentId, title: aiTitle, summary }, { status: 200 });
    } catch (err) {
        console.error("DB error:", err);
        return NextResponse.json({ error: "Failed to save content." }, { status: 500 });
    }
}
