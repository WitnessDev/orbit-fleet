export type DeviceStatus =
  | "online"
  | "offline"
  | "inactive";

export interface GPSDevice {
  id: string;
  deviceId: string;
  imei: string;
  status: DeviceStatus;
  vehicleId?: string | null;
  lastLatitude?: number | null;
  lastLongitude?: number | null;
  lastSeen?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}