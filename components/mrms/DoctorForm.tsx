"use client";

import { DEPARTMENTS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type DoctorData = {
  id?: string;
  name: string;
  specialty: string;
  department: string;
  email: string;
  phone: string;
};

export default function DoctorForm({
  initial,
  mode,
}: {
  initial?: DoctorData;
  mode: "create" | "edit";
}) {
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
        name: formData.get("name"),
        specialty: formData.get("specialty"),
        department: formData.get("department"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      };

      const url = mode === "create" ? "/api/doctors" : `/api/doctors/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "Save failed.");
        return;
      }

      router.push("/dashboard/doctors");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mrmsForm" onSubmit={handleSubmit}>
      {error && <p className="authAlert error">{error}</p>}
      <div className="mrmsFormGrid">
        <label>
          Full name
          <input name="name" defaultValue={initial?.name} required className="mrmsInput" />
        </label>
        <label>
          Specialty
          <input name="specialty" defaultValue={initial?.specialty} required className="mrmsInput" />
        </label>
        <label>
          Department
          <select name="department" defaultValue={initial?.department} required className="mrmsSelect">
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label>
          Email
          <input name="email" type="email" defaultValue={initial?.email} required className="mrmsInput" />
        </label>
        <label>
          Phone
          <input name="phone" defaultValue={initial?.phone} required className="mrmsInput" />
        </label>
      </div>
      <div className="mrmsFormActions">
        <button type="submit" className="mrmsBtn primary" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create doctor" : "Save changes"}
        </button>
        <button type="button" className="mrmsBtn" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}

