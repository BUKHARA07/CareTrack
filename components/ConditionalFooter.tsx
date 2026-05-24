"use client";

import { usePathname } from "next/navigation";
import MyFooter from "@/components/foooter";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up")
  ) {
    return null;
  }
  return <MyFooter />;
}
