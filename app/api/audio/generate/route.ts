import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";
import { uploadFile } from "@/lib/storage";
import { execFile } from "child_process";
import { readFileSync, unlinkSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

function generateTTS(text: string): Promise<{ file: string; size: number }> {
    return new Promise((resolve, reject) => {
        const workerPath = path.join(process.cwd(), "scripts", "tts-worker.js");
        const child = execFile("node", [workerPath], { timeout: 55000 }, (error, stdout, stderr) => {
            if (error) {
                const errLines = (stderr || "").trim().split("\n").filter(Boolean);
                const errMsg = errLines[errLines.length - 1] || error.message;
                reject(new Error(errMsg));
                return;
            }
            try {
                resolve(JSON.parse(stdout));
            } catch {
                reject(new Error("Invalid TTS worker output"));
            }
        });
        child.stdin?.write(JSON.stringify({ text }));
        child.stdin?.end();
    });
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { content_id, force_regenerate } = body;

        if (!content_id) {
            return NextResponse.json({ error: "Missing content_id" }, { status: 400 });
        }

        // 1. Verify content ownership
        const contentRes = await query(
            "SELECT id, summary, audio_url FROM public.contents WHERE id = $1 AND user_id = $2",
            [content_id, user.id],
            user.id
        );

        if (contentRes.rows.length === 0) {
            return NextResponse.json({ error: "Content not found or unauthorized" }, { status: 404 });
        }

        const content = contentRes.rows[0];

        // 2. Return existing if present (idempotent), unless forcing regeneration
        if (content.audio_url && !force_regenerate) {
            return NextResponse.json({ audio_url: content.audio_url });
        }

        // 3. Ensure we have a summary
        if (!content.summary) {
            return NextResponse.json({ error: "No summary available" }, { status: 400 });
        }

        // 4. Generate TTS via child process (bypasses Next.js webpack)
        let ttsResult: { file: string; size: number };
        try {
            ttsResult = await generateTTS(content.summary);
        } catch (ttsError: any) {
            console.error("[Audio] TTS error:", ttsError.message);
            return NextResponse.json(
                { error: "Failed to generate audio: " + ttsError.message },
                { status: 500 }
            );
        }

        // 5. Read temp file
        let audioBuffer: Buffer;
        try {
            audioBuffer = readFileSync(ttsResult.file);
            unlinkSync(ttsResult.file);
        } catch {
            return NextResponse.json({ error: "Failed to read generated audio file" }, { status: 500 });
        }

        // 6. Validate MP3 header
        const header = audioBuffer.slice(0, 4).toString("hex");
        const validPrefixes = ["fffb", "fff3", "fff2", "fffa", "ffe0", "ffe1", "4944"];
        if (!validPrefixes.some((p) => header.startsWith(p))) {
            return NextResponse.json({ error: "Generated audio is not valid MP3" }, { status: 500 });
        }

        // 7. Upload to Neon Object Storage
        const filePath = `${user.id}/${content.id}.mp3`;
        let publicUrl: string;
        try {
            publicUrl = await uploadFile("audio", filePath, audioBuffer, "audio/mpeg");
        } catch (uploadError) {
            console.error("[Audio] S3 upload error:", uploadError);
            return NextResponse.json({ error: "Failed to upload audio to storage" }, { status: 500 });
        }

        // 8. Save audio URL to DB
        try {
            await query(
                "UPDATE public.contents SET audio_url = $1 WHERE id = $2 AND user_id = $3",
                [publicUrl, content.id, user.id],
                user.id
            );
        } catch (updateError) {
            console.error("[Audio] DB update error:", updateError);
            return NextResponse.json({ error: "Failed to save audio URL" }, { status: 500 });
        }

        return NextResponse.json({ audio_url: publicUrl });
    } catch (err: any) {
        console.error("[Audio] Unhandled error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
