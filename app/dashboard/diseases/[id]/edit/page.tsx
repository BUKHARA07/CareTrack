import { auth } from "@/auth";
import DiseaseForm from "@/components/mrms/DiseaseForm";
import PageHeader from "@/components/mrms/PageHeader";
import { prisma } from "@/lib/prisma";
import { canManageDiseases } from "@/lib/permissions";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditDiseasePage({ params }: Props) {
  const session = await auth();
  if (!session?.user || !canManageDiseases(session.user.role)) redirect("/dashboard/diseases");

  const { id } = await params;
  const [disease, patients] = await Promise.all([
    prisma.disease.findUnique({ where: { id } }),
    prisma.patient.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: "asc" },
    }),
  ]);

  if (!disease) notFound();

  return (
    <>
      <PageHeader title="Edit diagnosis" description={`Update record ${disease.icdCode}.`} />
      <section className="dashPanel mrmsFormPanel">
        <DiseaseForm mode="edit" initial={disease} patients={patients} />
      </section>
    </>
  );
}
