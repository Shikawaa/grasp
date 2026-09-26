import Image from "next/image";
import styles from "@/styles/components.module.css";

export function Logo({ label }: { label: string }) {
  return (
    <Image
      className={styles.wordmark}
      src="/brand/grasp-logo.svg"
      width={8081}
      height={1603}
      priority
      alt={label}
    />
  );
}
