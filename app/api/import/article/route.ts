import { NextResponse } from "next/server";
import { summarize, extractTitle } from "@/lib/gemini";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";
import { generateFlashcards } from "@/lib/generateFlashcards";

const URL_REGEX = /^https?:\/\/.+/i;
const MAX_CHARS = 100_000;

function extractTitleFromText(text: string, sourceUrl: string): string {
    // Try first non-empty line if it looks like a title
    const firstLine = text
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.length > 0 && l.length < 120);

    if (firstLine) return firstLine;

    // Fallback: domain name
    try {
        return new URL(sourceUrl).hostname.replace(/^www\./, "");
    } catch {
        return sourceUrl;
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

    if (!url || !URL_REGEX.test(url)) {
        return NextResponse.json(
            { error: "Invalid URL. Please provide a valid http/https link." },
            { status: 400 }
        );
    }

    // ── 2. Extract article via Jina.ai Reader ─────────────────────
    let rawText: string;
    let title: string;

    try {
        const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
        const headers: Record<string, string> = {
            Accept: "text/plain",
            "X-Return-Format": "text",
        };
        if (process.env.JINA_API_KEY) {
            headers["Authorization"] = `Bearer ${process.env.JINA_API_KEY}`;
        }

        const res = await fetch(jinaUrl, { headers });
        if (!res.ok) {
            return NextResponse.json(
                { error: `Could not read the article (HTTP ${res.status}). Make sure the URL is publicly accessible.` },
                { status: 422 }
            );
        }

        rawText = (await res.text()).trim();

        if (!rawText) {
            return NextResponse.json(
                { error: "The article appears to be empty or could not be extracted." },
                { status: 422 }
            );
        }

        if (rawText.length > MAX_CHARS) {
            return NextResponse.json(
                { error: "The article is too long to process (limit: 100,000 characters)." },
                { status: 422 }
            );
        }

        title = extractTitleFromText(rawText, url);
    } catch (err) {
        console.error("Jina extraction error:", err);
        return NextResponse.json(
            { error: "Failed to fetch the article. Please check the URL and try again." },
            { status: 502 }
        );
    }

    // ── 3. Summarise with Gemini ──────────────────────────────────
    let summary: string;
    let aiTitle: string = title;
    try {
        const raw = await summarize(rawText, "article");
        if (!raw) {
            return NextResponse.json(
                { error: "Could not generate summary. Please try again." },
                { status: 502 }
            );
        }
        ({ title: aiTitle, summary } = extractTitle(raw, title));
    } catch (err) {
        console.error("Gemini error:", err);
        return NextResponse.json(
            { error: "Could not generate summary. Please try again." },
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
            [user.id, aiTitle, "article", url, rawText, summary, false],
            user.id
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Failed to save content." }, { status: 500 });
        }

        const contentId = result.rows[0].id;

        // Fire & forget — don't block the response
        generateFlashcards({ contentId, summary, userId: user.id }).catch(console.error);

        return NextResponse.json({ id: contentId }, { status: 200 });
    } catch (err) {
        console.error("DB error:", err);
        return NextResponse.json({ error: "Failed to save content." }, { status: 500 });
    }
}
