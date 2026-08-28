export type UserRole =
  | "owner"
  | "admin"
  | "fleet_manager"
  | "dispatcher"
  | "driver";

export interface RoleConfig {
  id: UserRole;
  name: string;
  label: string;
  shortDescription: string;
  colorVariant: "emerald" | "purple" | "blue" | "teal" | "slate";
  badgeStyles: {
    bg: string;
    text: string;
    border: string;
    dot: string;
  };
  permissions: string[];
}

export const OFFICIAL_ROLES: Record<UserRole, RoleConfig> = {
  owner: {
    id: "owner",
    name: "owner",
    label: "Owner",
    shortDescription: "Full account & fleet control",
    colorVariant: "emerald",
    badgeStyles: {
      bg: "bg-emerald-50 text-emerald-800",
      text: "text-emerald-800",
      border: "border-emerald-200/90",
      dot: "bg-emerald-600",
    },
    permissions: [
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
      "users.assign_role",
      "vehicles.view",
      "vehicles.create",
      "vehicles.edit",
      "vehicles.delete",
      "drivers.view",
      "drivers.create",
      "drivers.edit",
      "drivers.delete",
      "devices.view",
      "devices.create",
      "devices.edit",
      "devices.delete",
      "tracking.view",
      "tracking.simulate",
      "reports.view",
      "reports.export",
      "settings.view",
      "settings.manage",
    ],
  },
  admin: {
    id: "admin",
    name: "admin",
    label: "Admin",
    shortDescription: "System administration & user management",
    colorVariant: "purple",
    badgeStyles: {
      bg: "bg-purple-50 text-purple-800",
      text: "text-purple-800",
      border: "border-purple-200/90",
      dot: "bg-purple-600",
    },
    permissions: [
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
      "vehicles.view",
      "vehicles.create",
      "vehicles.edit",
      "vehicles.delete",
      "drivers.view",
      "drivers.create",
      "drivers.edit",
      "drivers.delete",
      "devices.view",
      "devices.create",
      "devices.edit",
      "devices.delete",
      "tracking.view",
      "tracking.simulate",
      "reports.view",
      "reports.export",
      "settings.view",
      "settings.manage",
    ],
  },
  fleet_manager: {
    id: "fleet_manager",
    name: "fleet_manager",
    label: "Fleet Manager",
    shortDescription: "Fleet operations & driver assignments",
    colorVariant: "blue",
    badgeStyles: {
      bg: "bg-blue-50 text-blue-800",
      text: "text-blue-800",
      border: "border-blue-200/90",
      dot: "bg-blue-600",
    },
    permissions: [
      "vehicles.view",
      "vehicles.create",
      "vehicles.edit",
      "drivers.view",
      "drivers.create",
      "drivers.edit",
      "devices.view",
      "devices.create",
      "tracking.view",
      "tracking.simulate",
      "reports.view",
      "reports.export",
      "settings.view",
    ],
  },
  dispatcher: {
    id: "dispatcher",
    name: "dispatcher",
    label: "Dispatcher / Operations",
    shortDescription: "Daily fleet operations & live dispatch",
    colorVariant: "teal",
    badgeStyles: {
      bg: "bg-teal-50 text-teal-800",
      text: "text-teal-800",
      border: "border-teal-200/90",
      dot: "bg-teal-600",
    },
    permissions: [
      "vehicles.view",
      "drivers.view",
      "devices.view",
      "tracking.view",
      "reports.view",
    ],
  },
  driver: {
    id: "driver",
    name: "driver",
    label: "Driver",
    shortDescription: "Assigned vehicle & trip access",
    colorVariant: "slate",
    badgeStyles: {
      bg: "bg-slate-100 text-slate-800",
      text: "text-slate-800",
      border: "border-slate-200",
      dot: "bg-slate-500",
    },
    permissions: [
      "vehicles.view_assigned",
      "tracking.view_assigned",
      "trips.view_assigned",
    ],
  },
};

export function hasPermission(role: UserRole | string, permission: string): boolean {
  const roleConfig = OFFICIAL_ROLES[role as UserRole];
  if (!roleConfig) return false;
  return roleConfig.permissions.includes(permission);
}

export function canManageUserRole(
  actorRole: UserRole | string,
  targetRole: UserRole | string
): boolean {
  if (actorRole === "owner") return true;
  if (actorRole === "admin") {
    // Admin cannot change Owner
    return targetRole !== "owner";
  }
  return false;
}
