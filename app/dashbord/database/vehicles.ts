import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Vehicle, VehicleStatus } from "@/lib/types/vehicle";

export type { Vehicle, VehicleStatus };

const vehiclesCollection = collection(db, "vehicles");

/* ============================================================
   ADD VEHICLE (Day 7)
============================================================ */

export async function addVehicle(
  vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">
): Promise<Vehicle> {
  try {
    const now = new Date().toISOString();
    const vehicleData = {
      registrationNumber: vehicle.registrationNumber.trim().toUpperCase(),
      make: vehicle.make.trim(),
      model: vehicle.model.trim(),
      year: vehicle.year || null,
      color: vehicle.color?.trim() || "White",
      type: vehicle.type || "Van/Truck",
      status: vehicle.status || "offline",
      driverId: vehicle.driverId || null,
      driverName: vehicle.driverName || null,
      deviceId: vehicle.deviceId || null,
      deviceSerial: vehicle.deviceSerial || null,
      location: vehicle.location || "Central Garage",
      latitude: vehicle.latitude || -6.7924,
      longitude: vehicle.longitude || 39.2083,
      mileage: vehicle.mileage || 0,
      fuelLevel: vehicle.fuelLevel || 100,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(vehiclesCollection, vehicleData);

    return {
      id: docRef.id,
      ...vehicleData,
    };
  } catch (error) {
    console.error("Failed to add vehicle:", error);
    throw error;
  }
}

/* ============================================================
   GET ALL VEHICLES
============================================================ */

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const vehiclesQuery = query(vehiclesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(vehiclesQuery);

    return snapshot.docs.map((vehicleDoc) => ({
      id: vehicleDoc.id,
      ...vehicleDoc.data(),
    })) as Vehicle[];
  } catch {
    const snapshot = await getDocs(vehiclesCollection);
    return snapshot.docs.map((vehicleDoc) => ({
      id: vehicleDoc.id,
      ...vehicleDoc.data(),
    })) as Vehicle[];
  }
}

/* ============================================================
   SUBSCRIBE TO VEHICLES (Real-time Day 7)
============================================================ */

export function subscribeVehicles(
  onData: (vehicles: Vehicle[]) => void,
  onError?: (error: Error) => void
) {
  const vehiclesQuery = query(vehiclesCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    vehiclesQuery,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Vehicle[];
      onData(list);
    },
    () => {
      // Fallback query without orderBy
      const unsubFallback = onSnapshot(
        vehiclesCollection,
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Vehicle[];
          onData(list);
        },
        (error) => {
          if (onError) onError(error);
        }
      );
      return unsubFallback;
    }
  );
}

/* ============================================================
   GET SINGLE VEHICLE
============================================================ */

export async function getVehicle(
  vehicleId: string
): Promise<Vehicle | null> {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    const snapshot = await getDoc(vehicleRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Vehicle;
  } catch (error) {
    console.error("Failed to get vehicle:", error);
    throw error;
  }
}

/* ============================================================
   GET VEHICLE BY REGISTRATION NUMBER
============================================================ */

export async function getVehicleByRegistration(
  registrationNumber: string
): Promise<Vehicle | null> {
  try {
    const normalizedRegistration = registrationNumber.trim().toUpperCase();

    const vehiclesQuery = query(
      vehiclesCollection,
      where("registrationNumber", "==", normalizedRegistration)
    );

    const snapshot = await getDocs(vehiclesQuery);

    if (snapshot.empty) {
      return null;
    }

    const vehicleDoc = snapshot.docs[0];

    return {
      id: vehicleDoc.id,
      ...vehicleDoc.data(),
    } as Vehicle;
  } catch (error) {
    console.error("Failed to find vehicle by registration:", error);
    throw error;
  }
}

/* ============================================================
   UPDATE VEHICLE
============================================================ */

export async function updateVehicle(
  vehicleId: string,
  updates: Partial<Omit<Vehicle, "id" | "createdAt">>
): Promise<void> {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);

    await updateDoc(vehicleRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update vehicle:", error);
    throw error;
  }
}

/* ============================================================
   UPDATE VEHICLE STATUS
============================================================ */

export async function updateVehicleStatus(
  vehicleId: string,
  status: VehicleStatus
): Promise<void> {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);

    await updateDoc(vehicleRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update vehicle status:", error);
    throw error;
  }
}

/* ============================================================
   UPDATE VEHICLE LOCATION
============================================================ */

export async function updateVehicleLocation(
  vehicleId: string,
  latitude: number,
  longitude: number,
  locationName?: string
): Promise<void> {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);

    await updateDoc(vehicleRef, {
      latitude,
      longitude,
      ...(locationName ? { location: locationName } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update vehicle location:", error);
    throw error;
  }
}

/* ============================================================
   DELETE VEHICLE
============================================================ */

export async function deleteVehicle(vehicleId: string): Promise<void> {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    await deleteDoc(vehicleRef);
  } catch (error) {
    console.error("Failed to delete vehicle:", error);
    throw error;
  }
}

/* ============================================================
   VEHICLE STATISTICS
============================================================ */

export async function getVehicleStats() {
  try {
    const snapshot = await getDocs(vehiclesCollection);

    let online = 0;
    let idle = 0;
    let offline = 0;

    snapshot.forEach((vehicleDoc) => {
      const vehicle = vehicleDoc.data() as Partial<Vehicle>;

      if (vehicle.status === "online") {
        online++;
      } else if (vehicle.status === "idle") {
        idle++;
      } else {
        offline++;
      }
    });

    return {
      vehicles: snapshot.size,
      online,
      idle,
      offline,
    };
  } catch (error) {
    console.error("Failed to get vehicle statistics:", error);
    return {
      vehicles: 0,
      online: 0,
      idle: 0,
      offline: 0,
    };
  }
}

export const createVehicle = addVehicle;
