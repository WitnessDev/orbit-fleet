export type DriverStatus =
  | "available"
  | "on_trip"
  | "off_duty"
  | "suspended";

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  status: DriverStatus;
  vehicleId?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}