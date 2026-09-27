import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { LoadingStroke } from "@/components/carnet/drawings";
import { getImperfection } from "@/lib/design/imperfections";
import styles from "@/components/carnet/tape-button.module.css";

export type TapeButtonState =
  | "disabled"
  | "focus"
  | "hover"
  | "loading"
  | "pressed"
  | "rest";

type TapeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  disabledReason?: string;
  id: string;
  loadingLabel?: string;
  state?: TapeButtonState;
};

export function TapeButton({
  children,
  className,
  disabled,
  disabledReason,
  id,
  loadingLabel,
  state = "rest",
  ...props
}: TapeButtonProps) {
  const imperfection = getImperfection(id);
  const loading = state === "loading";
  const disabledState = state === "disabled" || Boolean(disabled && !loading);

  if (loading && !loadingLabel) {
    throw new Error("TapeButton requires an accessible loading label.");
  }
  if (disabledState && !disabledReason) {
    throw new Error("TapeButton requires a reason when it is disabled.");
  }
  const accessibleLoadingLabel = loadingLabel ?? "";
  const reasonId = `${id}:disabled-reason`;

  return (
    <span className={styles.root}>
      <button
        {...props}
        aria-busy={loading || undefined}
        aria-describedby={disabledState ? reasonId : props["aria-describedby"]}
        className={clsx(
          styles.button,
          styles[`tilt--${imperfection.angle}`],
          className,
        )}
        data-state={disabledState ? "disabled" : state}
        disabled={disabledState || loading}
        type={props.type ?? "button"}
      >
        {loading ? (
          <>
            <span className={styles.loadingSpace} aria-hidden="true">
              {children}
            </span>
            <span className={styles.loadingDrawing}>
              <LoadingStroke
                id={`${id}:loading`}
                label={accessibleLoadingLabel}
                tone="on-ink"
              />
            </span>
          </>
        ) : (
          children
        )}
      </button>
      {disabledState ? (
        <span className={styles.reason} id={reasonId}>
          {disabledReason}
        </span>
      ) : null}
    </span>
  );
}
