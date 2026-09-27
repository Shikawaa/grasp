import { LoadingStroke, PenCircle } from "@/components/carnet/drawings";
import { Highlight } from "@/components/carnet/highlight";
import { Note } from "@/components/carnet/note";
import { TapeButton } from "@/components/carnet/tape-button";
import styles from "@/components/carnet/week-strip.module.css";

export type WeekDay = {
  done: boolean;
  id: string;
  isToday: boolean;
  label: string;
};

type WeekStripProps =
  | {
      days: readonly WeekDay[];
      state?: "normal";
      summary: string;
    }
  | {
      label: string;
      state: "empty" | "loading";
    }
  | {
      label: string;
      retryId: string;
      retryLabel: string;
      state: "error";
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
      <div className={styles.error} role="alert">
        <Note>{props.label}</Note>
        <TapeButton id={props.retryId}>{props.retryLabel}</TapeButton>
      </div>
    );
  }

  if ("days" in props) return (
    <div className={styles.wrapper}>
      <ol className={styles.days}>
        {props.days.map((day) => (
          <li className={!day.done && !day.isToday ? styles.future : undefined} key={day.id}>
            {day.isToday ? (
              <PenCircle variant="round">
                {day.done ? <Highlight>{day.label}</Highlight> : day.label}
              </PenCircle>
            ) : day.done ? (
              <Highlight>{day.label}</Highlight>
            ) : day.label}
          </li>
        ))}
      </ol>
      <Note small>{props.summary}</Note>
    </div>
  );

  return null;
}
