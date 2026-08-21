import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABm0fIPCBWHkABYraK1rjJx9ahpjqqfqg",
  authDomain: "orbit-fleet-dev.firebaseapp.com",
  projectId: "orbit-fleet-dev",
  storageBucket: "orbit-fleet-dev.firebasestorage.app",
  messagingSenderId: "27016802949",
  appId: "1:27016802949:web:d19c4d8280cdb44bb7efec",
  measurementId: "G-C7K5XPJG4K",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;