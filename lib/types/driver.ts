export type DriverStatus =
  | "available"
  | "on_trip"
  | "off_duty"
  | "suspended";

export interface Driver {
  id: string;
  name: string;
  email?: string;
  phone: string;
  licenseNumber: string;
  status: DriverStatus;
  vehicleId?: string | null;
  vehicleRegistration?: string | null;
  experienceYears?: number;
  notes?: string;
  createdAt?: string | unknown;
  updatedAt?: string | unknown;
}
