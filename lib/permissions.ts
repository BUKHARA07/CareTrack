export const ROLES = {
  ADMIN: "Administrator",
  CLINICIAN: "Clinician",
  RECEPTIONIST: "Receptionist",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const VALID_ROLES = Object.values(ROLES);

export function canManageDoctors(role: string) {
  return role === ROLES.ADMIN;
}

export function canViewDoctors(role: string) {
  return VALID_ROLES.includes(role as UserRole);
}

export function canCreatePatients(role: string) {
  return role === ROLES.ADMIN || role === ROLES.RECEPTIONIST;
}

export function canUpdatePatients(role: string) {
  return role === ROLES.ADMIN || role === ROLES.CLINICIAN;
}

export function canDeletePatients(role: string) {
  return role === ROLES.ADMIN;
}

export function canViewPatients(role: string) {
  return VALID_ROLES.includes(role as UserRole);
}

export function canManageDiseases(role: string) {
  return role === ROLES.ADMIN || role === ROLES.CLINICIAN;
}

export function canViewDiseases(role: string) {
  return role === ROLES.ADMIN || role === ROLES.CLINICIAN;
}

export function canAccessSettings(role: string) {
  return role === ROLES.ADMIN;
}
