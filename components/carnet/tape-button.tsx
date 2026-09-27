import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { getImperfection } from "@/lib/design/imperfections";
import styles from "@/components/carnet/tape-button.module.css";

export type TapeButtonState = "focus" | "hover" | "loading" | "pressed" | "rest";

type TapeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  id: string;
  state?: TapeButtonState;
};

export function TapeButton({
  children,
  className,
  disabled,
  id,
  state = "rest",
  ...props
}: TapeButtonProps) {
  const imperfection = getImperfection(id);
  const loading = state === "loading";

  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={clsx(
        styles.button,
        styles[`tilt--${imperfection.angle}`],
        className,
      )}
      data-state={state}
      disabled={disabled || loading}
      type={props.type ?? "button"}
    >
      {loading ? (
        <>
          <span className={styles["visually-hidden"]}>{children}</span>
          <span aria-hidden="true">…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
