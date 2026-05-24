"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);

      const formData = new FormData(e.currentTarget);
      const payload = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
        role: formData.get("role") as string,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "Registration failed.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/sign-in?registered=true");
        return;
      }

      router.push("/dashboard");
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
        <h2>Create account</h2>
        <p>
          Staff access for <b>CareTrack Clinic</b> MRMS
        </p>
      </div>

      {error && (
        <p className="authAlert error" role="alert">
          {error}
        </p>
      )}

      <form className="authForm" onSubmit={handleSubmit}>
        <div className="inputArea">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            required
            autoComplete="name"
          />
        </div>

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
            placeholder="At least 6 characters"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <div className="inputArea">
          <label htmlFor="confirmPassword">Repeat Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <div className="inputArea">
          <label htmlFor="role">Staff role</label>
          <select id="role" name="role" required defaultValue="">
            <option value="" disabled>
              Choose your role
            </option>
            <option value="Administrator">Administrator - full access</option>
            <option value="Clinician">Clinician - patients and diagnoses</option>
            <option value="Receptionist">Receptionist - register patients</option>
          </select>
        </div>

        <label className="authCheckbox" htmlFor="terms">
          <input id="terms" type="checkbox" required />
          I agree to the terms of service and privacy policy
        </label>

        <button type="submit" className="authSubmit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="authSwitch">
        Already have an account? <Link href="/sign-in">Login here</Link>
      </p>
    </div>
  );
}

