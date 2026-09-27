import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { CheckMark } from "@/components/carnet/drawings";
import styles from "@/components/carnet/check-box.module.css";

type CheckBoxState = "focus" | "hover" | "pressed" | "rest";

export function CheckBox({
  checked = false,
  className,
  label,
  state = "rest",
  ...props
}: {
  checked?: boolean;
  className?: string;
  label: string;
  state?: CheckBoxState;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">) {
  return (
    <button
      {...props}
      aria-checked={checked}
      aria-label={label}
      className={clsx(styles.control, className)}
      data-state={state}
      role="checkbox"
      type={props.type ?? "button"}
    >
      <span className={styles.checkbox} aria-hidden="true">
        {checked ? <CheckMark className={styles.check} /> : null}
      </span>
    </button>
  );
}
