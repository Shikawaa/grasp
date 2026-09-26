"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import {
  requestPasswordReset,
  signInWithPassword,
} from "@/lib/auth/client";

export function SignInForm({ dictionary }: { dictionary: Dictionary }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [resetPending, setResetPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [information, setInformation] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setInformation(null);

    try {
      const result = await signInWithPassword(email, password);
      if (result.error) {
        setError(dictionary.auth.invalidCredentials);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError(dictionary.auth.invalidCredentials);
    } finally {
      setPending(false);
    }
  }

  async function handlePasswordReset() {
    if (!email) {
      setError(dictionary.auth.emailRequired);
      return;
    }

    setResetPending(true);
    setError(null);
    setInformation(null);

    try {
      const result = await requestPasswordReset(
        email,
        `${window.location.origin}/reset-password`,
      );
      if (result.error) {
        setError(dictionary.auth.resetRequestError);
        return;
      }
      setInformation(dictionary.auth.resetRequestSent);
    } catch {
      setError(dictionary.auth.resetRequestError);
    } finally {
      setResetPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span>{dictionary.auth.email}</span>
        <input
          autoComplete="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder={dictionary.auth.emailPlaceholder}
          required
          type="email"
          value={email}
        />
      </label>

      <label className="auth-field">
        <span>{dictionary.auth.password}</span>
        <input
          autoComplete="current-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder={dictionary.auth.currentPasswordPlaceholder}
          required
          type="password"
          value={password}
        />
      </label>

      <button
        className="quiet-button"
        disabled={resetPending}
        onClick={handlePasswordReset}
        type="button"
      >
        {resetPending
          ? dictionary.auth.resetRequestPending
          : dictionary.auth.forgotPassword}
      </button>

      {error ? (
        <p aria-live="polite" className="form-message">
          {error}
        </p>
      ) : null}
      {information ? (
        <p aria-live="polite" className="form-message">
          {information}
        </p>
      ) : null}

      <button className="tape-button" disabled={pending} type="submit">
        {pending ? dictionary.auth.submitting : dictionary.auth.submit}
      </button>
    </form>
  );
}
