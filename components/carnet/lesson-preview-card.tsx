import { Highlight } from "@/components/carnet/highlight";
import { Page } from "@/components/carnet/page";
import { Tape } from "@/components/carnet/tape";
import styles from "@/styles/components.module.css";

export type LessonPreviewCopy = {
  theme: string;
  progress: string;
  title: string;
  sentence: string;
  sentenceHighlight: string;
};

function HighlightedSentence({
  highlight,
  sentence,
}: {
  highlight: string;
  sentence: string;
}) {
  const highlightStart = sentence.indexOf(highlight);
  if (highlightStart < 0) return sentence;

  const highlightEnd = highlightStart + highlight.length;
  return (
    <>
      {sentence.slice(0, highlightStart)}
      <Highlight tone="sky">{highlight}</Highlight>
      {sentence.slice(highlightEnd)}
    </>
  );
}

export function LessonPreviewCard({ copy }: { copy: LessonPreviewCopy }) {
  return (
    <Page className={styles["lesson-preview"]}>
      <div className={styles["lesson-preview__tape"]}>
        <Tape id="landing:psychology" tone="sky">
          {copy.theme}
        </Tape>
      </div>
      <p className={styles["lesson-preview__meta"]}>{copy.progress}</p>
      <h2 className={styles["lesson-preview__title"]}>{copy.title}</h2>
      <p className={styles["lesson-preview__sentence"]}>
        <HighlightedSentence
          highlight={copy.sentenceHighlight}
          sentence={copy.sentence}
        />
      </p>
    </Page>
  );
}
