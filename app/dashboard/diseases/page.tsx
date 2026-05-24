import { auth } from "@/auth";
import DeleteRecordButton from "@/components/mrms/DeleteRecordButton";
import PageHeader from "@/components/mrms/PageHeader";
import SearchFilters from "@/components/mrms/SearchFilters";
import TablePagination from "@/components/mrms/TablePagination";
import { getPagination, parsePageParam } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { canManageDiseases, canViewDiseases } from "@/lib/permissions";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ q?: string; severity?: string; page?: string }>;
};

export default async function DiseasesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const role = session.user.role;
  if (!canViewDiseases(role)) redirect("/dashboard");

  const { q = "", severity = "", page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  const where = {
    AND: [
      q
        ? {
            OR: [
              { icdCode: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      severity ? { severity: { equals: severity, mode: "insensitive" as const } } : {},
    ],
  };

  const totalCount = await prisma.disease.count({ where });
  const { currentPage, totalPages, skip, take } = getPagination(page, totalCount);

  const diseases = await prisma.disease.findMany({
    where,
    include: {
      patient: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return (
    <>
      <PageHeader
        title="Disease & diagnosis records"
        description="Track ICD-coded diagnoses linked to patients."
        action={
          canManageDiseases(role)
            ? { label: "+ Add diagnosis", href: "/dashboard/diseases/new" }
            : undefined
        }
      />
      <SearchFilters q={q} severity={severity} showSeverity />
      <section className="dashPanel">
        <div className="mrmsTableWrap">
          <table className="mrmsTable">
            <thead>
              <tr>
                <th>ICD code</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Patient</th>
                <th>Date</th>
                {canManageDiseases(role) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {diseases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="mrmsEmpty">No diagnosis records found.</td>
                </tr>
              ) : (
                diseases.map((d) => (
                  <tr key={d.id}>
                    <td><b>{d.icdCode}</b></td>
                    <td>{d.description}</td>
                    <td><span className={`mrmsSeverity ${d.severity.toLowerCase()}`}>{d.severity}</span></td>
                    <td>
                      <Link href={`/dashboard/patients/${d.patient.id}`}>
                        {d.patient.firstName} {d.patient.lastName}
                      </Link>
                    </td>
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    {canManageDiseases(role) && (
                      <td className="mrmsActions">
                        <Link href={`/dashboard/diseases/${d.id}/edit`} className="mrmsBtn sm">Edit</Link>
                        <DeleteRecordButton endpoint={`/api/diseases/${d.id}`} redirectTo="/dashboard/diseases" label="Delete" />
                      </td>
                    )}
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
          basePath="/dashboard/diseases"
          searchParams={{ q, severity }}
        />
      </section>
    </>
  );
}
