"use client";

import React from "react";
import { Truck, Car, Navigation } from "lucide-react";
import type { TelemetryStatus } from "@/types/telemetry";

interface VehicleMarkerProps {
  id: string;
  registrationNumber: string;
  makeModel?: string;
  speed: number;
  heading: number;
  status: string;
  telemetryStatus?: TelemetryStatus;
  selected?: boolean;
  type?: string | null;
  onClick?: () => void;
  xPercent: number; // 0 to 100 on interactive projection plane
  yPercent: number; // 0 to 100 on interactive projection plane
}

export default function VehicleMarker({
  registrationNumber,
  speed,
  heading,
  status,
  telemetryStatus = "live",
  selected = false,
  type = "truck",
  onClick,
  xPercent,
  yPercent,
}: VehicleMarkerProps) {
  const isMoving = speed > 3;
  const isCar = type?.toLowerCase().includes("car") || type?.toLowerCase().includes("sedan");
  const normalizedHeading = ((heading % 360) + 360) % 360;

  // Status colors matching Orbit Fleet design language
  const markerColors = {
    online: "bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/40",
    idle: "bg-amber-500 border-amber-300 text-white shadow-amber-500/40",
    offline: "bg-slate-600 border-slate-400 text-white shadow-slate-500/40",
  }[status === "online" ? "online" : status === "idle" ? "idle" : "offline"] || "bg-emerald-600 border-emerald-400 text-white";

  return (
    <div
      onClick={onClick}
      style={{
        left: `${Math.max(5, Math.min(95, xPercent))}%`,
        top: `${Math.max(5, Math.min(95, yPercent))}%`,
      }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700 ease-out z-20 group`}
    >
      {/* Outer Pulse Ring for Moving Vehicles */}
      {isMoving && telemetryStatus === "live" && (
        <span className="absolute -inset-2 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
      )}

      {/* Selected Indicator Halo */}
      {selected && (
        <span className="absolute -inset-3 rounded-full border-2 border-primary animate-pulse opacity-90" />
      )}

      {/* Main Marker Core */}
      <div
        className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-lg transition-transform duration-300 group-hover:scale-110 ${markerColors} ${
          selected ? "ring-4 ring-primary/30 scale-110" : ""
        }`}
      >
        {/* Vehicle Icon with Heading Rotation */}
        <div
          className="transition-transform duration-500 ease-out"
          style={{
            transform: `rotate(${normalizedHeading}deg)`,
          }}
        >
          {isCar ? (
            <Car className="h-5 w-5" />
          ) : (
            <Truck className="h-5 w-5" />
          )}
        </div>

        {/* Small Direction Arrow Notch */}
        <div
          className="absolute -top-1.5 transition-transform duration-500 ease-out"
          style={{
            transformOrigin: "center 28px",
            transform: `rotate(${normalizedHeading}deg)`,
          }}
        >
          <Navigation className="h-3 w-3 fill-emerald-300 text-emerald-300" />
        </div>
      </div>

      {/* Floating Registration Tag */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950/90 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-100 shadow-md border border-slate-700 pointer-events-none transition-all group-hover:scale-105">
        <span className="text-emerald-400">{registrationNumber}</span>
        {speed > 0 && <span className="ml-1 text-slate-400 font-normal">({Math.round(speed)}k)</span>}
      </div>
    </div>
  );
}
