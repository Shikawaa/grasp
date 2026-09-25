import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";
import { geminiModel } from "@/lib/gemini";

const SYSTEM_PROMPT = `You are a learning assistant. Answer questions strictly based on the following content summary. Be concise and pedagogical. If the answer is not in the summary, say so honestly. Always respond in English.`;

const MAX_HISTORY = 10;

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const { content_id, messages: history, user_message } = body ?? {};

    if (!content_id || !user_message) {
        return NextResponse.json({ error: "Missing content_id or user_message" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch summary server-side — never trust the client
    const contentRes = await query(
        "SELECT id, summary FROM public.contents WHERE id = $1 AND user_id = $2 LIMIT 1",
        [content_id, user.id],
        user.id
    );

    const content = contentRes.rows[0];

    if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 });

    if (!content.summary) {
        return NextResponse.json({
            reply: "This content doesn't have a summary yet. Try importing it again.",
        });
    }

    // Build prompt with summary + conversation history
    const contextBlock = `${SYSTEM_PROMPT}\n\n--- CONTENT SUMMARY ---\n${content.summary}\n--- END SUMMARY ---`;

    const conversationHistory = Array.isArray(history)
        ? history
            .slice(-MAX_HISTORY)
            .map((m: { role: string; body: string }) =>
                `${m.role === "user" ? "User" : "Assistant"}: ${m.body}`
            )
            .join("\n\n")
        : "";

    const fullPrompt = conversationHistory
        ? `${contextBlock}\n\n--- CONVERSATION HISTORY ---\n${conversationHistory}\n--- END HISTORY ---\n\nUser: ${user_message}`
        : `${contextBlock}\n\nUser: ${user_message}`;

    // Call Gemini
    let reply: string;
    try {
        const result = await geminiModel.generateContent(fullPrompt);
        reply = result.response.text();
        if (!reply) throw new Error("Empty response from Gemini");
    } catch (err) {
        console.error("[chat/contextual] Gemini error:", err);
        return NextResponse.json({ error: "Failed to generate reply" }, { status: 502 });
    }

    // Persist both messages in Postgres
    try {
        await query(
            "INSERT INTO public.messages (content_id, user_id, role, body) VALUES ($1, $2, $3, $4)",
            [content_id, user.id, "user", user_message],
            user.id
        );
        await query(
            "INSERT INTO public.messages (content_id, user_id, role, body) VALUES ($1, $2, $3, $4)",
            [content_id, user.id, "assistant", reply],
            user.id
        );
    } catch (insertError) {
        console.error("[chat/contextual] DB insert error:", insertError);
    }

    return NextResponse.json({ reply });
}
