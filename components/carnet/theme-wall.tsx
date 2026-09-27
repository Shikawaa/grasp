import { Note } from "@/components/carnet/note";
import { isTapeTone, Tape } from "@/components/carnet/tape";
import styles from "@/styles/components.module.css";

export type ThemeWallCopy = {
  title: string;
  note: string;
  topics: readonly {
    id: string;
    label: string;
    tone: string;
  }[];
};

export function ThemeWall({ copy }: { copy: ThemeWallCopy }) {
  return (
    <section className={styles["theme-wall"]} aria-labelledby="theme-wall-title">
      <div className={styles["section-heading"]}>
        <h2 id="theme-wall-title">{copy.title}</h2>
        <Note>{copy.note}</Note>
      </div>
      <ul className={styles["theme-wall__list"]}>
        {copy.topics.map((topic) => {
          if (!isTapeTone(topic.tone)) {
            throw new Error(`Unknown tape tone for topic ${topic.id}`);
          }

          return (
            <li key={topic.id}>
              <Tape
                className={styles["theme-tape"]}
                id={topic.id}
                tone={topic.tone}
              >
                {topic.label}
              </Tape>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
