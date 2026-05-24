import { DEPARTMENTS, SEVERITIES } from "@/lib/constants";

type SearchFiltersProps = {
  q?: string;
  department?: string;
  departmentOptions?: string[];
  severity?: string;
  doctorId?: string;
  doctors?: { id: string; name: string }[];
  showDepartment?: boolean;
  showSeverity?: boolean;
  showDoctor?: boolean;
};

export default function SearchFilters({
  q = "",
  department = "",
  departmentOptions,
  severity = "",
  doctorId = "",
  doctors = [],
  showDepartment,
  showSeverity,
  showDoctor,
}: SearchFiltersProps) {
  const departments = departmentOptions?.length ? departmentOptions : DEPARTMENTS;

  return (
    <form className="mrmsFilters" method="get">
      <input
        type="search"
        name="q"
        placeholder="Search..."
        defaultValue={q}
        className="mrmsInput"
      />
      {showDepartment && (
        <select name="department" defaultValue={department} className="mrmsSelect">
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      )}
      {showSeverity && (
        <select name="severity" defaultValue={severity} className="mrmsSelect">
          <option value="">All severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
      {showDoctor && (
        <select name="doctorId" defaultValue={doctorId} className="mrmsSelect">
          <option value="">All doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      )}
      <button type="submit" className="mrmsBtn primary">
        Filter
      </button>
    </form>
  );
}

