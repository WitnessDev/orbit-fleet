"use client";

import { useEffect, useState, useMemo } from "react";
import type { FleetTelemetryItem } from "@/types/telemetry";
import { subscribeToFleetTelemetry } from "@/lib/telemetry/telemetryService";

interface FleetStats {
  total: number;
  live: number;
  moving: number;
  idle: number;
  offline: number;
  avgSpeed: number;
}

interface UseFleetTelemetryResult {
  fleet: FleetTelemetryItem[];
  loading: boolean;
  error: string | null;
  stats: FleetStats;
  getVehicleById: (id: string) => FleetTelemetryItem | undefined;
}

export function useFleetTelemetry(): UseFleetTelemetryResult {
  const [fleet, setFleet] = useState<FleetTelemetryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToFleetTelemetry(
      (items) => {
        setFleet(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Failed to subscribe to fleet telemetry.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const stats = useMemo<FleetStats>(() => {
    if (fleet.length === 0) {
      return { total: 0, live: 0, moving: 0, idle: 0, offline: 0, avgSpeed: 0 };
    }

    let liveCount = 0;
    let movingCount = 0;
    let idleCount = 0;
    let offlineCount = 0;
    let totalSpeed = 0;

    fleet.forEach((item) => {
      if (item.telemetryStatus === "live") {
        liveCount++;
      } else if (item.telemetryStatus === "offline") {
        offlineCount++;
      }

      if (item.speed > 3) {
        movingCount++;
        totalSpeed += item.speed;
      } else if (item.status === "idle" || item.speed <= 3) {
        idleCount++;
      }
    });

    const avgSpeed = movingCount > 0 ? Math.round(totalSpeed / movingCount) : 0;

    return {
      total: fleet.length,
      live: liveCount,
      moving: movingCount,
      idle: idleCount,
      offline: offlineCount,
      avgSpeed,
    };
  }, [fleet]);

  const getVehicleById = (id: string) => fleet.find((v) => v.vehicleId === id);

  return {
    fleet,
    loading,
    error,
    stats,
    getVehicleById,
  };
}
