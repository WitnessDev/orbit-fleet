export type VehicleStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "suspended";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year?: number;
  color?: string;
  status: VehicleStatus;
  driverId?: string | null;
  deviceId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}