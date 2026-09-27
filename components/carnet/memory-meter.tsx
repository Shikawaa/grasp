import clsx from "clsx";
import type { TapeTone } from "@/components/carnet/tape";
import styles from "@/components/carnet/memory-meter.module.css";

export function MemoryMeter({
  filled,
  label,
  tone = "lavender",
}: {
  filled: 0 | 1 | 2 | 3 | 4 | 5;
  label: string;
  tone?: TapeTone;
}) {
  return (
    <span
      aria-label={label}
      className={clsx(styles.meter, styles[`meter--${tone}`])}
      role="img"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          aria-hidden="true"
          className={clsx(styles.segment, index < filled && styles.filled)}
          key={index}
        />
      ))}
    </span>
  );
}
