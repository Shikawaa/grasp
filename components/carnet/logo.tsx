import Image from "next/image";

export function Logo({ label }: { label: string }) {
  return (
    <div className="wordmark" aria-label={label}>
      <span className="wordmark__symbol" aria-hidden="true">
        <Image fill priority sizes="1em" src="/brand/grasp-symbol.svg" alt="" />
      </span>
      <span className="wordmark__name">
        <svg
          className="wordmark__highlight"
          viewBox="0 0 200 20"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M3 12 C 60 7, 130 15, 197 9" />
        </svg>
        <span>{label}</span>
      </span>
    </div>
  );
}
