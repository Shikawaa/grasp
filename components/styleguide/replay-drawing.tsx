"use client";

import { useState } from "react";
import { DrawOnce } from "@/components/carnet/draw-once";
import { HandDrawnArrow, LoadingStroke } from "@/components/carnet/drawings";
import { SecondaryAction } from "@/components/carnet/secondary-action";
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
          <DrawOnce id={`styleguide:draw-once:${iteration}`} immediate>
            <HandDrawnArrow
              direction="right"
              id={`styleguide:draw-once:arrow:${iteration}`}
            />
          </DrawOnce>
        ) : (
          <LoadingStroke
            id={`styleguide:loading-stroke:${iteration}`}
            label={loadingLabel}
          />
        )}
      </div>
      <SecondaryAction
        onClick={() => setIteration((current) => current + 1)}
      >
        {replayLabel}
      </SecondaryAction>
    </div>
  );
}
