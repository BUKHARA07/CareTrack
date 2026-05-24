"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import SignOutButton from "./SignOutButton";
import { BellIcon, ClockIcon, HomeIcon, SearchIcon } from "./icons";

export default function DashboardTopbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const seed = session?.user?.email ?? "admin";
  const initialQuery = searchParams.get("q") ?? "";
  const routeLabel = getRouteLabel(pathname);
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [showUserModal, setShowUserModal] = useState(false);

  function getSearchTarget(path: string) {
    if (path.startsWith("/dashboard/doctors")) return "/dashboard/doctors";
    if (path.startsWith("/dashboard/patients")) return "/dashboard/patients";
    if (path.startsWith("/dashboard/diseases")) return "/dashboard/diseases";
    return "/dashboard/patients";
  }

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = String(formData.get("q") ?? "").trim();
    const target = getSearchTarget(pathname);
    router.push(q ? `${target}?q=${encodeURIComponent(q)}` : target);
  }

  return (
    <>
      <header className="dashTopbar">
        <div className="dashTopbarRoute">
          <p>{routeLabel}</p>
          <span>
            <ClockIcon />
            {todayLabel}
          </span>
        </div>
        <form className="dashSearch" role="search" onSubmit={handleSearch}>
          <input
            type="search"
            name="q"
            placeholder="Search records, doctors, diagnoses..."
            aria-label="Search"
            defaultValue={initialQuery}
          />
          <button type="submit" className="dashSearchBtn" aria-label="Search">
            <SearchIcon />
          </button>
        </form>
        <div className="dashTopbarActions">
          <SignOutButton />
          <Link
            href="/dashboard"
            className="dashIconBtn"
            aria-label="Dashboard overview"
            title="Dashboard overview"
          >
            <HomeIcon />
          </Link>
          <button className="dashAvatar" onClick={() => setShowUserModal(true)} style={{ border: "none", padding: 0, cursor: "pointer" }}>
            <Image
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`}
              alt={session?.user?.name ?? "User profile"}
              width={38}
              height={38}
              unoptimized
            />
          </button>
        </div>
      </header>

      {showUserModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowUserModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              minWidth: "300px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div className="dashAvatar" style={{ width: "60px", height: "60px" }}>
                <Image
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`}
                  alt="Avatar"
                  width={60}
                  height={60}
                  unoptimized
                />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>{session?.user?.name ?? "Unknown User"}</h3>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>Role: {session?.user?.role ?? "Guest"}</p>
              </div>
            </div>
            
            <div style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
              <p style={{ margin: "0 0 10px 0", fontSize: "0.95rem" }}><strong>Email:</strong> {session?.user?.email ?? "N/A"}</p>
            </div>

            <button
              onClick={() => setShowUserModal(false)}
              className="mrmsBtn primary"
              style={{ width: "100%", marginTop: "15px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function getRouteLabel(pathname: string) {
  if (pathname.startsWith("/dashboard/doctors")) return "Doctor Network";
  if (pathname.startsWith("/dashboard/patients")) return "Patient Registry";
  if (pathname.startsWith("/dashboard/diseases")) return "Diagnosis Log";
  return "Command Center";
}
