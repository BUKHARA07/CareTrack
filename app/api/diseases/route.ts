import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canManageDiseases, canViewDiseases } from "@/lib/permissions";
import { forbidden, getSessionRole, unauthorized } from "@/lib/api-auth";

const SEVERITIES = ["Mild", "Moderate", "Severe"];

export async function GET(request: Request) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canViewDiseases(auth.role)) return forbidden();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const severity = searchParams.get("severity")?.trim();
  const patientId = searchParams.get("patientId")?.trim();

  const diseases = await prisma.disease.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { icdCode: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        severity ? { severity: { equals: severity, mode: "insensitive" } } : {},
        patientId ? { patientId } : {},
      ],
    },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(diseases);
}

export async function POST(request: Request) {
  const auth = await getSessionRole();
  if (!auth) return unauthorized();
  if (!canManageDiseases(auth.role)) return forbidden();

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

  const disease = await prisma.disease.create({
    data: {
      icdCode: icdCode.trim(),
      description: description.trim(),
      severity,
      patientId,
    },
    include: {
      patient: { select: { firstName: true, lastName: true } },
    },
  });

  return NextResponse.json(disease, { status: 201 });
}
