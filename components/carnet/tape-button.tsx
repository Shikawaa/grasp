import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { LoadingStroke } from "@/components/carnet/drawings";
import { getImperfection } from "@/lib/design/imperfections";
import styles from "@/components/carnet/tape-button.module.css";

export type TapeButtonState = "focus" | "hover" | "loading" | "pressed" | "rest";

type TapeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  id: string;
  loadingLabel?: string;
  state?: TapeButtonState;
};

export function TapeButton({
  children,
  className,
  disabled,
  id,
  loadingLabel,
  state = "rest",
  ...props
}: TapeButtonProps) {
  const imperfection = getImperfection(id);
  const loading = state === "loading";

  if (loading && !loadingLabel) {
    throw new Error("TapeButton requires an accessible loading label.");
  }
  const accessibleLoadingLabel = loadingLabel ?? "";

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
          <span className={styles.loadingSpace} aria-hidden="true">
            {children}
          </span>
          <span className={styles.loadingDrawing}>
            <LoadingStroke label={accessibleLoadingLabel} tone="on-ink" />
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
