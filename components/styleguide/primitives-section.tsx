import { CheckBox } from "@/components/carnet/check-box";
import { Highlight } from "@/components/carnet/highlight";
import { MemoryMeter } from "@/components/carnet/memory-meter";
import { Note } from "@/components/carnet/note";
import { Page } from "@/components/carnet/page";
import { Tally } from "@/components/carnet/tally";
import { Tape } from "@/components/carnet/tape";
import { TapeButton, type TapeButtonState } from "@/components/carnet/tape-button";
import { WeekStrip, type WeekDay } from "@/components/carnet/week-strip";
import { ComponentSheet } from "@/components/styleguide/component-sheet";
import type { Dictionary } from "@/lib/i18n";
import styles from "@/components/styleguide/primitives-section.module.css";

const weekDayDefinitions = [
  { done: true, id: "monday", isToday: false },
  { done: true, id: "tuesday", isToday: false },
  { done: true, id: "wednesday", isToday: false },
  { done: true, id: "thursday", isToday: true },
  { done: false, id: "friday", isToday: false },
  { done: false, id: "saturday", isToday: false },
  { done: false, id: "sunday", isToday: false },
] as const;

export function PrimitivesSection({ copy }: { copy: Dictionary["styleguide"] }) {
  const labels = copy.labels;
  const primitives = copy.primitives;
  const weekDays = weekDayDefinitions.map((day, index) => ({
    ...day,
    label: primitives.weekStrip.weekdays[index] ?? "",
  })) satisfies WeekDay[];
  const buttonStates: readonly { label: string; state: TapeButtonState }[] = [
    { label: labels.normal, state: "rest" },
    { label: labels.hover, state: "hover" },
    { label: labels.focus, state: "focus" },
    { label: labels.pressed, state: "pressed" },
    { label: labels.loading, state: "loading" },
  ];

  return (
    <section className={styles.section} aria-labelledby="styleguide-primitives">
      <header className={styles.heading}>
        <h2 id="styleguide-primitives">{copy.sections.primitives}</h2>
        <p>{primitives.description}</p>
      </header>

      <div className={styles.grid}>
        <ComponentSheet
          codeName={primitives.page.codeName}
          labels={labels}
          name={primitives.page.name}
          states={primitives.staticStates}
          usage={primitives.page.usage}
          variants={primitives.page.variants}
        >
          <Page color="rose" id="styleguide:page:sample">
            <p className={styles.pageText}>{primitives.page.sample}</p>
          </Page>
        </ComponentSheet>

        <ComponentSheet
          codeName={primitives.tape.codeName}
          labels={labels}
          name={primitives.tape.name}
          states={primitives.staticStates}
          usage={primitives.tape.usage}
          variants={primitives.tape.variants}
        >
          <div className={styles.tapes}>
            <Tape id="styleguide:tape:history" tone="lavender">
              {primitives.tape.samples.history}
            </Tape>
            <Tape id="styleguide:tape:science" tone="sage">
              {primitives.tape.samples.science}
            </Tape>
            <Tape id="styleguide:tape:psychology" tone="sky">
              {primitives.tape.samples.psychology}
            </Tape>
          </div>
        </ComponentSheet>

        <ComponentSheet
          codeName={primitives.tapeButton.codeName}
          labels={labels}
          name={primitives.tapeButton.name}
          states={primitives.tapeButton.states}
          usage={primitives.tapeButton.usage}
          variants={primitives.tapeButton.variants}
        >
          <div className={styles.stateGrid}>
            {buttonStates.map(({ label, state }) => (
              <StateSample key={state} label={label}>
                <TapeButton
                  id="styleguide:tape-button:primary"
                  loadingLabel={primitives.tapeButton.loadingLabel}
                  state={state}
                >
                  {primitives.tapeButton.label}
                </TapeButton>
              </StateSample>
            ))}
            <StateSample label={labels.error}>
              <Note small>{labels.notApplicable}</Note>
            </StateSample>
          </div>
        </ComponentSheet>

        <ComponentSheet
          codeName={primitives.highlight.codeName}
          labels={labels}
          name={primitives.highlight.name}
          states={primitives.staticStates}
          usage={primitives.highlight.usage}
          variants={primitives.highlight.variants}
        >
          <div className={styles.highlights}>
            <Highlight>{primitives.highlight.sample}</Highlight>
            <Highlight tone="lavender">{primitives.highlight.sample}</Highlight>
            <Highlight animated tone="sky">
              {primitives.highlight.sample}
            </Highlight>
          </div>
        </ComponentSheet>

        <ComponentSheet
          codeName={primitives.checkBox.codeName}
          labels={labels}
          name={primitives.checkBox.name}
          states={primitives.checkBox.states}
          usage={primitives.checkBox.usage}
          variants={primitives.checkBox.variants}
        >
          <div className={styles.checkBoxStates}>
            {[false, true].map((checked) => (
              <div className={styles.variantGroup} key={String(checked)}>
                <h4>{checked ? primitives.checkBox.checked : primitives.checkBox.unchecked}</h4>
                <div className={styles.stateGrid}>
                  {(["rest", "hover", "focus", "pressed"] as const).map((state) => (
                    <StateSample
                      key={state}
                      label={state === "rest" ? labels.normal : labels[state]}
                    >
                      <CheckBox
                        checked={checked}
                        label={primitives.checkBox.label}
                        state={state}
                      />
                    </StateSample>
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.stateGrid}>
              <StateSample label={labels.loading}>
                <Note small>{labels.notApplicable}</Note>
              </StateSample>
              <StateSample label={labels.error}>
                <Note small>{labels.notApplicable}</Note>
              </StateSample>
            </div>
          </div>
        </ComponentSheet>

        <ComponentSheet
          codeName={primitives.tally.codeName}
          labels={labels}
          name={primitives.tally.name}
          states={primitives.tally.states}
          usage={primitives.tally.usage}
          variants={primitives.tally.variants}
        >
          <div className={styles.stateGrid}>
            <StateSample label={labels.normal}>
              <Tally count={5} label={primitives.tally.five} />
            </StateSample>
            <StateSample label={primitives.tally.eight}>
              <Tally count={8} label={primitives.tally.eight} />
            </StateSample>
            <StateSample label={labels.empty}>
              <Tally count={0} label={primitives.tally.empty} />
            </StateSample>
          </div>
        </ComponentSheet>

        <ComponentSheet
          codeName={primitives.weekStrip.codeName}
          labels={labels}
          name={primitives.weekStrip.name}
          states={primitives.weekStrip.states}
          usage={primitives.weekStrip.usage}
          variants={primitives.weekStrip.variants}
        >
          <div className={styles.weekStates}>
            <StateSample label={labels.normal}>
              <WeekStrip days={weekDays} summary={primitives.weekStrip.summary} />
            </StateSample>
            <StateSample label={labels.loading}>
              <WeekStrip label={primitives.weekStrip.loading} state="loading" />
            </StateSample>
            <StateSample label={labels.empty}>
              <WeekStrip label={primitives.weekStrip.empty} state="empty" />
            </StateSample>
            <StateSample label={labels.error}>
              <WeekStrip
                label={primitives.weekStrip.error}
                retryId="styleguide:week-strip:retry"
                retryLabel={primitives.weekStrip.retry}
                state="error"
              />
            </StateSample>
          </div>
        </ComponentSheet>

        <ComponentSheet
          codeName={primitives.memoryMeter.codeName}
          labels={labels}
          name={primitives.memoryMeter.name}
          states={primitives.memoryMeter.states}
          usage={primitives.memoryMeter.usage}
          variants={primitives.memoryMeter.variants}
        >
          <div className={styles.stateGrid}>
            <StateSample label={labels.normal}>
              <MemoryMeter filled={4} tone="lavender" />
            </StateSample>
            <StateSample label={labels.empty}>
              <MemoryMeter filled={0} tone="sky" />
            </StateSample>
          </div>
        </ComponentSheet>

        <ComponentSheet
          codeName={primitives.note.codeName}
          labels={labels}
          name={primitives.note.name}
          states={primitives.staticStates}
          usage={primitives.note.usage}
          variants={primitives.note.variants}
        >
          <div className={styles.notes}>
            <Note>{primitives.note.normal}</Note>
            <Note small>{primitives.note.small}</Note>
          </div>
        </ComponentSheet>
      </div>
    </section>
  );
}

function StateSample({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className={styles.stateSample}>
      <span className={styles.stateLabel}>{label}</span>
      <div className={styles.statePreview}>{children}</div>
    </div>
  );
}
