export type TelemetryStatus = "live" | "stale" | "offline" | "unknown";

export interface TelemetryData {
  id?: string;
  vehicleId: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  speed: number; // in km/h
  heading: number; // 0 to 360 degrees
  accuracy: number; // accuracy in meters (e.g., 5m)
  timestamp: string; // ISO 8601 string
  locationName?: string;
  altitude?: number; // meters above sea level
  odometer?: number; // total km
  fuelLevel?: number; // percentage
  batteryVoltage?: number; // volts
  isSimulated?: boolean;
}

export interface VehicleLocation {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  accuracy: number;
  timestamp: string;
  locationName?: string;
}

export interface VehicleTelemetryState {
  telemetry: TelemetryData | null;
  status: TelemetryStatus;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  history?: TelemetryData[];
}

export interface FleetTelemetryItem {
  vehicleId: string;
  registrationNumber: string;
  make: string;
  model: string;
  driverName?: string | null;
  deviceId?: string | null;
  deviceSerial?: string | null;
  location?: string | null;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  accuracy: number;
  status: "online" | "idle" | "offline" | "maintenance" | string;
  telemetryStatus: TelemetryStatus;
  lastUpdated: string;
  isSimulated?: boolean;
}

export interface SimulatorConfig {
  vehicleId: string;
  deviceId?: string;
  speed: number;
  heading: number;
  updateIntervalMs: number;
  isRunning: boolean;
  latitude: number;
  longitude: number;
  locationName?: string;
}
