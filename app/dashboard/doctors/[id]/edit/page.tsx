import { auth } from "@/auth";
import DoctorForm from "@/components/mrms/DoctorForm";
import PageHeader from "@/components/mrms/PageHeader";
import { prisma } from "@/lib/prisma";
import { canManageDoctors } from "@/lib/permissions";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditDoctorPage({ params }: Props) {
  const session = await auth();
  if (!session?.user || !canManageDoctors(session.user.role)) redirect("/dashboard/doctors");

  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) notFound();

  return (
    <>
      <PageHeader title="Edit doctor" description={`Update profile for ${doctor.name}.`} />
      <section className="dashPanel mrmsFormPanel">
        <DoctorForm mode="edit" initial={doctor} />
      </section>
    </>
  );
}
