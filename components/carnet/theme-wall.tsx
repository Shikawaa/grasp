import { Note } from "@/components/carnet/note";
import { Tape, type TapeTone } from "@/components/carnet/tape";
import styles from "@/styles/components.module.css";

export type ThemeWallCopy = {
  title: string;
  note: string;
  topics: readonly string[];
};

const tapeTones: readonly TapeTone[] = [
  "lavender",
  "sky",
  "honey",
  "sage",
  "rose",
  "lagoon",
  "apricot",
  "mauve",
];

const tapeSeeds = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function ThemeWall({ copy }: { copy: ThemeWallCopy }) {
  return (
    <section className={styles["theme-wall"]} aria-labelledby="theme-wall-title">
      <div className={styles["section-heading"]}>
        <h2 id="theme-wall-title">{copy.title}</h2>
        <Note>{copy.note}</Note>
      </div>
      <ul className={styles["theme-wall__list"]}>
        {copy.topics.map((topic, index) => (
          <li key={topic}>
            <Tape seed={tapeSeeds[index]} tone={tapeTones[index]}>
              {topic}
            </Tape>
          </li>
        ))}
      </ul>
    </section>
  );
}
