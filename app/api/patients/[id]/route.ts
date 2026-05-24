import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  canDeletePatients,
  canUpdatePatients,
  canViewPatients,
} from "@/lib/permissions";
import { forbidden, getSessionRole, unauthorized } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };
type PrismaLikeError = { code?: string };

function isNotFoundError(error: unknown): error is PrismaLikeError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as PrismaLikeError).code === "P2025"
  );
}

export async function GET(_request: Request, { params }: Params) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canViewPatients(auth.role)) return forbidden();

  const { id } = await params;
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      doctor: true,
      diseases: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found." }, { status: 404 });
  }

  return NextResponse.json(patient);
}

export async function PUT(request: Request, { params }: Params) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canUpdatePatients(auth.role)) return forbidden();

  const { id } = await params;
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

  try {
    const patient = await prisma.patient.update({
      where: { id },
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

    return NextResponse.json(patient);
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update patient." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canDeletePatients(auth.role)) return forbidden();

  const { id } = await params;
  try {
    await prisma.disease.deleteMany({ where: { patientId: id } });
    await prisma.patient.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete patient." }, { status: 500 });
  }
}
