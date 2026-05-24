import { CalendarIcon, CheckIcon, XIcon } from "./icons";

const appointments = [
  {
    name: "Martina Ford",
    date: "30 May 2025",
    time: "11:30 AM",
    dept: "Urology",
    tag: "urology",
    color: "#059669",
    initials: "MF",
  },
  {
    name: "James Anthony",
    date: "27 May 2025",
    time: "12:30 PM",
    dept: "Cardiology",
    tag: "cardiology",
    color: "#2563eb",
    initials: "JA",
  },
  {
    name: "Kelly Steven",
    date: "27 May 2025",
    time: "02:30 PM",
    dept: "Dermatology",
    tag: "dermatology",
    color: "#0d9488",
    initials: "KS",
  },
  {
    name: "Sammy Johnson",
    date: "26 May 2025",
    time: "11:00 AM",
    dept: "ENT Surgery",
    tag: "ent",
    color: "#7c3aed",
    initials: "SJ",
  },
  {
    name: "Pat Tobi",
    date: "25 May 2025",
    time: "12:30 PM",
    dept: "Cardiology",
    tag: "cardiology",
    color: "#2563eb",
    initials: "PT",
  },
];

export default function AppointmentRequests() {
  return (
    <section className="dashPanel">
      <div className="dashPanelHead">
        <h2>Appointment Request</h2>
        <button type="button" className="dashPanelBtn">
          All Appointments
        </button>
      </div>
      <div className="dashApptList">
        {appointments.map((appt) => (
          <div key={appt.name} className="dashApptItem">
            <div
              className="dashApptAvatar"
              style={{ background: appt.color }}
            >
              {appt.initials}
            </div>
            <div className="dashApptInfo">
              <h4>{appt.name}</h4>
              <div className="dashApptMeta">
                <span>
                  <CalendarIcon />
                  {appt.date}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  {appt.time}
                </span>
              </div>
            </div>
            <span className={`dashDeptTag ${appt.tag}`}>{appt.dept}</span>
            <div className="dashApptActions">
              <button type="button" className="reject" aria-label="Reject">
                <XIcon />
              </button>
              <button type="button" className="accept" aria-label="Accept">
                <CheckIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
