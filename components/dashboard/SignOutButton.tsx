"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      className="dashPanelBtn"
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
    >
      Sign out
    </button>
  );
}
