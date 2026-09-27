import { Highlight } from "@/components/carnet/highlight";
import { MemoryMeter } from "@/components/carnet/memory-meter";
import { Tape } from "@/components/carnet/tape";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { themeColorFamilies } from "@/lib/design/theme-colors";
import styles from "@/components/styleguide/theme-colors-section.module.css";

export function ThemeColorsSection({
  copy,
  locale,
}: {
  copy: Dictionary["styleguide"];
  locale: Locale;
}) {
  const numberFormat = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  return (
    <section className={styles.section} aria-labelledby="styleguide-theme-colors">
      <header className={styles.heading}>
        <h2 id="styleguide-theme-colors">{copy.sections.colors}</h2>
        <p>{copy.themeColors.description}</p>
      </header>
      <div className={styles.families}>
        {themeColorFamilies.map(({ colors, family }) => (
          <section className={styles.family} data-theme-color-family={family} key={family}>
            <h3>{copy.themeColors.families[family]}</h3>
            <div className={styles.grid}>
              {colors.map(({ contrastWithInk, tone }) => {
                const name = copy.themeColors.names[tone];

                return (
                  <article
                    className={styles.color}
                    data-contrast-with-ink={contrastWithInk}
                    data-theme-color={tone}
                    key={tone}
                  >
                    <header>
                      <h4>{name}</h4>
                      <code>{`--highlight-${tone}`}</code>
                    </header>
                    <div className={styles.samples}>
                      <Tape id={`styleguide:theme-color:${tone}`} tone={tone}>
                        {name}
                      </Tape>
                      <Highlight tone={tone}>{name}</Highlight>
                      <div className={styles.meter}>
                        <span>{copy.themeColors.memorySample}</span>
                        <MemoryMeter
                          filled={4}
                          label={copy.themeColors.memoryLabel}
                          tone={tone}
                        />
                      </div>
                    </div>
                    <dl>
                      <dt>{copy.themeColors.contrastLabel}</dt>
                      <dd>
                        <data value={contrastWithInk}>
                          {numberFormat.format(contrastWithInk)}:1
                        </data>
                      </dd>
                    </dl>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
