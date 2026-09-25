import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { PublicShareSummary } from "@/components/public-share-summary";
import { PublicShareFlashcards } from "@/components/public-share-flashcards";

interface ContentRow {
    id: string;
    title: string | null;
    type: string | null;
    source_url: string | null;
    summary: string | null;
    created_at: string;
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

export default async function PublicSharePage({
    params,
}: {
    params: { token: string };
}) {
    // 1. Fetch content via dedicated SECURITY DEFINER function
    let content: ContentRow | null = null;
    try {
        const contentRes = await query<ContentRow>(
            "SELECT id, title, type, source_url, summary, created_at FROM get_public_share_content($1::uuid)",
            [params.token]
        );
        content = contentRes.rows[0] || null;
    } catch (err) {
        console.error("Error fetching shared content:", err);
    }

    if (!content) {
        notFound();
    }

    // 2. Fetch public flashcards for this shared content
    let flashcards: Flashcard[] = [];
    try {
        const flashcardsRes = await query<Flashcard>(
            `SELECT id, question, answer, status 
             FROM public.flashcards 
             WHERE content_id = $1 
             ORDER BY created_at ASC`,
            [content.id]
        );
        flashcards = flashcardsRes.rows;
    } catch (err) {
        console.error("Error fetching shared flashcards:", err);
    }

    const displayTitle = content.title ?? content.source_url ?? "Untitled";
    const createdDate = new Date(content.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="min-h-screen bg-[#080914] text-[#F4F4F5]">
            {/* Header with Logo */}
            <header className="flex items-center h-16 px-6 border-b border-[rgba(79,70,229,0.15)] bg-[#080914]">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/grasp-logo.svg"
                        alt="Grasp"
                        width={32}
                        height={32}
                        priority
                    />
                    <span className="font-semibold text-lg tracking-tight">Grasp</span>
                </Link>
            </header>

            {/* Main Content Area */}
            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* Meta block */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-4 leading-tight">{displayTitle}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#A1A1AA]">
                        <Badge
                            variant="secondary"
                            className="bg-[rgba(79,70,229,0.1)] text-[#4F46E5] border-0 text-xs font-medium"
                        >
                            {typeLabel(content.type)}
                        </Badge>
                        {content.source_url && (
                            <a
                                href={content.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 hover:text-white transition-colors truncate max-w-[200px] sm:max-w-xs"
                            >
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{content.source_url}</span>
                            </a>
                        )}
                        <span>{createdDate}</span>
                    </div>
                </div>

                {/* Summary Section */}
                {content.summary && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-6 text-white border-b border-[rgba(79,70,229,0.15)] pb-3">Summary</h2>
                        <PublicShareSummary summary={content.summary} />
                    </div>
                )}

                {/* Flashcards Section */}
                {flashcards.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-6 text-white border-b border-[rgba(79,70,229,0.15)] pb-3">Flashcards</h2>
                        <PublicShareFlashcards flashcards={flashcards} />
                    </div>
                )}
            </main>
        </div>
    );
}
