// app/dashbord/database/index.ts

// ============================================================
// FIREBASE AUTHENTICATION
// ============================================================

import { auth, db } from "@/lib/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// ============================================================
// USER ROLES
// ============================================================

export type UserRole =
  | "super_admin"
  | "manager"
  | "driver";

// ============================================================
// USER PROFILE
// ============================================================

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

// ============================================================
// SIGN UP
// ============================================================

export const signUp = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  return userCredential;
};

// ============================================================
// LOGIN
// ============================================================

export const login = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  return userCredential;
};

// ============================================================
// LOGOUT
// ============================================================

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// ============================================================
// CREATE USER PROFILE
// ============================================================

export const createUserProfile = async (
  uid: string,
  email: string,
  name: string,
  role: UserRole = "driver"
): Promise<UserProfile> => {
  const userRef = doc(db, "users", uid);

  const profile: UserProfile = {
    uid,
    email: email.trim(),
    name: name.trim() || "New User",
    role,
    createdAt: new Date().toISOString(),
  };

  await setDoc(userRef, profile);

  return profile;
};

// ============================================================
// GET USER PROFILE
// ============================================================

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
};

// ============================================================
// UPDATE USER ROLE
// ============================================================

export const updateUserRole = async (
  uid: string,
  role: UserRole
): Promise<void> => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    role,
  });
};

// ============================================================
// GET ALL USERS
// ============================================================

export const getAllUsers = async () => {
  const usersRef = collection(db, "users");

  const snapshot = await getDocs(usersRef);

  return snapshot.docs.map((userDoc) => ({
    id: userDoc.id,
    ...userDoc.data(),
  }));
};