import { getTallyGeometry } from "@/lib/design/drawing-geometry";
import styles from "@/components/carnet/tally.module.css";

export function Tally({
  count,
  id,
  label,
}: {
  count: number;
  id: string;
  label: string;
}) {
  const geometry = getTallyGeometry(id, count);

  return (
    <span className={styles.tally} data-tally role="img" aria-label={label}>
      <svg
        aria-hidden="true"
        className={styles.drawing}
        preserveAspectRatio="xMinYMid meet"
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      >
        {geometry.groups.map((group, groupIndex) => (
          <g key={`${id}:group:${groupIndex}`}>
            {group.verticals.map((mark, markIndex) => (
              <line
                className={styles.mark}
                key={`${id}:group:${groupIndex}:mark:${markIndex}`}
                x1={mark.start.x}
                x2={mark.end.x}
                y1={mark.start.y}
                y2={mark.end.y}
              />
            ))}
            {group.diagonal ? (
              <line
                className={styles.mark}
                data-tally-diagonal
                x1={group.diagonal.start.x}
                x2={group.diagonal.end.x}
                y1={group.diagonal.start.y}
                y2={group.diagonal.end.y}
              />
            ) : null}
          </g>
        ))}
      </svg>
    </span>
  );
}
