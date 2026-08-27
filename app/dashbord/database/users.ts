import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import type { UserProfile, UserRole } from "@/lib/types/user";

export type { UserProfile, UserRole };

const usersCollection = collection(db, "users");

/* ============================================================
   CREATE USER PROFILE (Day 5)
============================================================ */

export const createUserProfile = async (
  uid: string,
  email: string,
  name: string,
  role: UserRole = "driver",
  phone?: string,
  department?: string
): Promise<UserProfile> => {
  const userRef = doc(db, "users", uid);

  const profile: UserProfile = {
    uid,
    email: email.trim(),
    name: name.trim() || "New User",
    role,
    phone: phone?.trim() || "",
    department: department?.trim() || "Operations",
    createdAt: new Date().toISOString(),
  };

  await setDoc(userRef, profile, { merge: true });

  return profile;
};

/* ============================================================
   GET USER PROFILE
============================================================ */

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as UserProfile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

/* ============================================================
   UPDATE USER ROLE (Day 5 RBAC)
============================================================ */

export const updateUserRole = async (
  uid: string,
  role: UserRole
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    role,
    updatedAt: new Date().toISOString(),
  });
};

/* ============================================================
   UPDATE USER PROFILE
============================================================ */

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

/* ============================================================
   GET ALL USERS (Day 5 User Management)
============================================================ */

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersQuery = query(usersCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(usersQuery);

    return snapshot.docs.map((userDoc) => ({
      uid: userDoc.id,
      ...userDoc.data(),
    })) as UserProfile[];
  } catch {
    // Fallback if index on createdAt is building
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map((userDoc) => ({
      uid: userDoc.id,
      ...userDoc.data(),
    })) as UserProfile[];
  }
};

/* ============================================================
   DELETE USER PROFILE
============================================================ */

export const deleteUserProfile = async (uid: string): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
};
