import { auth } from "@/auth";
import PageHeader from "@/components/mrms/PageHeader";
import PatientForm from "@/components/mrms/PatientForm";
import { prisma } from "@/lib/prisma";
import { canCreatePatients } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function NewPatientPage() {
  const session = await auth();
  if (!session?.user || !canCreatePatients(session.user.role)) redirect("/dashboard/patients");

  const doctors = await prisma.doctor.findMany({
    select: { id: true, name: true, department: true },
    orderBy: { name: "asc" },
  });

  if (doctors.length === 0) {
    return (
      <p className="authAlert error">
        No doctors available. An administrator must add doctors before registering patients.
      </p>
    );
  }

  return (
    <>
      <PageHeader title="Register patient" description="Submit a new patient registration for CareTrack Clinic." />
      <section className="dashPanel mrmsFormPanel">
        <PatientForm mode="create" doctors={doctors} />
      </section>
    </>
  );
}
