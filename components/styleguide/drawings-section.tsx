import { DrawOnce } from "@/components/carnet/draw-once";
import {
  CheckMark,
  HandDrawnArrow,
  HandDrawnLoop,
  LoadingStroke,
  MarkerUnderline,
  PenCircle,
  PenStrike,
} from "@/components/carnet/drawings";
import { ComponentSheet } from "@/components/styleguide/component-sheet";
import type { Dictionary } from "@/lib/i18n";
import styles from "@/components/styleguide/drawings-section.module.css";

export function DrawingsSection({ copy }: { copy: Dictionary["styleguide"] }) {
  const labels = copy.labels;

  return (
    <section className={styles.section} aria-labelledby="styleguide-drawings">
      <header className={styles.heading}>
        <h2 id="styleguide-drawings">{copy.sections.drawings}</h2>
        <p>{copy.drawings.description}</p>
      </header>
      <div className={styles.grid}>
        <ComponentSheet
          labels={labels}
          name={copy.drawings.arrow.name}
          states={labels.staticState}
          usage={copy.drawings.arrow.usage}
          variants={copy.drawings.arrow.variants}
        >
          <div className={styles.row}>
            <HandDrawnArrow direction="up" />
            <HandDrawnArrow direction="right" />
            <HandDrawnArrow direction="down" />
          </div>
        </ComponentSheet>

        <ComponentSheet
          labels={labels}
          name={copy.drawings.circle.name}
          states={labels.staticState}
          usage={copy.drawings.circle.usage}
          variants={copy.drawings.circle.variants}
        >
          <div className={styles.words}>
            <PenCircle>{copy.drawings.sampleChoice}</PenCircle>
            <PenCircle variant="round">{copy.drawings.sampleChoice}</PenCircle>
          </div>
        </ComponentSheet>

        <ComponentSheet
          labels={labels}
          name={copy.drawings.check.name}
          states={labels.staticState}
          usage={copy.drawings.check.usage}
          variants={copy.drawings.check.variants}
        >
          <div className={styles.row}>
            <CheckMark />
            <CheckMark variant="long" />
          </div>
        </ComponentSheet>

        <ComponentSheet
          labels={labels}
          name={copy.drawings.strike.name}
          states={labels.staticState}
          usage={copy.drawings.strike.usage}
          variants={copy.drawings.strike.variants}
        >
          <div className={styles.words}>
            <PenStrike>{copy.drawings.sampleWrong}</PenStrike>
            <PenStrike variant="double">{copy.drawings.sampleWrong}</PenStrike>
          </div>
        </ComponentSheet>

        <ComponentSheet
          labels={labels}
          name={copy.drawings.loop.name}
          states={labels.staticState}
          usage={copy.drawings.loop.usage}
          variants={copy.drawings.loop.variants}
        >
          <div className={styles.row}>
            <HandDrawnLoop />
            <HandDrawnLoop direction="right" />
          </div>
        </ComponentSheet>

        <ComponentSheet
          labels={labels}
          name={copy.drawings.underline.name}
          states={labels.staticState}
          usage={copy.drawings.underline.usage}
          variants={copy.drawings.underline.variants}
        >
          <div className={styles.underlines}>
            <MarkerUnderline />
            <MarkerUnderline tone="lavender" />
            <MarkerUnderline tone="sky" />
          </div>
        </ComponentSheet>

        <ComponentSheet
          labels={labels}
          name={copy.drawings.drawOnce.name}
          states={labels.drawOnceState}
          usage={copy.drawings.drawOnce.usage}
          variants={copy.drawings.drawOnce.variants}
        >
          <DrawOnce id="styleguide:draw-once">
            <HandDrawnArrow direction="right" />
          </DrawOnce>
        </ComponentSheet>

        <ComponentSheet
          labels={labels}
          name={copy.drawings.loadingStroke.name}
          states={labels.loadingState}
          usage={copy.drawings.loadingStroke.usage}
          variants={copy.drawings.loadingStroke.variants}
        >
          <LoadingStroke label={copy.drawings.loadingStroke.label} />
        </ComponentSheet>
      </div>
    </section>
  );
}
