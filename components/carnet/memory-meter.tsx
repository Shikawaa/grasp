import clsx from "clsx";
import type { TapeTone } from "@/components/carnet/tape";
import styles from "@/components/carnet/memory-meter.module.css";

export function MemoryMeter({
  filled,
  tone = "lavender",
}: {
  filled: 0 | 1 | 2 | 3 | 4 | 5;
  tone?: TapeTone;
}) {
  return (
    <span className={clsx(styles.meter, styles[`meter--${tone}`])} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          className={clsx(styles.segment, index < filled && styles.filled)}
          key={index}
        />
      ))}
    </span>
  );
}
