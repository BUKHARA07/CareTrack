import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function getSessionRole() {
  const session = await auth();
  if (!session?.user?.role) return null;
  return { session, role: session.user.role };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
