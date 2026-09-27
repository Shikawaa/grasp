import { PenCircle } from "@/components/carnet/drawings";
import { Highlight } from "@/components/carnet/highlight";
import { LoadingStroke } from "@/components/carnet/drawings";
import { Note } from "@/components/carnet/note";
import styles from "@/components/carnet/week-strip.module.css";

export type WeekDay = {
  id: string;
  label: string;
  status: "done" | "future" | "today";
};

type WeekStripProps =
  | {
      days: readonly WeekDay[];
      state?: "normal";
      summary: string;
    }
  | {
      label: string;
      state: "empty" | "error" | "loading";
    };

export function WeekStrip(props: WeekStripProps) {
  if (props.state === "loading") {
    return <LoadingStroke label={props.label} />;
  }

  if (props.state === "empty") {
    return <Note>{props.label}</Note>;
  }

  if (props.state === "error") {
    return (
      <p className={styles.error} role="alert">
        <PenCircle variant="round">{props.label}</PenCircle>
      </p>
    );
  }

  if ("days" in props) return (
    <div className={styles.wrapper}>
      <ol className={styles.days}>
        {props.days.map((day) => (
          <li className={styles[day.status]} key={day.id}>
            {day.status === "done" ? (
              <Highlight>{day.label}</Highlight>
            ) : day.status === "today" ? (
              <PenCircle variant="round">{day.label}</PenCircle>
            ) : (
              day.label
            )}
          </li>
        ))}
      </ol>
      <Note small>{props.summary}</Note>
    </div>
  );

  return null;
}
