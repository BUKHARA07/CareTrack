import { auth } from "@/auth";
import PageHeader from "@/components/mrms/PageHeader";
import { prisma } from "@/lib/prisma";
import {
  canManageDiseases,
  canUpdatePatients,
  canViewPatients,
} from "@/lib/permissions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function PatientProfilePage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const role = session.user.role;
  if (!canViewPatients(role)) redirect("/dashboard");

  const { id } = await params;
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      doctor: true,
      diseases: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!patient) notFound();

  return (
    <>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        description="View and manage patient medical records, doctor assignments, and clinical history."
        action={
          canUpdatePatients(role)
            ? { label: "Edit patient", href: `/dashboard/patients/${id}/edit` }
            : undefined
        }
      />

      <section className="mrmsProfileGrid">
        <article className="dashPanel">
          <div className="dashPanelHead">
            <h2>Personal details</h2>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <dl className="mrmsDl">
              <dt>Email</dt>
              <dd>{patient.email ?? "-"}</dd>
              <dt>Phone</dt>
              <dd>{patient.phone ?? "-"}</dd>
              <dt>Date of birth</dt>
              <dd>
                {patient.dateOfBirth
                  ? new Date(patient.dateOfBirth).toLocaleDateString()
                  : "-"}
              </dd>
              <dt>Address</dt>
              <dd>{patient.address ?? "-"}</dd>
            </dl>
          </div>
        </article>

        <article className="dashPanel">
          <div className="dashPanelHead">
            <h2>Assigned doctor</h2>
          </div>
          <div style={{ padding: "18px 20px" }}>
            {patient.doctor ? (
              <dl className="mrmsDl">
                <dt>Name</dt>
                <dd>{patient.doctor.name}</dd>
                <dt>Specialty</dt>
                <dd>{patient.doctor.specialty}</dd>
                <dt>Department</dt>
                <dd>{patient.doctor.department}</dd>
                <dt>Email</dt>
                <dd>{patient.doctor.email}</dd>
                <dt>Phone</dt>
                <dd>{patient.doctor.phone}</dd>
              </dl>
            ) : (
              <p className="mrmsEmpty">No linked doctor (record missing).</p>
            )}
          </div>
        </article>
      </section>

      <section className="dashPanel">
        <div className="dashPanelHead">
          <h2>Diagnosis history</h2>
          {canManageDiseases(role) && (
            <Link
              href={`/dashboard/diseases/new?patientId=${id}`}
              className="dashPanelBtn"
            >
              + Add diagnosis
            </Link>
          )}
        </div>
        <div className="mrmsTableWrap">
          <table className="mrmsTable">
            <thead>
              <tr>
                <th>ICD code</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Recorded</th>
              </tr>
            </thead>
            <tbody>
              {patient.diseases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="mrmsEmpty">
                    No diagnoses recorded.
                  </td>
                </tr>
              ) : (
                patient.diseases.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <b>{d.icdCode}</b>
                    </td>
                    <td>{d.description}</td>
                    <td>
                      <span
                        className={`mrmsSeverity ${d.severity.toLowerCase()}`}
                      >
                        {d.severity}
                      </span>
                    </td>
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
