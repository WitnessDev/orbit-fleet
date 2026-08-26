import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface Vehicle {
  id?: string;

  registrationNumber: string;

  make: string;

  model: string;

  year: number | null;

  color: string;

  status: string;

  driverId?: string | null;

  deviceId?: string | null;

  latitude: number | null;

  longitude: number | null;

  createdAt?: string;
}

/* =========================================
   GET ALL VEHICLES
========================================= */

export async function getVehicles(): Promise<Vehicle[]> {
  const snapshot = await getDocs(collection(db, "vehicles"));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Vehicle[];
}

/* =========================================
   CREATE VEHICLE
========================================= */

export async function createVehicle(
  vehicle: Omit<Vehicle, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, "vehicles"), {
    ...vehicle,
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

/* =========================================
   ADD VEHICLE
========================================= */

export async function addVehicle(
  vehicle: Omit<Vehicle, "id">
): Promise<string> {
  return createVehicle(vehicle);
}

/* =========================================
   UPDATE VEHICLE
========================================= */

export async function updateVehicle(
  id: string,
  vehicle: Partial<Vehicle>
): Promise<void> {
  const vehicleRef = doc(db, "vehicles", id);

  await updateDoc(vehicleRef, {
    ...vehicle,
  });
}

/* =========================================
   DELETE VEHICLE
========================================= */

export async function deleteVehicle(id: string): Promise<void> {
  const vehicleRef = doc(db, "vehicles", id);

  await deleteDoc(vehicleRef);
}