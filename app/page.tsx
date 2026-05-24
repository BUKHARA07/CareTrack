import Image from "next/image";
import Link from "next/link";
import heroBg from "@/public/heroBG.jpg";
import pulseIcon from "@/public/pulse.svg";
import moreIcon from "@/public/more.svg";
import rightDownArrowIcon from "@/public/rightDownArrow.svg";
import doctorIcon from "@/public/doctor.svg";
import callIcon from "@/public/call.svg";
import appointmentIcon from "@/public/appointment.svg";
import checkup from "@/public/checkup.png";
import badgeIcon from "@/public/badge.svg";
import shieldIcon from "@/public/shield.svg";

const services = [
  {
    title: "Doctor profile management",
    text: "Create and maintain specialist profiles with department, specialty and contact details across CareTrack Clinic.",
    href: "/sign-in",
    cta: "Staff sign in",
    icon: doctorIcon,
  },
  {
    title: "Patient records & registration",
    text: "Register new patients, assign doctors and track personal details with full history across departments.",
    href: "/sign-in",
    cta: "Access MRMS",
    icon: appointmentIcon,
  },
  {
    title: "Diagnosis & disease tracking",
    text: "Record ICD-coded diagnoses with severity levels linked to each patient for clinical reporting.",
    href: "/sign-in",
    cta: "View system",
    icon: callIcon,
  },
];

const departments = [
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Orthopaedics",
  "General Practice",
  "Diagnostic Services",
  "Emergency & After-hours",
  "Referral Management",
];

const roles = [
  {
    title: "Administrator",
    desc: "Full access to doctors, patients, diagnoses and platform settings.",
    icon: shieldIcon,
    accent: "admin",
    scope: "All modules",
    actions: "Manage users, records, permissions",
  },
  {
    title: "Clinician",
    desc: "View and update patient records and disease/diagnosis data.",
    icon: doctorIcon,
    accent: "clinician",
    scope: "Clinical records",
    actions: "Diagnose, update charts, review history",
  },
  {
    title: "Receptionist",
    desc: "Register new patients and coordinate staff scheduling.",
    icon: badgeIcon,
    accent: "reception",
    scope: "Front desk",
    actions: "Onboard patients, route appointments",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="intro">
        <Image
          className="heroImage"
          src={heroBg}
          alt="CareTrack Clinic medical centre"
          priority
        />
        <Image className="heroPulse" src={pulseIcon} alt="" />
        <h1>
          CareTrack Clinic
          <span> MRMS</span>
        </h1>
        <p className="heroSub">
          Medical Record Management System by MediCore Solutions
        </p>
        <ul>
          <Link href="/sign-in">Staff sign in</Link>
          <Link href="/sign-up">Request access</Link>
        </ul>
        <div className="heroMore">
          <h2>Built for CareTrack Clinic</h2>
          <Image src={moreIcon} alt="" />
        </div>
      </section>

      <section className="services">
        {services.map((s) => (
          <div className="serviceCard" key={s.title}>
            <div className="serviceImage">
              <Image src={s.icon} alt="" />
            </div>
            <div className="serviceText">
              <h1>{s.title}</h1>
              <p>{s.text}</p>
              <Link href={s.href}>
                {s.cta}
                <Image src={rightDownArrowIcon} alt="" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="amenities">
        <Image src={checkup} alt="Clinical care at CareTrack Clinic" />
        <div className="amenity_text">
          <b>MediCore Solutions x CareTrack Clinic</b>
          <h1>Digital records replacing paper-based workflows</h1>
          <p>
            CareTrack Clinic commissioned MediCore Solutions to replace
            disconnected spreadsheets and paper records with a secure,
            role-based MRMS for staff across multiple specialist departments.
          </p>
          <ul>
            <li>Doctor &lt;-&gt; Patient assignment tracking</li>
            <li>Patient &lt;-&gt; Diagnosis history linking</li>
            <li>Search and filter across all records</li>
            <li>Role-based staff permissions</li>
            <li>Full patient profile views</li>
            <li>Diagnosis reports and clinical data</li>
          </ul>
          <div className="flex gap-2.5 mt-4">
            <div className="miniCard">
              <Image src={badgeIcon} alt="" />
              <ul>
                <h1>Clinic services</h1>
                <p>
                  General practice, specialist appointments, diagnostics (blood
                  tests, imaging, ECG), after-hours emergency contact and
                  inter-department referrals.
                </p>
              </ul>
            </div>
            <div className="miniCard">
              <Image src={shieldIcon} alt="" />
              <ul>
                <h1>Secure access</h1>
                <p>
                  Administrators, clinicians and reception staff each receive
                  permissions matched to their responsibilities within the
                  system.
                </p>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="department">
        <h1>Specialist departments</h1>
        <div className="department_grid">
          {departments.map((name) => (
            <div className="departmentCard" key={name}>
              <Image src={doctorIcon} alt="" />
              <h1>{name}</h1>
              <Link href="/sign-in">
                Staff portal <Image src={rightDownArrowIcon} alt="" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mrmsRolesSection">
        <div className="mrmsRolesHeader">
          <h2>Staff roles & access</h2>
          <p>
            Each role gets focused permissions to keep workflows fast, secure,
            and easy to manage at CareTrack Clinic.
          </p>
        </div>
        <div className="mrmsRolesGrid">
          {roles.map((r) => (
            <article className={`mrmsRoleCard ${r.accent}`} key={r.title}>
              <div className="mrmsRoleTop">
                <div className="mrmsRoleIcon">
                  <Image src={r.icon} alt="" />
                </div>
                <span>{r.scope}</span>
              </div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
              <small>{r.actions}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
