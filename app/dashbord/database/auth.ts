import { auth } from "@/lib/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from "firebase/auth";

/* ============================================================
   SIGN UP
============================================================ */

export const signUp = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
};

/* ============================================================
   LOGIN
============================================================ */

export const login = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
};

/* ============================================================
   LOGOUT
============================================================ */

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

/* ============================================================
   PASSWORD RESET (Day 4)
============================================================ */

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};

/* ============================================================
   AUTH STATE LISTENER
============================================================ */

export const onAuthUserChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
