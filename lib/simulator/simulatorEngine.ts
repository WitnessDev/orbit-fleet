import type { SimulatorConfig, TelemetryData } from "@/types/telemetry";
import { writeTelemetry } from "@/lib/telemetry/telemetryService";

export interface SimulationLogEntry {
  id: string;
  seq: number;
  timestamp: string;
  vehicleId: string;
  speed: number;
  heading: number;
  latitude: number;
  longitude: number;
  latencyMs: number;
  status: "success" | "error";
  message: string;
}

export type SimulatorStateListener = (state: {
  isRunning: boolean;
  config: SimulatorConfig;
  lastPacket?: TelemetryData;
  packetCount: number;
  logs: SimulationLogEntry[];
}) => void;

/**
 * Calculates the next GPS coordinate based on spherical geodesics.
 *
 * @param lat Current latitude (-90 to 90)
 * @param lng Current longitude (-180 to 180)
 * @param speedKmH Velocity in km/h
 * @param headingDeg Bearing angle (0 = North, 90 = East, 180 = South, 270 = West)
 * @param intervalSec Elapsed time in seconds
 */
export function calculateNextPosition(
  lat: number,
  lng: number,
  speedKmH: number,
  headingDeg: number,
  intervalSec: number
): { latitude: number; longitude: number } {
  if (speedKmH <= 0 || intervalSec <= 0) {
    return { latitude: lat, longitude: lng };
  }

  const EARTH_RADIUS_KM = 6371.0;
  const distanceKm = speedKmH * (intervalSec / 3600);

  // Convert heading to radians
  const headingRad = (headingDeg * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // Change in latitude in radians
  const deltaLat = (distanceKm * Math.cos(headingRad)) / EARTH_RADIUS_KM;
  // Change in longitude in radians (account for latitude convergence)
  const cosLat = Math.cos(latRad);
  const deltaLng =
    cosLat !== 0
      ? (distanceKm * Math.sin(headingRad)) / (EARTH_RADIUS_KM * cosLat)
      : 0;

  let newLat = lat + (deltaLat * 180) / Math.PI;
  let newLng = lng + (deltaLng * 180) / Math.PI;

  // Clamp latitude to [-89.9999, 89.9999]
  newLat = Math.max(-89.9999, Math.min(89.9999, newLat));

  // Wrap longitude to [-180, 180]
  newLng = ((newLng + 180) % 360 + 360) % 360 - 180;

  return {
    latitude: Number(newLat.toFixed(6)),
    longitude: Number(newLng.toFixed(6)),
  };
}

/**
 * Generates an approximated landmark name from coordinates in common East African fleet hubs.
 */
export function estimateLocationName(lat: number, lng: number): string {
  // Arusha bounding box ~ [-3.45 to -3.32, 36.60 to 36.75]
  if (lat >= -3.5 && lat <= -3.2 && lng >= 36.5 && lng <= 36.8) {
    if (lat > -3.36) return "Arusha - Clock Tower / CBD";
    if (lat < -3.40) return "Arusha - Njiro Industrial Area";
    if (lng > 36.70) return "Arusha - Moshi Highway Corridor";
    return "Arusha Central Hub";
  }

  // Dar es Salaam bounding box ~ [-6.90 to -6.70, 39.15 to 39.35]
  if (lat >= -7.0 && lat <= -6.6 && lng >= 39.0 && lng <= 39.4) {
    if (lng > 39.26) return "Dar es Salaam - Port Terminal";
    if (lat > -6.76) return "Dar es Salaam - Kinondoni";
    return "Dar es Salaam - Ubungo Transit";
  }

  // Dodoma bounding box ~ [-6.25 to -6.10, 35.70 to 35.85]
  if (lat >= -6.3 && lat <= -6.0 && lng >= 35.6 && lng <= 35.9) {
    return "Dodoma - Capital Bypass";
  }

  // Nairobi bounding box ~ [-1.35 to -1.20, 36.75 to 36.95]
  if (lat >= -1.4 && lat <= -1.1 && lng >= 36.7 && lng <= 37.0) {
    return "Nairobi - Southern Bypass";
  }

  return `Transit Route (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
}

class GpsSimulatorEngine {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private seq = 0;
  private logs: SimulationLogEntry[] = [];
  private listeners: Set<SimulatorStateListener> = new Set();
  private lastPacket?: TelemetryData;

  private config: SimulatorConfig = {
    vehicleId: "",
    deviceId: "GPS-SIM-001",
    speed: 68,
    heading: 90, // East
    updateIntervalMs: 4000, // 4 seconds interval for realistic performance and balanced Firestore writes
    isRunning: false,
    latitude: -3.3869, // Arusha default
    longitude: 36.683,
    locationName: "Arusha Central",
  };

  constructor() {
    // Singleton engine instance
  }

  public subscribe(listener: SimulatorStateListener): () => void {
    this.listeners.add(listener);
    this.notify();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = {
      isRunning: this.isRunning,
      config: { ...this.config, isRunning: this.isRunning },
      lastPacket: this.lastPacket,
      packetCount: this.seq,
      logs: [...this.logs],
    };
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.error("Error in simulator state listener:", err);
      }
    });
  }

  public configure(updates: Partial<SimulatorConfig>) {
    this.config = {
      ...this.config,
      ...updates,
    };
    this.notify();
  }

  public setVehicle(
    vehicleId: string,
    deviceId?: string,
    initialLat?: number,
    initialLng?: number
  ) {
    this.config.vehicleId = vehicleId;
    if (deviceId) this.config.deviceId = deviceId;
    if (typeof initialLat === "number") this.config.latitude = initialLat;
    if (typeof initialLng === "number") this.config.longitude = initialLng;
    this.config.locationName = estimateLocationName(
      this.config.latitude,
      this.config.longitude
    );
    this.notify();
  }

  public setSpeed(speed: number) {
    this.config.speed = Math.max(0, Math.min(180, Math.round(speed)));
    this.notify();
  }

  public setHeading(heading: number) {
    this.config.heading = ((Math.round(heading) % 360) + 360) % 360;
    this.notify();
  }

  public setCoordinates(lat: number, lng: number) {
    this.config.latitude = Number(lat.toFixed(6));
    this.config.longitude = Number(lng.toFixed(6));
    this.config.locationName = estimateLocationName(lat, lng);
    this.notify();
  }

  public setIntervalMs(intervalMs: number) {
    this.config.updateIntervalMs = Math.max(2000, Math.min(30000, intervalMs));
    if (this.isRunning) {
      this.stop();
      this.start();
    } else {
      this.notify();
    }
  }

  public async start(): Promise<boolean> {
    if (this.isRunning) return true;
    if (!this.config.vehicleId) {
      console.warn("Cannot start simulator: No vehicle ID specified.");
      return false;
    }

    this.isRunning = true;
    this.config.isRunning = true;
    this.notify();

    // Execute first tick immediately
    await this.step();

    // Setup recurring interval
    this.timer = setInterval(() => {
      this.step();
    }, this.config.updateIntervalMs);

    return true;
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    this.config.isRunning = false;
    this.notify();
  }

  /**
   * Executes a single simulation step: advances coordinates, packages telemetry, and writes to Firestore.
   */
  public async step(): Promise<TelemetryData | null> {
    if (!this.config.vehicleId) return null;

    const intervalSec = this.config.updateIntervalMs / 1000;
    const startMs = Date.now();

    // 1. Calculate new location
    const nextPos = calculateNextPosition(
      this.config.latitude,
      this.config.longitude,
      this.config.speed,
      this.config.heading,
      intervalSec
    );

    this.config.latitude = nextPos.latitude;
    this.config.longitude = nextPos.longitude;
    this.config.locationName = estimateLocationName(
      nextPos.latitude,
      nextPos.longitude
    );

    // 2. Prepare telemetry payload
    const nowIso = new Date().toISOString();
    const packet: Omit<TelemetryData, "id"> = {
      vehicleId: this.config.vehicleId,
      deviceId: this.config.deviceId || "GPS-SIM-001",
      latitude: nextPos.latitude,
      longitude: nextPos.longitude,
      speed: this.config.speed,
      heading: this.config.heading,
      accuracy: 4.5,
      timestamp: nowIso,
      locationName: this.config.locationName,
      isSimulated: true,
    };

    this.seq++;
    const currentSeq = this.seq;

    try {
      // 3. Write through real Firestore service
      const result = await writeTelemetry(packet);
      const latency = Date.now() - startMs;

      this.lastPacket = result;

      const logEntry: SimulationLogEntry = {
        id: `sim-${currentSeq}-${Date.now()}`,
        seq: currentSeq,
        timestamp: new Date().toLocaleTimeString(),
        vehicleId: this.config.vehicleId,
        speed: this.config.speed,
        heading: this.config.heading,
        latitude: nextPos.latitude,
        longitude: nextPos.longitude,
        latencyMs: latency,
        status: "success",
        message: `Packet #${currentSeq} written to Firestore (${latency}ms)`,
      };

      this.logs = [logEntry, ...this.logs.slice(0, 19)];
      this.notify();
      return result;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      const logEntry: SimulationLogEntry = {
        id: `sim-err-${currentSeq}-${Date.now()}`,
        seq: currentSeq,
        timestamp: new Date().toLocaleTimeString(),
        vehicleId: this.config.vehicleId,
        speed: this.config.speed,
        heading: this.config.heading,
        latitude: nextPos.latitude,
        longitude: nextPos.longitude,
        latencyMs: Date.now() - startMs,
        status: "error",
        message: `Write failure: ${errorMsg}`,
      };

      this.logs = [logEntry, ...this.logs.slice(0, 19)];
      this.notify();
      return null;
    }
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      config: { ...this.config },
      packetCount: this.seq,
      lastPacket: this.lastPacket,
      logs: this.logs,
    };
  }

  public clearLogs() {
    this.logs = [];
    this.notify();
  }
}

// Global Singleton Instance for the client app
export const simulatorEngine = new GpsSimulatorEngine();
