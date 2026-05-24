import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  canCreatePatients,
  canViewPatients,
} from "@/lib/permissions";
import { forbidden, getSessionRole, unauthorized } from "@/lib/api-auth";

export async function GET(request: Request) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canViewPatients(auth.role)) return forbidden();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const doctorId = searchParams.get("doctorId")?.trim();

  const patients = await prisma.patient.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { firstName: { contains: q, mode: "insensitive" } },
                { lastName: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        doctorId ? { doctorId } : {},
      ],
    },
    include: {
      doctor: { select: { id: true, name: true, department: true } },
      _count: { select: { diseases: true } },
    },
    orderBy: { lastName: "asc" },
  });

  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canCreatePatients(auth.role)) return forbidden();

  const body = await request.json();
  const { firstName, lastName, dateOfBirth, email, phone, address, doctorId } = body;

  if (!firstName?.trim() || !lastName?.trim() || !doctorId) {
    return NextResponse.json(
      { error: "First name, last name and assigned doctor are required." },
      { status: 400 },
    );
  }

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) {
    return NextResponse.json({ error: "Assigned doctor not found." }, { status: 400 });
  }

  const patient = await prisma.patient.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      doctorId,
    },
    include: { doctor: { select: { name: true } } },
  });

  return NextResponse.json(patient, { status: 201 });
}
