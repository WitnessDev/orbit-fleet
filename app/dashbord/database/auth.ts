import { auth } from "@/lib/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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