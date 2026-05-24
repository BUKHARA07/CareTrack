"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

export default function DashboardShell({
  children,
  userRole,
}: {
  children: React.ReactNode;
  userRole: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`dashboardShell${collapsed ? " collapsed" : ""}`}>
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        userRole={userRole}
      />
      <div className="dashMain">
        <DashboardTopbar />
        <div className="dashContent">{children}</div>
      </div>
    </div>
  );
}
