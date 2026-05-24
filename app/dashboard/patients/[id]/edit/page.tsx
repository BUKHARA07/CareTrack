import { auth } from "@/auth";
import PageHeader from "@/components/mrms/PageHeader";
import PatientForm from "@/components/mrms/PatientForm";
import { prisma } from "@/lib/prisma";
import { canUpdatePatients } from "@/lib/permissions";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditPatientPage({ params }: Props) {
  const session = await auth();
  if (!session?.user || !canUpdatePatients(session.user.role)) redirect("/dashboard/patients");

  const { id } = await params;
  const [patient, doctors] = await Promise.all([
    prisma.patient.findUnique({ where: { id } }),
    prisma.doctor.findMany({
      select: { id: true, name: true, department: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!patient) notFound();

  return (
    <>
      <PageHeader title="Edit patient" description={`Update record for ${patient.firstName} ${patient.lastName}.`} />
      <section className="dashPanel mrmsFormPanel">
        <PatientForm
          mode="edit"
          initial={{
            ...patient,
            dateOfBirth: patient.dateOfBirth?.toISOString() ?? null,
          }}
          doctors={doctors}
        />
      </section>
    </>
  );
}
