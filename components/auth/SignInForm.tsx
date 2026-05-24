"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const registered = searchParams.get("registered") === "true";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);

      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authCard">
      <div className="authCardHead">
        <h2>Sign in</h2>
        <p>
          Sign in to <b>CareTrack MRMS</b>
        </p>
      </div>

      {registered && (
        <p className="authAlert success" role="status">
          Account created successfully. You can sign in now.
        </p>
      )}

      {error && (
        <p className="authAlert error" role="alert">
          {error}
        </p>
      )}

      <form className="authForm" onSubmit={handleSubmit}>
        <div className="inputArea">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="inputArea">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </div>

        <ul className="authFormRow">
          <label htmlFor="remember">
            <input id="remember" name="remember" type="checkbox" />
            Remember me
          </label>
          <Link href="/sign-in">Forgot password?</Link>
        </ul>

        <button type="submit" className="authSubmit" disabled={loading}>
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="authSwitch">
        Don&apos;t have an account? <Link href="/sign-up">Register here</Link>
      </p>
    </div>
  );
}

