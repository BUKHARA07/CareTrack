import { auth } from "@/auth";
import DiseaseForm from "@/components/mrms/DiseaseForm";
import PageHeader from "@/components/mrms/PageHeader";
import { prisma } from "@/lib/prisma";
import { canManageDiseases } from "@/lib/permissions";
import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ patientId?: string }> };

export default async function NewDiseasePage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || !canManageDiseases(session.user.role)) redirect("/dashboard/diseases");

  const { patientId } = await searchParams;
  const patients = await prisma.patient.findMany({
    select: { id: true, firstName: true, lastName: true },
    orderBy: { lastName: "asc" },
  });

  if (patients.length === 0) {
    return (
      <p className="authAlert error">
        No patients available. Register patients before recording diagnoses.
      </p>
    );
  }

  return (
    <>
      <PageHeader title="Record diagnosis" description="Add a disease/diagnosis record linked to a patient." />
      <section className="dashPanel mrmsFormPanel">
        <DiseaseForm
          mode="create"
          patients={patients}
          initial={
            patientId
              ? { icdCode: "", description: "", severity: "", patientId }
              : undefined
          }
        />
      </section>
    </>
  );
}
