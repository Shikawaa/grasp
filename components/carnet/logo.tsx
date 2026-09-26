import Image from "next/image";

export function Logo({ label }: { label: string }) {
  return (
    <Image
      className="wordmark"
      src="/brand/grasp-logo.svg"
      width={8081}
      height={1603}
      priority
      alt={label}
    />
  );
}
