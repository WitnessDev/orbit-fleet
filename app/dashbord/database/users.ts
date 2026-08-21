import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type UserRole =
  | "super_admin"
  | "manager"
  | "driver";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export const createUserProfile = async (
  uid: string,
  email: string,
  name: string,
  role: UserRole = "driver"
) => {
  const userRef = doc(db, "users", uid);

  const profile: UserProfile = {
    uid,
    email,
    name,
    role,
    createdAt: new Date().toISOString(),
  };

  await setDoc(userRef, profile);

  return profile;
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
};

export const updateUserRole = async (
  uid: string,
  role: UserRole
) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    role,
  });
};

export const getAllUsers = async () => {
  const usersRef = collection(db, "users");

  const snapshot = await getDocs(usersRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};