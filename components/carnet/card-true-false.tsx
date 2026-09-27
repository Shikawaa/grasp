import clsx from "clsx";
import { PenCircle, PenStrike } from "@/components/carnet/drawings";
import { Highlight } from "@/components/carnet/highlight";
import { Note } from "@/components/carnet/note";
import { Page } from "@/components/carnet/page";
import { Tape } from "@/components/carnet/tape";
import styles from "@/styles/components.module.css";

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
    <Page className={clsx(styles["review-preview"], className)}>
      <div className={styles["review-preview__tape"]}>
        <Tape tone="lavender">{copy.theme}</Tape>
      </div>
      <header className={styles["review-preview__meta"]}>
        <span>{copy.label}</span>
        <span>{copy.progress}</span>
      </header>
      <p className={styles["review-preview__question"]}>{copy.question}</p>
      <div className={styles["review-preview__answers"]} aria-label={copy.label}>
        <span
          className={`${styles["review-preview__answer"]} ${styles["review-preview__answer--wrong"]}`}
        >
          <PenStrike>{copy.wrongAnswer}</PenStrike>
        </span>
        <span className={styles["review-preview__answer"]}>
          <PenCircle>
            <Highlight tone="lavender">{copy.rightAnswer}</Highlight>
          </PenCircle>
        </span>
      </div>
      <Note>{copy.feedback}</Note>
    </Page>
  );
}
