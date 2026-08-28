"use client";

import React, { useMemo } from "react";
import { Compass, Navigation } from "lucide-react";

interface HeadingCompassProps {
  heading?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDetails?: boolean;
}

/**
 * Converts degree angle (0-360) into 16-point cardinal compass text
 */
export function getCardinalDirection(heading?: number | null): {
  code: string;
  name: string;
  arrow: string;
} {
  if (typeof heading !== "number" || isNaN(heading)) {
    return { code: "--", name: "Unknown", arrow: "•" };
  }

  const normalized = ((heading % 360) + 360) % 360;
  const directions = [
    { code: "N", name: "North", arrow: "↑" },
    { code: "NNE", name: "North-Northeast", arrow: "↗" },
    { code: "NE", name: "Northeast", arrow: "↗" },
    { code: "ENE", name: "East-Northeast", arrow: "↗" },
    { code: "E", name: "East", arrow: "→" },
    { code: "ESE", name: "East-Southeast", arrow: "↘" },
    { code: "SE", name: "Southeast", arrow: "↘" },
    { code: "SSE", name: "South-Southeast", arrow: "↘" },
    { code: "S", name: "South", arrow: "↓" },
    { code: "SSW", name: "South-Southwest", arrow: "↙" },
    { code: "SW", name: "Southwest", arrow: "↙" },
    { code: "WSW", name: "West-Southwest", arrow: "↙" },
    { code: "W", name: "West", arrow: "←" },
    { code: "WNW", name: "West-Northwest", arrow: "↖" },
    { code: "NW", name: "Northwest", arrow: "↖" },
    { code: "NNW", name: "North-Northwest", arrow: "↖" },
  ];

  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

export default function HeadingCompass({
  heading,
  size = "md",
  className = "",
  showDetails = true,
}: HeadingCompassProps) {
  const hasData = typeof heading === "number" && !isNaN(heading);
  const normalizedHeading = hasData ? ((heading % 360) + 360) % 360 : 0;
  const cardinal = useMemo(
    () => getCardinalDirection(heading),
    [heading]
  );

  const sizeClasses = {
    sm: "w-36 h-36",
    md: "w-44 h-44",
    lg: "w-52 h-52",
  }[size];

  return (
    <div
      id="telemetry-compass"
      className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-border shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between w-full mb-1 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-primary" /> Heading
        </span>
        <span className="text-[10px] font-mono text-text-muted">
          {hasData ? `${Math.round(normalizedHeading)}°` : "--°"}
        </span>
      </div>

      <div className={`relative flex items-center justify-center ${sizeClasses}`}>
        {/* Compass Outer Ring with Cardinal Markers */}
        <div className="relative w-full h-full rounded-full border-2 border-slate-100 bg-slate-50/50 flex items-center justify-center">
          {/* Compass Rose Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-slate-200" />

          {/* Cardinal Points */}
          <span className="absolute top-1 text-[11px] font-bold text-rose-500">
            N
          </span>
          <span className="absolute right-1.5 text-[10px] font-bold text-slate-500">
            E
          </span>
          <span className="absolute bottom-1 text-[10px] font-bold text-slate-500">
            S
          </span>
          <span className="absolute left-1.5 text-[10px] font-bold text-slate-500">
            W
          </span>

          {/* Intermediate ticks (NE, SE, SW, NW) */}
          <span className="absolute top-4 right-4 text-[8px] font-bold text-slate-300">
            NE
          </span>
          <span className="absolute bottom-4 right-4 text-[8px] font-bold text-slate-300">
            SE
          </span>
          <span className="absolute bottom-4 left-4 text-[8px] font-bold text-slate-300">
            SW
          </span>
          <span className="absolute top-4 left-4 text-[8px] font-bold text-slate-300">
            NW
          </span>

          {/* Rotating Compass Needle */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out pointer-events-none"
            style={{
              transform: `rotate(${normalizedHeading}deg)`,
            }}
          >
            {/* Pointer graphic */}
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[24px] border-b-primary drop-shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-white -my-1.5 z-10 shadow-xs" />
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[18px] border-t-slate-400 opacity-60" />
            </div>
          </div>
        </div>
      </div>

      {/* Heading Details Subtext */}
      {showDetails && (
        <div className="mt-1 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
            <Navigation
              className="w-3 h-3 text-primary transition-transform duration-300"
              style={{
                transform: `rotate(${normalizedHeading}deg)`,
              }}
            />
            {hasData ? (
              <>
                <span className="font-mono">{cardinal.arrow}</span> {cardinal.name} ({Math.round(normalizedHeading)}°)
              </>
            ) : (
              "No heading data"
            )}
          </span>
        </div>
      )}
    </div>
  );
}
