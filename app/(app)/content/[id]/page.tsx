import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";
import { getSignedPdfUrl } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowLeft, FileText } from "lucide-react";
import { ContentTitleEditor } from "@/components/content-title-editor";
import { ContentDeleteButton } from "@/components/content-delete-button";
import { ContentShareButton } from "@/components/content-share-button";
import { AudioPlayer } from "@/components/audio-player";
import { ContentTabs } from "@/components/content-tabs";

interface ContentRow {
    id: string;
    title: string | null;
    type: string | null;
    source_url: string | null;
    summary: string | null;
    created_at: string;
    user_id: string;
    share_token: string | null;
    audio_url: string | null;
}

interface Flashcard {
    id: string;
    question: string;
    answer: string;
    status: "new" | "known" | "review";
}

function typeLabel(type: string | null): string {
    switch (type) {
        case "youtube": return "YouTube";
        case "article": return "Article";
        case "pdf": return "PDF";
        default: return type ?? "Content";
    }
}

export default async function ContentPage({
    params,
}: {
    params: { id: string };
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const [contentRes, flashcardsRes] = await Promise.all([
        query<ContentRow>(
            `SELECT id, title, type, source_url, summary, created_at, user_id, share_token, audio_url
             FROM public.contents
             WHERE id = $1 AND user_id = $2
             LIMIT 1`,
            [params.id, user.id],
            user.id
        ),
        query<Flashcard>(
            `SELECT id, question, answer, status
             FROM public.flashcards
             WHERE content_id = $1
             ORDER BY created_at ASC`,
            [params.id],
            user.id
        ),
    ]);

    const content = contentRes.rows[0] || null;

    if (!content) {
        redirect("/");
    }

    const flashcards = flashcardsRes.rows;

    // For PDFs: generate a presigned URL from Neon Object Storage (valid 1 hour)
    let pdfSignedUrl: string | null = null;
    if (content.type === "pdf") {
        try {
            pdfSignedUrl = await getSignedPdfUrl(`${user.id}/${content.id}.pdf`, 3600);
        } catch (err) {
            console.error("Error generating presigned PDF URL:", err);
        }
    }

    const displayTitle = content.title ?? content.source_url ?? "Untitled";
    const createdDate = new Date(content.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 pt-10 pb-10">
            <div className="mb-8 w-full">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Library
                </Link>

                {/* Title + actions row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-4">
                    <ContentTitleEditor contentId={content.id} initialTitle={displayTitle} />
                    <div className="flex items-center gap-2">
                        <ContentShareButton contentId={content.id} initialToken={content.share_token} />
                        <ContentDeleteButton contentId={content.id} />
                    </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-0 text-xs font-medium"
                >
                    {typeLabel(content.type)}
                </Badge>
                {content.source_url && (
                    <a
                        href={content.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors max-w-[160px] sm:max-w-xs"
                    >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{content.source_url}</span>
                    </a>
                )}
                {pdfSignedUrl && (
                    <a
                        href={pdfSignedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        View PDF
                    </a>
                )}
                <span>{createdDate}</span>
                </div>
                
                {/* Audio Generation + Player */}
                <div className="mt-8">
                    <AudioPlayer contentId={content.id} initialAudioUrl={content.audio_url} title={displayTitle} />
                </div>
            </div>

            {/* Summary + Flashcards tabs */}
            <div className="mt-8 w-full">
                <ContentTabs contentId={content.id} summary={content.summary} initialFlashcards={flashcards} />
            </div>
        </div>
    );
}
