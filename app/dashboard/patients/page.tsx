import { auth } from "@/auth";
import DeleteRecordButton from "@/components/mrms/DeleteRecordButton";
import PageHeader from "@/components/mrms/PageHeader";
import SearchFilters from "@/components/mrms/SearchFilters";
import TablePagination from "@/components/mrms/TablePagination";
import { getPagination, parsePageParam } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import {
  canCreatePatients,
  canDeletePatients,
  canUpdatePatients,
  canViewPatients,
} from "@/lib/permissions";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ q?: string; doctorId?: string; page?: string }>;
};

export default async function PatientsPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const role = session.user.role;
  if (!canViewPatients(role)) redirect("/dashboard");

  const { q = "", doctorId = "", page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);
  const doctors = await prisma.doctor.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const where = {
    AND: [
      q
        ? {
            OR: [
              { firstName: { contains: q, mode: "insensitive" as const } },
              { lastName: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      doctorId ? { doctorId } : {},
    ],
  };

  const totalCount = await prisma.patient.count({ where });
  const { currentPage, totalPages, skip, take } = getPagination(page, totalCount);

  const patients = await prisma.patient.findMany({
    where,
    include: {
      doctor: { select: { name: true, department: true } },
      _count: { select: { diseases: true } },
    },
    orderBy: { lastName: "asc" },
    skip,
    take,
  });

  return (
    <>
      <PageHeader
        title="Patients"
        description="View and manage patient records and assigned doctors."
        action={
          canCreatePatients(role)
            ? { label: "+ Register patient", href: "/dashboard/patients/new" }
            : undefined
        }
      />
      <SearchFilters q={q} doctorId={doctorId} doctors={doctors} showDoctor />
      <section className="dashPanel">
        <div className="mrmsTableWrap">
          <table className="mrmsTable">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Assigned doctor</th>
                <th>Diagnoses</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="mrmsEmpty">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/dashboard/patients/${p.id}`}>
                        <b>
                          {p.firstName} {p.lastName}
                        </b>
                      </Link>
                    </td>
                    <td>
                      {p.doctor ? (
                        <>
                          {p.doctor.name}
                          <br />
                          <small>{p.doctor.department}</small>
                        </>
                      ) : (
                        "Unassigned"
                      )}
                    </td>
                    <td>{p._count.diseases}</td>
                    <td>
                      {p.email ?? "-"}
                      <br />
                      <small>{p.phone ?? ""}</small>
                    </td>
                    <td className="mrmsActions">
                      <Link href={`/dashboard/patients/${p.id}`} className="mrmsBtn sm">
                        Profile
                      </Link>
                      {canUpdatePatients(role) && (
                        <Link href={`/dashboard/patients/${p.id}/edit`} className="mrmsBtn sm">
                          Edit
                        </Link>
                      )}
                      {canDeletePatients(role) && (
                        <DeleteRecordButton
                          endpoint={`/api/patients/${p.id}`}
                          redirectTo="/dashboard/patients"
                          label="Delete"
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          basePath="/dashboard/patients"
          searchParams={{ q, doctorId }}
        />
      </section>
    </>
  );
}

