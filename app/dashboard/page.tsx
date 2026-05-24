import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  canCreatePatients,
  canManageDiseases,
  canManageDoctors,
  canViewDiseases,
} from "@/lib/permissions";
import {
  ActivityIcon,
  ClipboardPulseIcon,
  StethoscopeIcon,
  TrendUpIcon,
  UserHeartIcon,
} from "@/components/dashboard/icons";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role ?? "Receptionist";
  const name = session?.user?.name?.split(" ")[0] ?? "User";
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    doctorCount,
    patientCount,
    diseaseCount,
    weeklyRegistrations,
    todayRegistrations,
    recentPatients,
  ] = await Promise.all([
    prisma.doctor.count(),
    prisma.patient.count(),
    canViewDiseases(role) ? prisma.disease.count() : Promise.resolve(0),
    prisma.patient.count({
      where: {
        createdAt: {
          gte: new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.patient.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.patient.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { doctor: { select: { name: true } } },
    }),
  ]);

  const loadFactor =
    doctorCount === 0 ? 0 : Math.round((patientCount / doctorCount) * 10) / 10;
  const greeting = getDayGreeting();
  const summaryCards = [
    {
      title: "Doctors",
      value: doctorCount,
      note: "Active specialists",
      icon: <StethoscopeIcon />,
      delta: canManageDoctors(role) ? "Manage team" : "View only",
      href: "/dashboard/doctors",
    },
    {
      title: "Patients",
      value: patientCount,
      note: `${todayRegistrations} added today`,
      icon: <UserHeartIcon />,
      delta: `${weeklyRegistrations} this week`,
      href: "/dashboard/patients",
    },
    {
      title: "Diagnoses",
      value: canViewDiseases(role) ? diseaseCount : "Locked",
      note: "Clinical records",
      icon: <ClipboardPulseIcon />,
      delta: canViewDiseases(role) ? "Updated live" : "Role restricted",
      href: "/dashboard/diseases",
      hidden: !canViewDiseases(role),
    },
    {
      title: "Load Factor",
      value: `${loadFactor}`,
      note: "Patients per doctor",
      icon: <ActivityIcon />,
      delta: loadFactor > 18 ? "High pressure" : "Balanced",
      href: "/dashboard/patients",
    },
  ];

  return (
    <>
      <section className="dashHero">
        <div className="dashHeroCopy">
          <p className="dashHeroEyebrow">MediCore Operations</p>
          <h1>
            {greeting}, {name}
          </h1>
          <p>
            Live care intelligence for today&apos;s workflow. Your active role
            is <b>{role}</b>.
          </p>
          <div className="dashHeroStats">
            <span>{todayRegistrations} new registrations today</span>
            <span>{weeklyRegistrations} registrations this week</span>
          </div>
        </div>
        <div className="dashHeroActions">
          <Link href="/dashboard/patients" className="dashPanelBtn">
            Open patient registry
          </Link>
          <Link href="/dashboard/patients/new" className="mrmsBtn primary">
            {canCreatePatients(role) ? "+ Register patient" : "View patients"}
          </Link>
        </div>
      </section>

      <section className="dashKpiGrid" aria-label="Summary statistics">
        {summaryCards
          .filter((card) => !card.hidden)
          .map((card) => (
            <article className="dashKpiCard" key={card.title}>
              <div className="dashKpiTop">
                <span className="dashKpiIcon">{card.icon}</span>
                <span className="dashKpiDelta">
                  <TrendUpIcon />
                  {card.delta}
                </span>
              </div>
              <h3>{card.title}</h3>
              <p className="value">{card.value}</p>
              <p className="dashKpiNote">{card.note}</p>
              <Link href={card.href}>Open details</Link>
            </article>
          ))}
      </section>

      <section className="dashOverviewGrid">
        <article className="dashPanel dashQuickPanel">
          <div className="dashPanelHead">
            <h2>Quick actions</h2>
          </div>
          <ul className="mrmsQuickLinks">
            {canManageDoctors(role) && (
              <li>
                <Link href="/dashboard/doctors/new">Add doctor profile</Link>
              </li>
            )}
            {canCreatePatients(role) && (
              <li>
                <Link href="/dashboard/patients/new">
                  Register a new patient
                </Link>
              </li>
            )}
            {canManageDiseases(role) && (
              <li>
                <Link href="/dashboard/diseases/new">
                  Record diagnosis entry
                </Link>
              </li>
            )}
            <li>
              <Link href="/dashboard/patients">
                Review complete patient registry
              </Link>
            </li>
          </ul>
        </article>

        <article className="dashPanel dashLoadPanel">
          <div className="dashPanelHead">
            <h2>Operational snapshot</h2>
          </div>
          <div className="dashLoadRows">
            <div>
              <p>Coverage status</p>
              <b>{doctorCount > 0 ? "Staffed" : "Need staffing"}</b>
            </div>
            <div>
              <p>This week registrations</p>
              <b>{weeklyRegistrations}</b>
            </div>
            <div>
              <p>Avg. patients per doctor</p>
              <b>{loadFactor}</b>
            </div>
          </div>
        </article>
      </section>

      <section className="dashPanel">
        <div className="dashPanelHead">
          <h2>Recent patient registrations</h2>
          <Link href="/dashboard/patients" className="dashPanelBtn">
            View all
          </Link>
        </div>
        <div className="mrmsTableWrap">
          <table className="mrmsTable">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Assigned doctor</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.length === 0 ? (
                <tr>
                  <td colSpan={3} className="mrmsEmpty">
                    No patients yet.{" "}
                    {canCreatePatients(role) && (
                      <Link href="/dashboard/patients/new">
                        Register the first patient
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                recentPatients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/dashboard/patients/${p.id}`}>
                        {p.firstName} {p.lastName}
                      </Link>
                    </td>
                    <td>{p.doctor?.name ?? "Unassigned"}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
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

function getDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
