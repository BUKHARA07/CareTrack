import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canManageDiseases, canViewDiseases } from "@/lib/permissions";
import { forbidden, getSessionRole, unauthorized } from "@/lib/api-auth";

const SEVERITIES = ["Mild", "Moderate", "Severe"];

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
  if (!canViewDiseases(auth.role)) return forbidden();

  const { id } = await params;
  const disease = await prisma.disease.findUnique({
    where: { id },
    include: { patient: { include: { doctor: true } } },
  });

  if (!disease) {
    return NextResponse.json({ error: "Disease record not found." }, { status: 404 });
  }

  return NextResponse.json(disease);
}

export async function PUT(request: Request, { params }: Params) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canManageDiseases(auth.role)) return forbidden();

  const { id } = await params;
  const body = await request.json();
  const { icdCode, description, severity, patientId } = body;

  if (!icdCode?.trim() || !description?.trim() || !severity || !patientId) {
    return NextResponse.json({ error: "All disease fields are required." }, { status: 400 });
  }

  if (!SEVERITIES.includes(severity)) {
    return NextResponse.json({ error: "Invalid severity level." }, { status: 400 });
  }

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    return NextResponse.json({ error: "Patient not found." }, { status: 400 });
  }

  try {
    const disease = await prisma.disease.update({
      where: { id },
      data: {
        icdCode: icdCode.trim(),
        description: description.trim(),
        severity,
        patientId,
      },
    });

    return NextResponse.json(disease);
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json({ error: "Disease record not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update disease record." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canManageDiseases(auth.role)) return forbidden();

  const { id } = await params;
  try {
    await prisma.disease.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json({ error: "Disease record not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete disease record." }, { status: 500 });
  }
}
