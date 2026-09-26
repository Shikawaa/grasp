import clsx from "clsx";

export function MemoryMeter({ filled }: { filled: 0 | 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className="memory-meter" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          className={clsx("memory-meter__segment", index < filled && "is-filled")}
          key={index}
        />
      ))}
    </span>
  );
}
