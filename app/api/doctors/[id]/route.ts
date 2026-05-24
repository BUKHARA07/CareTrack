import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canManageDoctors, canViewDoctors } from "@/lib/permissions";
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
  if (!canViewDoctors(auth.role)) return forbidden();

  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      patients: { include: { _count: { select: { diseases: true } } } },
    },
  });

  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
  }

  return NextResponse.json(doctor);
}

export async function PUT(request: Request, { params }: Params) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canManageDoctors(auth.role)) return forbidden();

  const { id } = await params;
  const body = await request.json();
  const { name, specialty, department, email, phone } = body;
  if (!name?.trim() || !specialty?.trim() || !department?.trim() || !email?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "All doctor fields are required." }, { status: 400 });
  }

  try {
    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        name: name.trim(),
        specialty: specialty.trim(),
        department: department.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
    });

    return NextResponse.json(doctor);
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update doctor." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canManageDoctors(auth.role)) return forbidden();

  const { id } = await params;
  const patientCount = await prisma.patient.count({ where: { doctorId: id } });

  if (patientCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete doctor with assigned patients. Reassign patients first." },
      { status: 400 },
    );
  }

  try {
    await prisma.doctor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete doctor." }, { status: 500 });
  }
}
