import { auth } from "@/auth";
import DeleteRecordButton from "@/components/mrms/DeleteRecordButton";
import PageHeader from "@/components/mrms/PageHeader";
import SearchFilters from "@/components/mrms/SearchFilters";
import TablePagination from "@/components/mrms/TablePagination";
import { getPagination, parsePageParam } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { canManageDoctors } from "@/lib/permissions";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ q?: string; department?: string; page?: string }>;
};

export default async function DoctorsPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const role = session.user.role;
  const { q = "", department = "", page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);
  const where = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { specialty: { contains: q, mode: "insensitive" as const } },
              { department: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      department
        ? { department: { equals: department, mode: "insensitive" as const } }
        : {},
    ],
  };

  const totalCount = await prisma.doctor.count({ where });
  const { currentPage, totalPages, skip, take } = getPagination(page, totalCount);

  const [doctors, departmentRows] = await Promise.all([
    prisma.doctor.findMany({
      where,
      include: { _count: { select: { patients: true } } },
      orderBy: { name: "asc" },
      skip,
      take,
    }),
    prisma.doctor.findMany({
      select: { department: true },
      distinct: ["department"],
      orderBy: { department: "asc" },
    }),
  ]);

  const departmentOptions = departmentRows
    .map((d) => d.department?.trim())
    .filter((d): d is string => Boolean(d));

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Manage doctor profiles, specialties and department assignments."
        action={
          canManageDoctors(role)
            ? { label: "+ Add doctor", href: "/dashboard/doctors/new" }
            : undefined
        }
      />
      <SearchFilters
        q={q}
        department={department}
        departmentOptions={departmentOptions}
        showDepartment
      />
      <section className="dashPanel">
        <div className="mrmsTableWrap">
          <table className="mrmsTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Patients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="mrmsEmpty">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                doctors.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <b>{d.name}</b>
                    </td>
                    <td>{d.specialty}</td>
                    <td>
                      <span className="mrmsTag">{d.department}</span>
                    </td>
                    <td>
                      {d.email}
                      <br />
                      <small>{d.phone}</small>
                    </td>
                    <td>{d._count.patients}</td>
                    <td className="mrmsActions">
                      <Link
                        href={`/dashboard/doctors/${d.id}`}
                        className="mrmsBtn sm"
                      >
                        Profile
                      </Link>
                      {canManageDoctors(role) && (
                        <>
                          <Link
                            href={`/dashboard/doctors/${d.id}/edit`}
                            className="mrmsBtn sm"
                          >
                            Edit
                          </Link>
                          <DeleteRecordButton
                            endpoint={`/api/doctors/${d.id}`}
                            redirectTo="/dashboard/doctors"
                            label="Delete"
                          />
                        </>
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
          basePath="/dashboard/doctors"
          searchParams={{ q, department }}
        />
      </section>
    </>
  );
}
