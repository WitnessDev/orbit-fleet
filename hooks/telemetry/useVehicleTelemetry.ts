"use client";

import { useEffect, useState, useRef } from "react";
import type { TelemetryData, TelemetryStatus } from "@/types/telemetry";
import {
  subscribeToVehicleTelemetry,
  calculateTelemetryStatus,
} from "@/lib/telemetry/telemetryService";

interface UseVehicleTelemetryResult {
  telemetry: TelemetryData | null;
  status: TelemetryStatus;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useVehicleTelemetry(
  vehicleId?: string | null
): UseVehicleTelemetryResult {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [status, setStatus] = useState<TelemetryStatus>("offline");
  const [loading, setLoading] = useState<boolean>(Boolean(vehicleId));
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const telemetryRef = useRef<TelemetryData | null>(null);

  useEffect(() => {
    if (!vehicleId) {
      return;
    }

    const unsubscribe = subscribeToVehicleTelemetry(
      vehicleId,
      (data) => {
        telemetryRef.current = data;
        setTelemetry(data);
        if (data) {
          const newStatus = calculateTelemetryStatus(data.timestamp);
          setStatus(newStatus);
          setLastUpdated(new Date(data.timestamp));
        } else {
          setStatus("offline");
          setLastUpdated(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Failed to load telemetry stream.");
        setLoading(false);
      }
    );

    // Periodic freshness check every 5 seconds to update "live" -> "stale" -> "offline"
    const interval = setInterval(() => {
      if (telemetryRef.current?.timestamp) {
        setStatus(calculateTelemetryStatus(telemetryRef.current.timestamp));
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [vehicleId]);

  return {
    telemetry: vehicleId ? telemetry : null,
    status: vehicleId ? status : "offline",
    loading: vehicleId ? loading : false,
    error: vehicleId ? error : null,
    lastUpdated: vehicleId ? lastUpdated : null,
  };
}
