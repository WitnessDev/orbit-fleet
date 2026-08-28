"use client";

import { useState, useEffect } from "react";
import type { UserRole } from "@/types/user";
import { OFFICIAL_ROLES } from "./permissions";
import { onAuthUserChanged, getUserProfile } from "@/app/dashbord/database";

const ACTIVE_ROLE_KEY = "orbit_fleet_active_role";

let globalRoleListeners: Array<(role: UserRole) => void> = [];

export function setOrbitActiveRole(role: UserRole) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
  }
  globalRoleListeners.forEach((listener) => listener(role));
}

function getInitialRole(): UserRole {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole | null;
    if (saved && OFFICIAL_ROLES[saved]) {
      return saved;
    }
  }
  return "owner";
}

export function useCurrentRole(): {
  role: UserRole;
  roleConfig: typeof OFFICIAL_ROLES[UserRole];
  setRole: (role: UserRole) => void;
  canAccess: (permission: string) => boolean;
} {
  const [role, setRoleState] = useState<UserRole>(getInitialRole);

  useEffect(() => {
    // Listen to Firebase auth if available
    const unsubAuth = onAuthUserChanged(async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile && profile.role && OFFICIAL_ROLES[profile.role as UserRole]) {
            setRoleState(profile.role as UserRole);
          }
        } catch {
          // ignore error
        }
      }
    });

    const listener = (newRole: UserRole) => {
      setRoleState(newRole);
    };
    globalRoleListeners.push(listener);

    return () => {
      globalRoleListeners = globalRoleListeners.filter((l) => l !== listener);
      unsubAuth();
    };
  }, []);

  const roleConfig = OFFICIAL_ROLES[role] || OFFICIAL_ROLES.owner;

  const canAccess = (permission: string) => {
    return roleConfig.permissions.includes(permission);
  };

  return {
    role,
    roleConfig,
    setRole: (newRole: UserRole) => setOrbitActiveRole(newRole),
    canAccess,
  };
}
