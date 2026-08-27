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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Driver, DriverStatus } from "@/lib/types/driver";

export type { Driver, DriverStatus };

const driversCollection = collection(db, "drivers");

/* ============================================================
   ADD DRIVER (Day 8)
============================================================ */

export async function addDriver(
  driver: Omit<Driver, "id" | "createdAt" | "updatedAt">
): Promise<Driver> {
  try {
    const now = new Date().toISOString();
    const driverData = {
      name: driver.name.trim(),
      email: driver.email?.trim() || "",
      phone: driver.phone.trim(),
      licenseNumber: driver.licenseNumber.trim().toUpperCase(),
      status: driver.status || "available",
      vehicleId: driver.vehicleId || null,
      vehicleRegistration: driver.vehicleRegistration || null,
      experienceYears: driver.experienceYears || 0,
      notes: driver.notes?.trim() || "",
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(driversCollection, driverData);

    return {
      id: docRef.id,
      ...driverData,
    };
  } catch (error) {
    console.error("Failed to add driver:", error);
    throw error;
  }
}

/* ============================================================
   GET ALL DRIVERS
============================================================ */

export async function getDrivers(): Promise<Driver[]> {
  try {
    const driversQuery = query(driversCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(driversQuery);

    return snapshot.docs.map((driverDoc) => ({
      id: driverDoc.id,
      ...driverDoc.data(),
    })) as Driver[];
  } catch {
    const snapshot = await getDocs(driversCollection);
    return snapshot.docs.map((driverDoc) => ({
      id: driverDoc.id,
      ...driverDoc.data(),
    })) as Driver[];
  }
}

/* ============================================================
   SUBSCRIBE TO DRIVERS (Real-time Day 8)
============================================================ */

export function subscribeDrivers(
  onData: (drivers: Driver[]) => void,
  onError?: (error: Error) => void
) {
  const driversQuery = query(driversCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    driversQuery,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Driver[];
      onData(list);
    },
    () => {
      return onSnapshot(
        driversCollection,
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Driver[];
          onData(list);
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    }
  );
}

/* ============================================================
   GET SINGLE DRIVER
============================================================ */

export async function getDriver(driverId: string): Promise<Driver | null> {
  try {
    const driverRef = doc(db, "drivers", driverId);
    const snapshot = await getDoc(driverRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Driver;
  } catch (error) {
    console.error("Failed to get driver:", error);
    throw error;
  }
}

/* ============================================================
   UPDATE DRIVER
============================================================ */

export async function updateDriver(
  driverId: string,
  updates: Partial<Omit<Driver, "id" | "createdAt">>
): Promise<void> {
  try {
    const driverRef = doc(db, "drivers", driverId);

    await updateDoc(driverRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update driver:", error);
    throw error;
  }
}

/* ============================================================
   DELETE DRIVER
============================================================ */

export async function deleteDriver(driverId: string): Promise<void> {
  try {
    const driverRef = doc(db, "drivers", driverId);
    await deleteDoc(driverRef);
  } catch (error) {
    console.error("Failed to delete driver:", error);
    throw error;
  }
}

/* ============================================================
   DRIVER STATISTICS
============================================================ */

export async function getDriverStats() {
  try {
    const snapshot = await getDocs(driversCollection);

    let available = 0;
    let onTrip = 0;
    let offDuty = 0;
    let suspended = 0;

    snapshot.forEach((docSnap) => {
      const d = docSnap.data() as Partial<Driver>;
      if (d.status === "available") available++;
      else if (d.status === "on_trip") onTrip++;
      else if (d.status === "off_duty") offDuty++;
      else if (d.status === "suspended") suspended++;
    });

    return {
      total: snapshot.size,
      available,
      onTrip,
      offDuty,
      suspended,
    };
  } catch (error) {
    console.error("Failed to get driver statistics:", error);
    return {
      total: 0,
      available: 0,
      onTrip: 0,
      offDuty: 0,
      suspended: 0,
    };
  }
}
