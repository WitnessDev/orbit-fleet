import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  FleetTelemetryItem,
  TelemetryData,
  TelemetryStatus,
  VehicleLocation,
} from "@/types/telemetry";
import type { Vehicle } from "@/lib/types/vehicle";


const telemetryCollection = collection(db, "telemetry");
const vehiclesCollection = collection(db, "vehicles");
const devicesCollection = collection(db, "devices");

/**
 * Validates GPS telemetry data bounds according to standard geodesic rules.
 */
export function validateTelemetry(data: Partial<TelemetryData>): {
  valid: boolean;
  error?: string;
} {
  if (typeof data.latitude !== "number" || isNaN(data.latitude)) {
    return { valid: false, error: "Invalid or missing latitude coordinate." };
  }
  if (data.latitude < -90 || data.latitude > 90) {
    return { valid: false, error: "Latitude must be between -90 and 90 degrees." };
  }

  if (typeof data.longitude !== "number" || isNaN(data.longitude)) {
    return { valid: false, error: "Invalid or missing longitude coordinate." };
  }
  if (data.longitude < -180 || data.longitude > 180) {
    return { valid: false, error: "Longitude must be between -180 and 180 degrees." };
  }

  if (typeof data.speed !== "number" || isNaN(data.speed) || data.speed < 0) {
    return { valid: false, error: "Speed must be a non-negative number." };
  }

  if (typeof data.heading !== "number" || isNaN(data.heading) || data.heading < 0 || data.heading > 360) {
    return { valid: false, error: "Heading must be between 0 and 360 degrees." };
  }

  if (!data.timestamp) {
    return { valid: false, error: "Missing telemetry timestamp." };
  }

  const timestampMs = new Date(data.timestamp).getTime();
  if (isNaN(timestampMs)) {
    return { valid: false, error: "Invalid timestamp date format." };
  }

  return { valid: true };
}

/**
 * Calculates telemetry freshness status based on timestamp age.
 */
export function calculateTelemetryStatus(
  timestampStr?: string | null,
  liveThresholdSec = 20,
  staleThresholdSec = 75
): TelemetryStatus {
  if (!timestampStr) return "offline";

  const time = new Date(timestampStr).getTime();
  if (isNaN(time)) return "unknown";

  const diffSec = (Date.now() - time) / 1000;

  if (diffSec <= liveThresholdSec) return "live";
  if (diffSec <= staleThresholdSec) return "stale";
  return "offline";
}

/**
 * Writes a new telemetry packet to Firestore and updates the vehicle's current state.
 */
export async function writeTelemetry(
  telemetry: Omit<TelemetryData, "id">
): Promise<TelemetryData> {
  const validation = validateTelemetry(telemetry);
  if (!validation.valid) {
    throw new Error(`Telemetry validation failed: ${validation.error}`);
  }

  const now = new Date().toISOString();
  const packet: Omit<TelemetryData, "id"> = {
    vehicleId: telemetry.vehicleId,
    deviceId: telemetry.deviceId || "GPS-UNASSIGNED",
    latitude: Number(telemetry.latitude.toFixed(6)),
    longitude: Number(telemetry.longitude.toFixed(6)),
    speed: Math.round(telemetry.speed),
    heading: Math.round(telemetry.heading % 360),
    accuracy: telemetry.accuracy ?? 5,
    timestamp: telemetry.timestamp || now,
    locationName: telemetry.locationName || "Transit Area",
    isSimulated: telemetry.isSimulated ?? false,
    odometer: telemetry.odometer,
    fuelLevel: telemetry.fuelLevel,
  };

  try {
    // 1. Write historical telemetry entry
    const docRef = await addDoc(telemetryCollection, packet);

    // 2. Update current state in vehicles/{vehicleId}
    if (packet.vehicleId) {
      try {
        const vehicleRef = doc(db, "vehicles", packet.vehicleId);
        const derivedStatus = packet.speed > 3 ? "online" : "idle";

        await updateDoc(vehicleRef, {
          latitude: packet.latitude,
          longitude: packet.longitude,
          currentSpeed: packet.speed,
          currentHeading: packet.heading,
          location: packet.locationName,
          status: derivedStatus,
          lastUpdated: packet.timestamp,
          updatedAt: now,
        });
      } catch (vehErr) {
        console.warn("Could not update vehicle current location doc:", vehErr);
      }
    }

    // 3. Update device last seen if matching device exists
    if (packet.deviceId && packet.deviceId !== "GPS-UNASSIGNED") {
      try {
        const devQuery = query(
          devicesCollection,
          where("deviceId", "==", packet.deviceId.toUpperCase()),
          limit(1)
        );
        const devSnapshot = await getDocs(devQuery);
        if (!devSnapshot.empty) {
          const targetDevDoc = devSnapshot.docs[0];
          await updateDoc(targetDevDoc.ref, {
            lastLatitude: packet.latitude,
            lastLongitude: packet.longitude,
            lastSeen: packet.timestamp,
            status: "online",
            updatedAt: now,
          });
        }
      } catch (devErr) {
        console.warn("Could not update device doc:", devErr);
      }
    }

    return {
      id: docRef.id,
      ...packet,
    };
  } catch (error) {
    console.error("Failed to write telemetry:", error);
    throw error;
  }
}

