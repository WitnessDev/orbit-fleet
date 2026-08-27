export type DeviceStatus = "online" | "offline" | "inactive";

export interface GPSDevice {
  id: string;
  deviceId: string; // Serial / Identifier e.g. GPS-8821
  imei: string; // 15-digit IMEI
  model: string; // e.g. Teltonika FMB920
  simNumber?: string;
  status: DeviceStatus;
  vehicleId?: string | null;
  vehicleRegistration?: string | null;
  lastLatitude?: number | null;
  lastLongitude?: number | null;
  batteryLevel?: number;
  lastSeen?: string | unknown;
  createdAt?: string | unknown;
  updatedAt?: string | unknown;
}
