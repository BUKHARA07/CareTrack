"use client";

import { SEVERITIES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type DiseaseData = {
  id?: string;
  icdCode: string;
  description: string;
  severity: string;
  patientId: string;
};

export default function DiseaseForm({
  initial,
  patients,
  mode,
}: {
  initial?: DiseaseData;
  patients: { id: string; firstName: string; lastName: string }[];
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
        icdCode: formData.get("icdCode"),
        description: formData.get("description"),
        severity: formData.get("severity"),
        patientId: formData.get("patientId"),
      };

      const url = mode === "create" ? "/api/diseases" : `/api/diseases/${initial?.id}`;
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

      router.push("/dashboard/diseases");
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
          ICD code
          <input
            name="icdCode"
            defaultValue={initial?.icdCode}
            required
            className="mrmsInput"
            placeholder="e.g. J06.9"
          />
        </label>
        <label>
          Severity
          <select name="severity" defaultValue={initial?.severity} required className="mrmsSelect">
            <option value="">Select severity</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="fullWidth">
          Description
          <textarea
            name="description"
            defaultValue={initial?.description}
            required
            className="mrmsTextarea"
            rows={3}
          />
        </label>
        <label>
          Patient
          <select name="patientId" defaultValue={initial?.patientId} required className="mrmsSelect">
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mrmsFormActions">
        <button type="submit" className="mrmsBtn primary" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Add diagnosis" : "Save changes"}
        </button>
        <button type="button" className="mrmsBtn" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}

