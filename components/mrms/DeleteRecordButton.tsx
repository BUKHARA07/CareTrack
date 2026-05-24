"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteRecordButton({
  endpoint,
  redirectTo,
  label = "Delete",
}: {
  endpoint: string;
  redirectTo: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      setLoading(true);
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert((data as { error?: string }).error ?? "Delete failed.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="mrmsBtn danger"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : label}
    </button>
  );
}

