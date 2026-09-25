import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { query } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import { FlipCardReview } from "@/components/flip-card-review";

interface Flashcard {
    id: string;
    question: string;
    answer: string;
    status: "new" | "known" | "review";
}

export default async function ReviewPage({
    params,
}: {
    params: { id: string };
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    // Verify content ownership
    const contentRes = await query(
        "SELECT id, title FROM public.contents WHERE id = $1 AND user_id = $2 LIMIT 1",
        [params.id, user.id],
        user.id
    );

    if (contentRes.rows.length === 0) redirect("/");

    // Fetch only cards that need reviewing
    const flashcardRes = await query<Flashcard>(
        "SELECT id, question, answer, status FROM public.flashcards WHERE content_id = $1 AND status IN ('new', 'review') ORDER BY created_at ASC",
        [params.id],
        user.id
    );

    const flashcards = flashcardRes.rows;

    // All cards already known
    if (flashcards.length === 0) {
        return (
            <div className="min-h-screen bg-[#080914] flex flex-col items-center justify-center px-6">
                <Link
                    href={`/content/${params.id}`}
                    className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#A1A1AA] transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to content
                </Link>
                <div className="text-center space-y-4">
                    <p className="text-4xl">🎉</p>
                    <h1 className="text-2xl font-bold text-[#F4F4F5]">All caught up!</h1>
                    <p className="text-[#6B7280] text-sm">All flashcards are marked as known.</p>
                    <Link
                        href={`/content/${params.id}`}
                        className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                    >
                        Back to content
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080914] flex flex-col px-6 py-8">
            {/* Back arrow */}
            <Link
                href={`/content/${params.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#A1A1AA] transition-colors mb-10 self-start"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to content
            </Link>

            {/* Flip card review */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <FlipCardReview contentId={params.id} initialCards={flashcards} />
            </div>
        </div>
    );
}
