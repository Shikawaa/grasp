import { LoadingStroke, PenCircle } from "@/components/carnet/drawings";
import { Highlight } from "@/components/carnet/highlight";
import { Note } from "@/components/carnet/note";
import { SecondaryAction } from "@/components/carnet/secondary-action";
import styles from "@/components/carnet/week-strip.module.css";

export type WeekDay = {
  accessibleLabel: string;
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
    return <LoadingStroke id="dictionary:week-strip:loading" label={props.label} />;
  }

  if (props.state === "empty") {
    return <Note>{props.label}</Note>;
  }

  if (props.state === "error") {
    return (
      <div className={styles.error} role="alert">
        <Note>{props.label}</Note>
        <SecondaryAction id={props.retryId}>{props.retryLabel}</SecondaryAction>
      </div>
    );
  }

  if ("days" in props) return (
    <div className={styles.wrapper}>
      <ol className={styles.days}>
        {props.days.map((day) => (
          <li
            aria-label={day.accessibleLabel}
            className={!day.done && !day.isToday ? styles.future : undefined}
            key={day.id}
          >
            <span aria-hidden="true">
              {day.isToday ? (
                <PenCircle id={`weekday:${day.id}`} variant="round">
                  {day.done ? <Highlight>{day.label}</Highlight> : day.label}
                </PenCircle>
              ) : day.done ? (
                <Highlight>{day.label}</Highlight>
              ) : day.label}
            </span>
          </li>
        ))}
      </ol>
      <Note small>{props.summary}</Note>
    </div>
  );

  return null;
}
