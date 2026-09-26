import clsx from "clsx";
import { Highlight } from "@/components/carnet/highlight";
import { Note } from "@/components/carnet/note";
import { Page } from "@/components/carnet/page";
import { PenCircle, PenStrike } from "@/components/carnet/pen-gestures";
import { Tape } from "@/components/carnet/tape";

export type CardTrueFalseCopy = {
  label: string;
  theme: string;
  progress: string;
  question: string;
  wrongAnswer: string;
  rightAnswer: string;
  feedback: string;
};

export function CardTrueFalse({
  className,
  copy,
}: {
  className?: string;
  copy: CardTrueFalseCopy;
}) {
  return (
    <Page className={clsx("review-preview", className)}>
      <div className="review-preview__tape">
        <Tape tone="lavender">{copy.theme}</Tape>
      </div>
      <header className="review-preview__meta">
        <span>{copy.label}</span>
        <span>{copy.progress}</span>
      </header>
      <p className="review-preview__question">{copy.question}</p>
      <div className="review-preview__answers" aria-label={copy.label}>
        <span className="review-preview__answer review-preview__answer--wrong">
          <PenStrike>{copy.wrongAnswer}</PenStrike>
        </span>
        <span className="review-preview__answer">
          <PenCircle>
            <Highlight tone="lavender">{copy.rightAnswer}</Highlight>
          </PenCircle>
        </span>
      </div>
      <Note>{copy.feedback}</Note>
    </Page>
  );
}
