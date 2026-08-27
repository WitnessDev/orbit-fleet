export type UserRole =
  | "admin"
  | "owner"
  | "fleet_manager"
  | "driver"
  | "viewer"
  | (string & {});

export type UserStatus = "active" | "inactive" | "pending" | "suspended";

export interface VehicleOption {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  type: "Car" | "Truck" | "Van" | "Motorcycle" | "Bus" | "Pickup";
  status: "online" | "idle" | "offline" | "maintenance";
  assignedDriverName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  vehicleIds: string[];
  department?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}

export interface RolePermission {
  id: string;
  label: string;
  category: "Vehicles" | "Tracking" | "Users & Roles" | "Reports" | "System";
  description: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  label: string;
  description: string;
  isCustom?: boolean;
  colorVariant?: "emerald" | "blue" | "purple" | "slate" | "amber";
  permissions: string[];
}

export interface UserFilterState {
  search: string;
  role: string;
  status: string;
  vehicleId?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminManagerCount: number;
  driverCount: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
