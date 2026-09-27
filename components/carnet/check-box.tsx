import clsx from "clsx";
import { CheckMark } from "@/components/carnet/drawings";
import styles from "@/components/carnet/check-box.module.css";

export function CheckBox({
  checked = false,
  className,
}: {
  checked?: boolean;
  className?: string;
}) {
  return (
    <span className={clsx(styles.checkbox, className)} aria-hidden="true">
      {checked ? <CheckMark className={styles.check} /> : null}
    </span>
  );
}
