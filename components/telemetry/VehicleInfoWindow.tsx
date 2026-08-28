"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Gauge,
  Compass,
  MapPin,
  Clock,
  Radio,
  Cpu,
  User,
  ArrowRight,
} from "lucide-react";
import type { TelemetryData, TelemetryStatus } from "@/types/telemetry";
import { getCardinalDirection } from "./HeadingCompass";

interface VehicleInfoWindowProps {
  registrationNumber: string;
  makeModel: string;
  driverName?: string | null;
  deviceId?: string | null;
  status: string;
  telemetryStatus: TelemetryStatus;
  telemetry?: TelemetryData | null;
  onClose?: () => void;
  onOpenSimulator?: () => void;
  className?: string;
}

function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return "Never";
  const time = new Date(isoString).getTime();
  if (isNaN(time)) return "Unknown";

  const diffSec = Math.floor((Date.now() - time) / 1000);
  if (diffSec < 4) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function VehicleInfoWindow({
  registrationNumber,
  makeModel,
  driverName,
  deviceId,
  status,
  telemetryStatus,
  telemetry,
  onClose,
  onOpenSimulator,
  className = "",
}: VehicleInfoWindowProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const cardinal = getCardinalDirection(telemetry?.heading);
  const relativeTime = formatRelativeTime(telemetry?.timestamp);
  const speed = telemetry?.speed ?? 0;
  const isMoving = speed > 3;

  return (
    <div
      id="vehicle-info-window"
      className={`rounded-2xl border border-slate-700/80 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-md transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-emerald-400">
              {registrationNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                isMoving
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : status === "idle"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isMoving
                    ? "bg-emerald-400 animate-pulse"
                    : status === "idle"
                    ? "bg-amber-400"
                    : "bg-slate-500"
                }`}
              />
              {isMoving ? "Moving" : status === "idle" ? "Parked" : "Offline"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{makeModel}</p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <div className="rounded-xl bg-slate-900/80 p-2.5 border border-slate-800">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
            <Gauge className="h-3 w-3 text-emerald-400" /> Velocity
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-mono text-xl font-bold text-slate-100">
              {Math.round(speed)}
            </span>
            <span className="text-[10px] text-slate-400">km/h</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-2.5 border border-slate-800">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
            <Compass className="h-3 w-3 text-emerald-400" /> Heading
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-mono text-xl font-bold text-slate-100">
              {telemetry ? `${Math.round(telemetry.heading)}°` : "--°"}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {cardinal.code}
            </span>
          </div>
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-1.5 text-xs text-slate-300">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <MapPin className="h-3 w-3 text-emerald-400" /> Location
          </span>
          <span className="font-medium text-slate-200 truncate max-w-[150px]">
            {telemetry?.locationName || "Arusha Hub"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Clock className="h-3 w-3 text-emerald-400" /> Last Update
          </span>
          <span className="text-[11px] text-slate-300">{relativeTime}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Cpu className="h-3 w-3 text-emerald-400" /> GPS Unit
          </span>
          <span className="font-mono text-[11px] text-slate-200">
            {deviceId || telemetry?.deviceId || "GPS-ACTIVE"}
          </span>
        </div>

        {driverName && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <User className="h-3 w-3 text-emerald-400" /> Driver
            </span>
            <span className="text-slate-200 truncate max-w-[140px]">
              {driverName}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
          <span className="text-slate-400">Connection State:</span>
          <span
            className={`inline-flex items-center gap-1 font-bold ${
              telemetryStatus === "live"
                ? "text-emerald-400"
                : telemetryStatus === "stale"
                ? "text-amber-400"
                : "text-slate-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                telemetryStatus === "live"
                  ? "bg-emerald-400 animate-ping"
                  : telemetryStatus === "stale"
                  ? "bg-amber-400"
                  : "bg-slate-400"
              }`}
            />
            {telemetryStatus === "live" ? "Connected (Live)" : telemetryStatus === "stale" ? "Stale Signal" : "Disconnected"}
          </span>
        </div>
      </div>

      {onOpenSimulator && (
        <button
          type="button"
          onClick={onOpenSimulator}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600/30 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/30 transition"
        >
          <Radio className="h-3.5 w-3.5" /> Simulate This Vehicle <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
