import { auth } from "@/auth";
import DoctorForm from "@/components/mrms/DoctorForm";
import PageHeader from "@/components/mrms/PageHeader";
import { canManageDoctors } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function NewDoctorPage() {
  const session = await auth();
  if (!session?.user || !canManageDoctors(session.user.role)) redirect("/dashboard/doctors");

  return (
    <>
      <PageHeader title="Add doctor" description="Create a new doctor profile for CareTrack Clinic." />
      <section className="dashPanel mrmsFormPanel">
        <DoctorForm mode="create" />
      </section>
    </>
  );
}
