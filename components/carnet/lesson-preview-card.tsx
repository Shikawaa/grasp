import { Highlight } from "@/components/carnet/highlight";
import { Page } from "@/components/carnet/page";
import { Tape } from "@/components/carnet/tape";
import styles from "@/styles/components.module.css";

export type LessonPreviewCopy = {
  theme: string;
  progress: string;
  title: string;
  sentenceBefore: string;
  sentenceHighlight: string;
  sentenceAfter: string;
};

export function LessonPreviewCard({ copy }: { copy: LessonPreviewCopy }) {
  return (
    <Page className={styles["lesson-preview"]}>
      <div className={styles["lesson-preview__tape"]}>
        <Tape seed={2} tone="sky">
          {copy.theme}
        </Tape>
      </div>
      <p className={styles["lesson-preview__meta"]}>{copy.progress}</p>
      <h2 className={styles["lesson-preview__title"]}>{copy.title}</h2>
      <p className={styles["lesson-preview__sentence"]}>
        {copy.sentenceBefore} <Highlight tone="sky">{copy.sentenceHighlight}</Highlight>{" "}
        {copy.sentenceAfter}
      </p>
    </Page>
  );
}
