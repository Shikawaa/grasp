"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { resetPassword } from "@/lib/auth/client";
import type { Dictionary } from "@/lib/i18n";
import styles from "@/styles/components.module.css";

export function ResetPasswordForm({ dictionary }: { dictionary: Dictionary }) {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError(dictionary.auth.missingToken);
      return;
    }
    if (newPassword.length < 8) {
      setError(dictionary.auth.passwordTooShort);
      return;
    }
    if (newPassword !== confirmation) {
      setError(dictionary.auth.passwordMismatch);
      return;
    }

    setPending(true);
    try {
      const result = await resetPassword(newPassword, token);
      if (result.error) {
        setError(dictionary.auth.resetError);
        return;
      }
      setDone(true);
    } catch {
      setError(dictionary.auth.resetError);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className={styles["auth-form"]}>
        <p aria-live="polite" className={styles["form-message"]}>
          {dictionary.auth.resetDone}
        </p>
        <Link
          className={`${styles["tape-button"]} ${styles["tape-button--link"]}`}
          href="/sign-in"
        >
          {dictionary.auth.backToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <form className={styles["auth-form"]} onSubmit={handleSubmit}>
      {!searchParams.get("token") ? (
        <label className={styles["auth-field"]}>
          <span>{dictionary.auth.resetToken}</span>
          <input
            autoComplete="off"
            name="token"
            onChange={(event) => setToken(event.target.value)}
            placeholder={dictionary.auth.resetTokenPlaceholder}
            required
            type="text"
            value={token}
          />
        </label>
      ) : null}

      <label className={styles["auth-field"]}>
        <span>{dictionary.auth.newPassword}</span>
        <input
          autoComplete="new-password"
          name="new-password"
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder={dictionary.auth.newPasswordPlaceholder}
          required
          type="password"
          value={newPassword}
        />
      </label>

      <label className={styles["auth-field"]}>
        <span>{dictionary.auth.confirmPassword}</span>
        <input
          autoComplete="new-password"
          name="confirm-password"
          onChange={(event) => setConfirmation(event.target.value)}
          placeholder={dictionary.auth.newPasswordPlaceholder}
          required
          type="password"
          value={confirmation}
        />
      </label>

      {error ? (
        <p aria-live="polite" className={styles["form-message"]}>
          {error}
        </p>
      ) : null}

      <button className={styles["tape-button"]} disabled={pending} type="submit">
        {pending ? dictionary.auth.resetPending : dictionary.auth.resetSubmit}
      </button>
    </form>
  );
}
