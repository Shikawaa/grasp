import type { ReactNode } from "react";
import styles from "@/components/styleguide/component-sheet.module.css";

type SheetLabels = {
  states: string;
  usage: string;
  variants: string;
};

export function ComponentSheet({
  children,
  codeName,
  labels,
  name,
  states,
  usage,
  variants,
}: {
  children: ReactNode;
  codeName: string;
  labels: SheetLabels;
  name: string;
  states: string;
  usage: string;
  variants: string;
}) {
  return (
    <article className={styles.sheet} data-component-sheet>
      <header className={styles.header}>
        <h3>
          {name} <span aria-hidden="true">—</span> <code>{codeName}</code>
        </h3>
      </header>
      <div className={styles.preview}>{children}</div>
      <dl className={styles.details}>
        <div>
          <dt>{labels.usage}</dt>
          <dd>{usage}</dd>
        </div>
        <div>
          <dt>{labels.variants}</dt>
          <dd>{variants}</dd>
        </div>
        <div>
          <dt>{labels.states}</dt>
          <dd>{states}</dd>
        </div>
      </dl>
    </article>
  );
}
