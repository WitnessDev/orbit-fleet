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
import type { GPSDevice, DeviceStatus } from "@/lib/types/device";

export type { GPSDevice, DeviceStatus };

const devicesCollection = collection(db, "devices");

/* ============================================================
   ADD GPS DEVICE (Day 9)
============================================================ */

export async function addDevice(
  device: Omit<GPSDevice, "id" | "createdAt" | "updatedAt">
): Promise<GPSDevice> {
  try {
    const now = new Date().toISOString();
    const deviceData = {
      deviceId: device.deviceId.trim().toUpperCase(),
      imei: device.imei.trim(),
      model: device.model.trim(),
      simNumber: device.simNumber?.trim() || "",
      status: device.status || "offline",
      vehicleId: device.vehicleId || null,
      vehicleRegistration: device.vehicleRegistration || null,
      lastLatitude: device.lastLatitude ?? null,
      lastLongitude: device.lastLongitude ?? null,
      batteryLevel: device.batteryLevel ?? 100,
      lastSeen: now,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(devicesCollection, deviceData);

    return {
      id: docRef.id,
      ...deviceData,
    };
  } catch (error) {
    console.error("Failed to add GPS device:", error);
    throw error;
  }
}

/* ============================================================
   GET ALL GPS DEVICES
============================================================ */

export async function getDevices(): Promise<GPSDevice[]> {
  try {
    const devicesQuery = query(devicesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(devicesQuery);

    return snapshot.docs.map((deviceDoc) => ({
      id: deviceDoc.id,
      ...deviceDoc.data(),
    })) as GPSDevice[];
  } catch {
    const snapshot = await getDocs(devicesCollection);
    return snapshot.docs.map((deviceDoc) => ({
      id: deviceDoc.id,
      ...deviceDoc.data(),
    })) as GPSDevice[];
  }
}

/* ============================================================
   SUBSCRIBE TO GPS DEVICES (Real-time Day 9)
============================================================ */

export function subscribeDevices(
  onData: (devices: GPSDevice[]) => void,
  onError?: (error: Error) => void
) {
  const devicesQuery = query(devicesCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    devicesQuery,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as GPSDevice[];
      onData(list);
    },
    () => {
      return onSnapshot(
        devicesCollection,
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as GPSDevice[];
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
   GET SINGLE GPS DEVICE
============================================================ */

export async function getDevice(deviceId: string): Promise<GPSDevice | null> {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    const snapshot = await getDoc(deviceRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as GPSDevice;
  } catch (error) {
    console.error("Failed to get device:", error);
    throw error;
  }
}

/* ============================================================
   UPDATE GPS DEVICE
============================================================ */

export async function updateDevice(
  deviceId: string,
  updates: Partial<Omit<GPSDevice, "id" | "createdAt">>
): Promise<void> {
  try {
    const deviceRef = doc(db, "devices", deviceId);

    await updateDoc(deviceRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update GPS device:", error);
    throw error;
  }
}

/* ============================================================
   DELETE GPS DEVICE
============================================================ */

export async function deleteDevice(deviceId: string): Promise<void> {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    await deleteDoc(deviceRef);
  } catch (error) {
    console.error("Failed to delete GPS device:", error);
    throw error;
  }
}

/* ============================================================
   GPS DEVICE STATISTICS
============================================================ */

export async function getDeviceStats() {
  try {
    const snapshot = await getDocs(devicesCollection);

    let online = 0;
    let offline = 0;
    let inactive = 0;
    let assigned = 0;

    snapshot.forEach((docSnap) => {
      const d = docSnap.data() as Partial<GPSDevice>;
      if (d.status === "online") online++;
      else if (d.status === "offline") offline++;
      else if (d.status === "inactive") inactive++;

      if (d.vehicleId) assigned++;
    });

    return {
      total: snapshot.size,
      online,
      offline,
      inactive,
      assigned,
    };
  } catch (error) {
    console.error("Failed to get device statistics:", error);
    return {
      total: 0,
      online: 0,
      offline: 0,
      inactive: 0,
      assigned: 0,
    };
  }
}
