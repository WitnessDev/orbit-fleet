import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* ============================================================
   VEHICLE TYPES
============================================================ */

export type VehicleStatus = "online" | "idle" | "offline";

export interface Vehicle {
  id?: string;

  registrationNumber: string;
  make: string;
  model: string;
  year?: number;

  color?: string;
  type?: string;

  driverId?: string | null;
  driverName?: string | null;

  deviceId?: string | null;

  status: VehicleStatus;

  latitude?: number | null;
  longitude?: number | null;

  mileage?: number;
  fuelLevel?: number;

  createdAt?: unknown;
  updatedAt?: unknown;
}

/* ============================================================
   COLLECTION
============================================================ */

const vehiclesCollection = collection(db, "vehicles");

/* ============================================================
   ADD VEHICLE
============================================================ */

export async function addVehicle(
  vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">
) {
  try {
    const vehicleData = {
      ...vehicle,

      registrationNumber: vehicle.registrationNumber.trim(),
      make: vehicle.make.trim(),
      model: vehicle.model.trim(),

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
    const vehiclesQuery = query(
      vehiclesCollection,
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(vehiclesQuery);

    return snapshot.docs.map((vehicleDoc) => ({
      id: vehicleDoc.id,
      ...vehicleDoc.data(),
    })) as Vehicle[];
  } catch (error) {
    console.error("Failed to get vehicles:", error);
    throw error;
  }
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
    const normalizedRegistration = registrationNumber
      .trim()
      .toUpperCase();

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
    console.error(
      "Failed to find vehicle by registration:",
      error
    );

    throw error;
  }
}

/* ============================================================
   UPDATE VEHICLE
============================================================ */

export async function updateVehicle(
  vehicleId: string,
  updates: Partial<Omit<Vehicle, "id" | "createdAt">>
) {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);

    await updateDoc(vehicleRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return true;
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
) {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);

    await updateDoc(vehicleRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    return true;
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
  longitude: number
) {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);

    await updateDoc(vehicleRef, {
      latitude,
      longitude,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Failed to update vehicle location:", error);
    throw error;
  }
}

/* ============================================================
   DELETE VEHICLE
============================================================ */

export async function deleteVehicle(vehicleId: string) {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);

    await deleteDoc(vehicleRef);

    return true;
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
      const vehicle = vehicleDoc.data();

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
    throw error;
  }
}