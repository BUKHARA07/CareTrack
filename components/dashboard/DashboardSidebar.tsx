"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import pulseIcon from "@/public/pulse.svg";
import SignOutButton from "./SignOutButton";
import {
  ClipboardPulseIcon,
  DashboardIcon,
  StethoscopeIcon,
  MedicalCrossIcon,
  MenuToggleIcon,
  UserHeartIcon,
  HomeIcon,
} from "./icons";
import {
  canManageDoctors,
  canViewDiseases,
  canViewPatients,
} from "@/lib/permissions";

type DashboardSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  userRole: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: () => React.JSX.Element;
  show: boolean;
};

export default function DashboardSidebar({
  collapsed,
  onToggle,
  userRole,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isDoctor = userRole === "Doctor";
  const isReceptionist = userRole === "Receptionist";

  const { data: session } = useSession();
  const seed = session?.user?.email ?? "admin";

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const displayCollapsed = isMobile ? !collapsed : collapsed;

  const links: NavItem[] = [
    {
      label: "Command Center",
      href: "/dashboard",
      icon: DashboardIcon,
      show: true,
    },
    {
      label: "Doctor Network",
      href: "/dashboard/doctors",
      icon: StethoscopeIcon,
      show: true,
    },
    {
      label: "Patient Registry",
      href: "/dashboard/patients",
      icon: UserHeartIcon,
      show: canViewPatients(userRole),
    },
    {
      label: "Diagnosis Log",
      href: "/dashboard/diseases",
      icon: ClipboardPulseIcon,
      show: canViewDiseases(userRole),
    },
  ];

  return (
    <aside className="dashSidebar">
      <div className="dashSidebarHead">
        <Link href="/dashboard" className="dashLogo" aria-label="MediCore Control">
          <Image
            className="dashLogoMark"
            src={pulseIcon}
            alt=""
            width={28}
            height={28}
            priority
          />
          <span className="dashLogoText">MediCore Control</span>
        </Link>

        {/* Mobile Header Actions (Visible next to hamburger on mobile viewport) */}
        <div className="mobileSidebarActions">
          <Link href="/dashboard" className="mobileSidebarIconBtn" title="Overview">
            <HomeIcon />
          </Link>
          <div className="mobileSidebarSignout">
            <SignOutButton />
          </div>
          <div className="mobileSidebarAvatar">
            <Image
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`}
              alt="Profile"
              width={32}
              height={32}
              unoptimized
            />
          </div>
        </div>

        <button
          type="button"
          className="dashSidebarToggle"
          onClick={onToggle}
          aria-label={displayCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MenuToggleIcon collapsed={displayCollapsed} />
        </button>
      </div>
      <nav className="dashNav">
        <p className="dashNavSection">Workspace</p>
        {links
          .filter((l) => l.show)
          .map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`dashNavLink${active ? " active" : ""}`}
              >
                <link.icon />
                <span className="dashNavLabel">{link.label}</span>
              </Link>
            );
          })}
        <p className="dashNavSection">Access Profile</p>
        <p className="dashRoleBadge">{userRole}</p>
        {isDoctor && (
          <p className="dashNavHint">Clinical view with patient insights.</p>
        )}
        {isReceptionist && (
          <p className="dashNavHint">Front desk mode with intake workflow.</p>
        )}
        {!canManageDoctors(userRole) && !isDoctor && !isReceptionist && (
          <p className="dashNavHint">
            Read-focused workspace permissions enabled.
          </p>
        )}
      </nav>
    </aside>
  );
}
