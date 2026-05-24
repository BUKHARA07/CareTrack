import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function HEAD() {
  const session = await auth();

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  return new Response(null, { status: 200 });
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ ok: false }, { status: 401 });
  }

  return Response.json({ ok: true }, { status: 200 });
}