/**
 * Updates vehicle's current location directly.
 */
export async function updateVehicleCurrentLocation(
  vehicleId: string,
  location: VehicleLocation
): Promise<void> {
  const vehicleRef = doc(db, "vehicles", vehicleId);
  const now = new Date().toISOString();
  await updateDoc(vehicleRef, {
    latitude: location.latitude,
    longitude: location.longitude,
    currentSpeed: location.speed,
    currentHeading: location.heading,
    location: location.locationName || "Transit Area",
    status: location.speed > 3 ? "online" : "idle",
    lastUpdated: location.timestamp || now,
    updatedAt: now,
  });
}

/**
 * Retrieves the latest telemetry entry for a vehicle.
 */
export async function getLatestVehicleTelemetry(
  vehicleId: string
): Promise<TelemetryData | null> {
  try {
    const q = query(
      telemetryCollection,
      where("vehicleId", "==", vehicleId),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const d = snapshot.docs[0];
      return { id: d.id, ...d.data() } as TelemetryData;
    }
    return null;
  } catch (error) {
    console.warn("Failed to get latest telemetry:", error);
    return null;
  }
}

/**
 * Retrieves recent telemetry history for trail/breadcrumbs or analytics.
 */
export async function getVehicleTelemetryHistory(
  vehicleId: string,
  limitCount = 25
): Promise<TelemetryData[]> {
  try {
    const q = query(
      telemetryCollection,
      where("vehicleId", "==", vehicleId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as TelemetryData[];
  } catch {
    // Fallback without composite index if necessary
    try {
      const qFallback = query(
        telemetryCollection,
        where("vehicleId", "==", vehicleId),
        limit(limitCount)
      );
      const snapshot = await getDocs(qFallback);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as TelemetryData[];
      return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  }
}

/**
 * Subscribes to real-time telemetry for a specific vehicle.
 */
export function subscribeToVehicleTelemetry(
  vehicleId: string,
  onData: (telemetry: TelemetryData | null) => void,
  onError?: (err: Error) => void
): () => void {
  if (!vehicleId) {
    onData(null);
    return () => {};
  }

  // Real-time listener on vehicle doc (primary source of low-latency current state)
  const vehicleRef = doc(db, "vehicles", vehicleId);

  const unsubVehicle = onSnapshot(
    vehicleRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const v = docSnap.data() as Vehicle & {
          currentSpeed?: number;
          currentHeading?: number;
          lastUpdated?: string;
        };

        if (typeof v.latitude === "number" && typeof v.longitude === "number") {
          const telemetryItem: TelemetryData = {
            id: docSnap.id,
            vehicleId: docSnap.id,
            deviceId: v.deviceSerial || v.deviceId || "GPS-ACTIVE",
            latitude: v.latitude,
            longitude: v.longitude,
            speed: v.currentSpeed ?? (v.status === "online" ? 55 : 0),
            heading: v.currentHeading ?? 90,
            accuracy: 5,
            timestamp: (v.lastUpdated as string) || (v.updatedAt as string) || new Date().toISOString(),
            locationName: v.location || "Central Area",
          };
          onData(telemetryItem);
          return;
        }
      }
      onData(null);
    },
    (err) => {
      console.warn("Telemetry subscription error:", err);
      if (onError) onError(err);
    }
  );

  return unsubVehicle;
}

/**
 * Subscribes to fleet-wide real-time telemetry updates.
 */
export function subscribeToFleetTelemetry(
  onData: (items: FleetTelemetryItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  return onSnapshot(
    vehiclesCollection,
    (snapshot) => {
      const items: FleetTelemetryItem[] = snapshot.docs.map((docSnap) => {
        const v = docSnap.data() as Vehicle & {
          currentSpeed?: number;
          currentHeading?: number;
          lastUpdated?: string;
        };

        const lastUpdated =
          (v.lastUpdated as string) ||
          (v.updatedAt as string) ||
          new Date().toISOString();

        const telemetryStatus = calculateTelemetryStatus(lastUpdated);

        return {
          vehicleId: docSnap.id,
          registrationNumber: v.registrationNumber || "UNREGISTERED",
          make: v.make || "Fleet",
          model: v.model || "Vehicle",
          driverName: v.driverName,
          deviceId: v.deviceId,
          deviceSerial: v.deviceSerial,
          location: v.location || "Arusha",
          latitude: typeof v.latitude === "number" ? v.latitude : -3.3869,
          longitude: typeof v.longitude === "number" ? v.longitude : 36.683,
          speed: v.currentSpeed ?? (v.status === "online" ? 54 : 0),
          heading: v.currentHeading ?? 90,
          accuracy: 5,
          status: v.status || "offline",
          telemetryStatus,
          lastUpdated,
        };
      });

      onData(items);
    },
    (error) => {
      console.error("Fleet telemetry subscription error:", error);
      if (onError) onError(error);
    }
  );
}
