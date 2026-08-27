export type VehicleStatus =
  | "online"
  | "idle"
  | "offline"
  | "active"
  | "inactive"
  | "maintenance"
  | "suspended";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year?: number | string | null;
  color?: string | null;
  type?: string | null;
  status: VehicleStatus;
  driverId?: string | null;
  driverName?: string | null;
  deviceId?: string | null;
  deviceSerial?: string | null;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mileage?: number | null;
  fuelLevel?: number | null;
  createdAt?: string | unknown;
  updatedAt?: string | unknown;
}
