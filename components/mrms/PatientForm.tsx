"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type PatientData = {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  doctorId: string;
};

export default function PatientForm({
  initial,
  doctors,
  mode,
}: {
  initial?: PatientData;
  doctors: { id: string; name: string; department: string }[];
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dobValue = initial?.dateOfBirth
    ? new Date(initial.dateOfBirth).toISOString().split("T")[0]
    : "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);

      const formData = new FormData(e.currentTarget);
      const payload = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        dateOfBirth: formData.get("dateOfBirth") || null,
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        doctorId: formData.get("doctorId"),
      };

      const url = mode === "create" ? "/api/patients" : `/api/patients/${initial?.id}`;
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

      const finalId = data?.id || initial?.id;
      if (mode === "create") {
        router.push("/dashboard/patients");
        router.refresh();
      } else {
        router.push(`/dashboard/patients/${finalId}`);
        router.refresh();
      }
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
          First name
          <input name="firstName" defaultValue={initial?.firstName} required className="mrmsInput" />
        </label>
        <label>
          Last name
          <input name="lastName" defaultValue={initial?.lastName} required className="mrmsInput" />
        </label>
        <label>
          Date of birth
          <input name="dateOfBirth" type="date" defaultValue={dobValue} className="mrmsInput" />
        </label>
        <label>
          Email
          <input name="email" type="email" defaultValue={initial?.email ?? ""} className="mrmsInput" />
        </label>
        <label>
          Phone
          <input name="phone" defaultValue={initial?.phone ?? ""} className="mrmsInput" />
        </label>
        <label>
          Address
          <input name="address" defaultValue={initial?.address ?? ""} className="mrmsInput" />
        </label>
        <label>
          Assigned doctor
          <select name="doctorId" defaultValue={initial?.doctorId} required className="mrmsSelect">
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} - {d.department}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mrmsFormActions">
        <button type="submit" className="mrmsBtn primary" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Register patient" : "Save changes"}
        </button>
        <button type="button" className="mrmsBtn" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}

