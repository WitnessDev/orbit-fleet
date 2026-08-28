"use client";

import React, { useEffect, useState } from "react";
import {
  Radio,
  MapPin,
  Clock,
  Cpu,
  Navigation,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { TelemetryData, TelemetryStatus } from "@/types/telemetry";
import { getCardinalDirection } from "./HeadingCompass";

interface TelemetryCardProps {
  registrationNumber: string;
  makeModel?: string;
  driverName?: string | null;
  deviceId?: string | null;
  telemetry: TelemetryData | null;
  status: TelemetryStatus;
  loading?: boolean;
  className?: string;
  onOpenSimulator?: () => void;
}

/**
 * Formats relative time elapsed from an ISO timestamp string.
 */
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

export default function TelemetryCard({
  registrationNumber,
  makeModel = "Fleet Vehicle",
  driverName,
  deviceId,
  telemetry,
  status,
  loading = false,
  className = "",
  onOpenSimulator,
}: TelemetryCardProps) {
  const [, setTick] = useState(0);

  // Update relative timestamps every 3s
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(timer);
  }, []);

  const cardinal = getCardinalDirection(telemetry?.heading);
  const relativeTime = formatRelativeTime(telemetry?.timestamp);

  // Status visual badge styling
  const statusConfig: Record<
    TelemetryStatus,
    { label: string; bg: string; dot: string; text: string; pulse: boolean }
  > = {
    live: {
      label: "LIVE STREAM",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      pulse: true,
    },
    stale: {
      label: "STALE SIGNAL",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      text: "text-amber-700",
      pulse: false,
    },
    offline: {
      label: "OFFLINE",
      bg: "bg-slate-100 text-slate-600 border-slate-200",
      dot: "bg-slate-400",
      text: "text-slate-600",
      pulse: false,
    },
    unknown: {
      label: "UNKNOWN",
      bg: "bg-slate-100 text-slate-500 border-slate-200",
      dot: "bg-slate-400",
      text: "text-slate-500",
      pulse: false,
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.unknown;

  return (
    <div
      id="telemetry-summary-card"
      className={`rounded-2xl border border-border bg-white p-5 shadow-xs transition hover:shadow-sm ${className}`}
    >
      {/* Header with Registration & Live Badge */}
      <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-text-primary">
              {registrationNumber}
            </span>
            {telemetry?.isSimulated && (
              <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">
                SIMULATED
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted">
            {makeModel} {driverName ? `• ${driverName}` : ""}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase border ${currentStatus.bg}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${currentStatus.dot} ${
                currentStatus.pulse ? "animate-pulse" : ""
              }`}
            />
            {currentStatus.label}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-text-muted">
            <Clock className="h-3 w-3" />
            {relativeTime}
          </span>
        </div>
      </div>

      {/* Main Telemetry Stats Grid */}
      <div className="grid grid-cols-2 gap-3 py-4">
        {/* Speed & Motion */}
        <div className="rounded-xl bg-surface p-3 border border-border/50">
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Speed
            </span>
            <Zap className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-extrabold text-text-primary">
              {telemetry ? Math.round(telemetry.speed) : "--"}
            </span>
            <span className="text-xs font-semibold text-text-muted">km/h</span>
          </div>
          <p className="text-[11px] font-medium text-text-secondary mt-0.5">
            {loading
              ? "Reading sensor..."
              : telemetry && telemetry.speed > 3
              ? "● In Transit"
              : "○ Idle / Parked"}
          </p>
        </div>

        {/* Heading & Orientation */}
        <div className="rounded-xl bg-surface p-3 border border-border/50">
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Heading
            </span>
            <Navigation
              className="h-3.5 w-3.5 text-primary transition-transform duration-300"
              style={{
                transform: `rotate(${telemetry?.heading ?? 0}deg)`,
              }}
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-bold text-text-primary">
              {telemetry ? `${Math.round(telemetry.heading)}°` : "--°"}
            </span>
            <span className="text-xs font-medium text-text-muted">
              {cardinal.code}
            </span>
          </div>
          <p className="text-[11px] font-medium text-text-secondary mt-0.5 truncate">
            {cardinal.arrow} {cardinal.name}
          </p>
        </div>
      </div>

      {/* Location & GPS Device Details */}
      <div className="space-y-2 border-t border-border pt-3 text-xs text-text-secondary">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-muted">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Current Area
          </span>
          <span className="font-medium text-text-primary truncate max-w-[180px]">
            {telemetry?.locationName || "Arusha Transit Corridor"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Radio className="h-3.5 w-3.5 text-primary" /> Coordinates
          </span>
          <span className="font-mono text-[11px] text-text-primary">
            {telemetry
              ? `${telemetry.latitude.toFixed(4)}, ${telemetry.longitude.toFixed(4)}`
              : "-- , --"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Cpu className="h-3.5 w-3.5 text-primary" /> Telemetry Unit
          </span>
          <span className="font-mono text-[11px] text-text-primary">
            {deviceId || telemetry?.deviceId || "GPS-ACTIVE"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> GPS Precision
          </span>
          <span className="font-medium text-text-primary">
            ±{telemetry?.accuracy ?? 5} meters
          </span>
        </div>
      </div>

      {onOpenSimulator && (
        <button
          type="button"
          onClick={onOpenSimulator}
          className="mt-4 w-full rounded-xl bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition flex items-center justify-center gap-2"
        >
          <Radio className="w-3.5 h-3.5" /> Open GPS Simulator Controls
        </button>
      )}
    </div>
  );
}
