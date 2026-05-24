import { auth } from "@/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <DashboardShell userRole={session.user.role ?? "Receptionist"}>
      {children}
    </DashboardShell>
  );
}
