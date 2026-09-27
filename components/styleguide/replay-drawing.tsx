"use client";

import { useState } from "react";
import { DrawOnce } from "@/components/carnet/draw-once";
import { HandDrawnArrow, LoadingStroke } from "@/components/carnet/drawings";
import styles from "@/components/styleguide/replay-drawing.module.css";

export function ReplayDrawing({
  kind,
  loadingLabel,
  replayLabel,
}: {
  kind: "draw-once" | "loading";
  loadingLabel: string;
  replayLabel: string;
}) {
  const [iteration, setIteration] = useState(0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.drawing} key={iteration}>
        {kind === "draw-once" ? (
          <DrawOnce id={`styleguide:draw-once:${iteration}`}>
            <HandDrawnArrow direction="right" />
          </DrawOnce>
        ) : (
          <LoadingStroke label={loadingLabel} />
        )}
      </div>
      <button
        className={styles.replay}
        onClick={() => setIteration((current) => current + 1)}
        type="button"
      >
        {replayLabel}
      </button>
    </div>
  );
}
