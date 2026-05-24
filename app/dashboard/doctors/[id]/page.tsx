import { auth } from "@/auth";
import PageHeader from "@/components/mrms/PageHeader";
import { prisma } from "@/lib/prisma";
import { canManageDoctors, canViewPatients } from "@/lib/permissions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function DoctorProfilePage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const role = session.user.role;

  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      patients: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          _count: { select: { diseases: true } },
        },
        orderBy: { lastName: "asc" },
      },
    },
  });

  if (!doctor) notFound();

  return (
    <>
      <PageHeader
        title={doctor.name}
        description="View doctor profile, specialty, and assigned patients."
        action={
          canManageDoctors(role)
            ? { label: "Edit doctor", href: `/dashboard/doctors/${id}/edit` }
            : undefined
        }
      />

      <section className="mrmsProfileGrid">
        <article className="dashPanel">
          <div className="dashPanelHead">
            <h2>Professional details</h2>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <dl className="mrmsDl">
              <dt>Specialty</dt>
              <dd>{doctor.specialty ?? "-"}</dd>
              <dt>Department</dt>
              <dd>{doctor.department ?? "-"}</dd>
              <dt>Email</dt>
              <dd>{doctor.email ?? "-"}</dd>
              <dt>Phone</dt>
              <dd>{doctor.phone ?? "-"}</dd>
            </dl>
          </div>
        </article>

        <article className="dashPanel">
          <div className="dashPanelHead">
            <h2>Overview</h2>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <dl className="mrmsDl">
              <dt>Total patients</dt>
              <dd>{doctor.patients.length}</dd>
              <dt>Status</dt>
              <dd>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    backgroundColor: "#d4edda",
                    color: "#155724",
                  }}
                >
                  Active
                </span>
              </dd>
            </dl>
          </div>
        </article>
      </section>

      {canViewPatients(role) && (
        <section className="dashPanel">
          <div className="dashPanelHead">
            <h2>Assigned patients</h2>
          </div>
          <div className="mrmsTableWrap">
            <table className="mrmsTable">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Diagnoses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctor.patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="mrmsEmpty">
                      No patients assigned.
                    </td>
                  </tr>
                ) : (
                  doctor.patients.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <b>
                          {p.firstName} {p.lastName}
                        </b>
                      </td>
                      <td>{p.email ?? "-"}</td>
                      <td>{p.phone ?? "-"}</td>
                      <td>{p._count.diseases}</td>
                      <td className="mrmsActions">
                        <Link
                          href={`/dashboard/patients/${p.id}`}
                          className="mrmsBtn sm"
                        >
                          View profile
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
