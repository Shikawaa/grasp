import clsx from "clsx";
import styles from "@/components/carnet/tally.module.css";

export function Tally({
  count,
  label,
}: {
  count: number;
  label: string;
}) {
  const safeCount = Math.max(0, Math.floor(count));

  return (
    <span className={styles.tally} role="img" aria-label={label}>
      {Array.from({ length: safeCount }, (_, index) => (
        <span
          className={clsx(styles.mark, (index + 1) % 5 === 0 && styles.fifth)}
          key={index}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
