import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import styles from "@/components/carnet/secondary-action.module.css";

export type SecondaryActionState = "focus" | "hover" | "pressed" | "rest";

export function SecondaryAction({
  children,
  className,
  state = "rest",
  ...props
}: {
  children: ReactNode;
  state?: SecondaryActionState;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      {...props}
      className={clsx(styles.action, className)}
      data-state={state}
      type={props.type ?? "button"}
    >
      {children}
    </button>
  );
}
