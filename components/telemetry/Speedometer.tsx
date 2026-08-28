"use client";

import React, { useMemo } from "react";
import { Gauge } from "lucide-react";

interface SpeedometerProps {
  speed?: number | null;
  maxSpeed?: number;
  unit?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showStatusLabel?: boolean;
}

export default function Speedometer({
  speed,
  maxSpeed = 120,
  unit = "km/h",
  size = "md",
  className = "",
  showStatusLabel = true,
}: SpeedometerProps) {
  const hasData = typeof speed === "number" && !isNaN(speed) && speed >= 0;
  const currentSpeed = hasData ? Math.round(speed) : 0;
  const normalizedSpeed = Math.min(Math.max(currentSpeed, 0), maxSpeed);

  // Gauge geometry: 240-degree arc from 150° to 390° (or -210° to 30°)
  const radius = 68;
  const strokeWidth = 8;
  const center = 84;
  const circumference = 2 * Math.PI * radius;
  // We use a 240 degree sweep out of 360 (240 / 360 = 2/3)
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset =
    hasData
      ? arcLength - (normalizedSpeed / maxSpeed) * arcLength
      : arcLength;

  // Determine operational state & color
  const { statusText, badgeBg, needleColor } = useMemo(() => {
    if (!hasData) {
      return {
        statusText: "No data",
        badgeBg: "bg-slate-100 text-slate-600 border-slate-200",
        needleColor: "#94a3b8",
      };
    }
    if (currentSpeed === 0) {
      return {
        statusText: "Parked",
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
        needleColor: "#64748b",
      };
    }
    if (currentSpeed < 80) {
      return {
        statusText: "Moving",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        needleColor: "#10b981",
      };
    }
    return {
      statusText: "High speed",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
      needleColor: "#f43f5e",
    };
  }, [hasData, currentSpeed]);


  const sizeClasses = {
    sm: "w-36 h-36",
    md: "w-44 h-44",
    lg: "w-52 h-52",
  }[size];

  // Calculate needle angle (-120° at 0 speed to +120° at max speed)
  const needleAngle = hasData
    ? -120 + (normalizedSpeed / maxSpeed) * 240
    : -120;

  return (
    <div
      id="telemetry-speedometer"
      className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-border shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between w-full mb-1 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5 text-primary" /> Velocity
        </span>
        <span className="text-[10px] font-mono text-text-muted">
          Max {maxSpeed} {unit}
        </span>
      </div>

      <div className={`relative flex items-center justify-center ${sizeClasses}`}>
        {/* SVG Arc Gauge */}
        <svg
          viewBox="0 0 168 168"
          className="w-full h-full transform rotate-[150deg] overflow-visible"
        >
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active Speed Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={needleColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 select-none">
          <div className="flex items-baseline">
            <span
              className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight ${
                hasData ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {hasData ? currentSpeed : "--"}
            </span>
            <span className="ml-1 text-xs font-semibold text-slate-500 uppercase">
              {unit}
            </span>
          </div>

          {/* Subtext scale indicator */}
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>0</span>
            <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${(normalizedSpeed / maxSpeed) * 100}%`,
                }}
              />
            </div>
            <span>{maxSpeed}</span>
          </div>
        </div>

        {/* Needle Tick / Indicator dot */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out"
          style={{
            transform: `rotate(${needleAngle}deg)`,
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full mx-auto -mt-0.5 shadow-sm"
            style={{ backgroundColor: needleColor }}
          />
        </div>
      </div>

      {/* State Label */}
      {showStatusLabel && (
        <div className="mt-1">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${badgeBg}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: needleColor }}
            />
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
}
