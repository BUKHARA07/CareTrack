import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canManageDoctors, canViewDoctors } from "@/lib/permissions";
import { forbidden, getSessionRole, unauthorized } from "@/lib/api-auth";

export async function GET(request: Request) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canViewDoctors(auth.role)) return forbidden();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const department = searchParams.get("department")?.trim();

  const doctors = await prisma.doctor.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { specialty: { contains: q, mode: "insensitive" } },
                { department: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        department
          ? { department: { equals: department, mode: "insensitive" } }
          : {},
      ],
    },
    include: { _count: { select: { patients: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(doctors);
}

export async function POST(request: Request) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canManageDoctors(auth.role)) return forbidden();

  const body = await request.json();
  const { name, specialty, department, email, phone } = body;

  if (!name?.trim() || !specialty?.trim() || !department?.trim() || !email?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "All doctor fields are required." }, { status: 400 });
  }

  const doctor = await prisma.doctor.create({
    data: {
      name: name.trim(),
      specialty: specialty.trim(),
      department: department.trim(),
      email: email.trim(),
      phone: phone.trim(),
    },
  });

  return NextResponse.json(doctor, { status: 201 });
}
