"use client";

import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthUserChanged } from "@/app/dashbord/database/auth";
import { createUserProfile, type UserProfile } from "@/app/dashbord/database/users";
import { OFFICIAL_ROLES, type UserRole } from "./permissions";

interface CurrentRoleState {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  roleConfig: (typeof OFFICIAL_ROLES)[UserRole];
  canAccess: (permission: string) => boolean;
  loading: boolean;
  error: string | null;
}

export function useCurrentRole(): CurrentRoleState {
  const [user, setUser] = useState<User | null>(() => auth.currentUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>("driver");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthUserChanged(async (currentUser) => {
      setUser(currentUser);

      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (!currentUser) {
        setProfile(null);
        setRole("driver");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userDocRef = doc(db, "users", currentUser.uid);

        // Check if user document exists; if not, create initial profile in Firestore
        const initialSnap = await getDoc(userDocRef);
        if (!initialSnap.exists()) {
          // Identify initial default role based on account
          const emailLower = (currentUser.email || "").toLowerCase();
          let defaultRole: UserRole = "driver";
          if (
            emailLower.includes("kivuyowitness") ||
            emailLower.includes("witness.kivuyo") ||
            emailLower.includes("owner") ||
            emailLower.includes("admin")
          ) {
            defaultRole = "fleet_manager";
          }

          const newProfile = await createUserProfile(
            currentUser.uid,
            currentUser.email || "",
            currentUser.displayName || currentUser.email?.split("@")[0] || "User",
            defaultRole
          );
          setProfile(newProfile);
          setRole(newProfile.role as UserRole);
        }

        // Subscribe to real-time updates of the user profile document in Firestore
        unsubscribeDoc = onSnapshot(
          userDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as UserProfile;
              const validatedRole =
                data.role && OFFICIAL_ROLES[data.role as UserRole]
                  ? (data.role as UserRole)
                  : "driver";

              setProfile(data);
              setRole(validatedRole);
              setError(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error("Error listening to user profile in Firestore:", err);
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Failed to initialize user profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load user profile");
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, []);

  const roleConfig = OFFICIAL_ROLES[role] || OFFICIAL_ROLES.driver;

  const canAccess = (permission: string): boolean => {
    return roleConfig.permissions.includes(permission);
  };

  return {
    user,
    profile,
    role,
    roleConfig,
    canAccess,
    loading,
    error,
  };
}
