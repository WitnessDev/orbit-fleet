"use client";

import React, { useEffect, useState } from "react";
import {
  Play,
  Square,
  Gauge,
  Compass,
  MapPin,
  RefreshCw,
  Clock,
  Activity,
  X,
  Send,
  Sliders,
} from "lucide-react";
import { simulatorEngine, type SimulationLogEntry } from "@/lib/simulator/simulatorEngine";
import type { Vehicle } from "@/app/dashbord/database";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface SimulatorPanelProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onVehicleChange?: (vehicleId: string) => void;
  onClose?: () => void;
  isFloating?: boolean;
  className?: string;
}

const PRESET_ROUTES = [
  { name: "Arusha CBD (Clock Tower)", lat: -3.3869, lng: 36.683, heading: 90 },
  { name: "Arusha (Njiro Industrial)", lat: -3.412, lng: 36.695, heading: 180 },
  { name: "Dar es Salaam (Port Terminal)", lat: -6.8235, lng: 39.2905, heading: 270 },
  { name: "Dodoma (Central Bypass)", lat: -6.163, lng: 35.7516, heading: 45 },
  { name: "Nairobi (Southern Corridor)", lat: -1.3197, lng: 36.8219, heading: 315 },
];

export default function SimulatorPanel({
  vehicles,
  selectedVehicleId,
  onVehicleChange,
  onClose,
  isFloating = false,
  className = "",
}: SimulatorPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(68);
  const [heading, setHeading] = useState(90);
  const [panelVehicleId, setPanelVehicleId] = useState("");
  const [intervalMs, setIntervalMs] = useState(4000);
  const [logs, setLogs] = useState<SimulationLogEntry[]>([]);
  const [packetCount, setPacketCount] = useState(0);
  const [isStepping, setIsStepping] = useState(false);

  // Determine active vehicle id from props or local state or first vehicle
  const activeVehicleId =
    selectedVehicleId || panelVehicleId || (vehicles.length > 0 ? vehicles[0].id : "");

  // Synchronize with simulator engine state
  useEffect(() => {
    const unsubscribe = simulatorEngine.subscribe((state) => {
      setIsRunning(state.isRunning);
      setSpeed(state.config.speed);
      setHeading(state.config.heading);
      setIntervalMs(state.config.updateIntervalMs);
      setLogs(state.logs);
      setPacketCount(state.packetCount);
    });

    return unsubscribe;
  }, []);

  const handleVehicleSelect = (vId: string) => {
    setPanelVehicleId(vId);
    if (onVehicleChange) onVehicleChange(vId);

    const veh = vehicles.find((v) => v.id === vId);
    if (veh) {
      simulatorEngine.setVehicle(
        veh.id,
        veh.deviceSerial || veh.deviceId || "GPS-001",
        typeof veh.latitude === "number" ? veh.latitude : -3.3869,
        typeof veh.longitude === "number" ? veh.longitude : 36.683
      );
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    simulatorEngine.setSpeed(newSpeed);
  };

  const handleHeadingChange = (newHeading: number) => {
    setHeading(newHeading);
    simulatorEngine.setHeading(newHeading);
  };

  const handleIntervalChange = (ms: number) => {
    setIntervalMs(ms);
    simulatorEngine.setIntervalMs(ms);
  };

  const handlePresetSelect = (preset: (typeof PRESET_ROUTES)[0]) => {
    simulatorEngine.setCoordinates(preset.lat, preset.lng);
    simulatorEngine.setHeading(preset.heading);
    setHeading(preset.heading);
  };

  const handleStart = async () => {
    if (!activeVehicleId && vehicles.length > 0) {
      handleVehicleSelect(vehicles[0].id);
    } else if (activeVehicleId) {
      const veh = vehicles.find((v) => v.id === activeVehicleId);
      if (veh) {
        simulatorEngine.setVehicle(
          veh.id,
          veh.deviceSerial || veh.deviceId || "GPS-001",
          typeof veh.latitude === "number" ? veh.latitude : -3.3869,
          typeof veh.longitude === "number" ? veh.longitude : 36.683
        );
      }
    }
    await simulatorEngine.start();
  };

  const handleStop = () => {
    simulatorEngine.stop();
  };

  const handleSingleStep = async () => {
    setIsStepping(true);
    await simulatorEngine.step();
    setIsStepping(false);
  };

  const currentVehicle = vehicles.find((v) => v.id === activeVehicleId);

  return (
    <div
      id="simulator-panel"
      className={`rounded-2xl border border-border bg-surface text-text-primary shadow-xl transition-all duration-200 ${
        isFloating
          ? "fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] max-h-[85vh] flex flex-col"
          : "w-full"
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background/50 px-5 py-3.5 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-text-primary">
                GPS Telemetry Simulator
              </span>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-700 border border-emerald-200">
                LIVE ENGINE
              </span>
            </div>
            <p className="text-[10px] text-text-muted">
              Generates geodesic steps & updates Firestore in real time
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text-primary transition"
            aria-label="Close simulator"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-200px)]">
        {/* Status Ribbon */}
        <div className="flex items-center justify-between rounded-xl bg-background p-3 border border-border">
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isRunning ? "bg-emerald-500 animate-ping" : "bg-slate-400"
              }`}
            />
            <div>
              <p className="text-xs font-bold text-text-primary">
                {isRunning ? "Simulating GPS Motion" : "Simulator Idle"}
              </p>
              <p className="text-[10px] text-text-muted font-mono">
                Target: {currentVehicle ? currentVehicle.registrationNumber : "None"}
              </p>
            </div>
          </div>
          <Badge status={isRunning ? "online" : "offline"}>
            {isRunning ? "Writing" : "Stopped"}
          </Badge>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
            Target Vehicle
          </label>
          <select
            value={activeVehicleId}
            onChange={(e) => handleVehicleSelect(e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-mono font-bold text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {vehicles.length === 0 ? (
              <option value="">No vehicles found in database</option>
            ) : (
              vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} — {v.make} {v.model} ({v.status})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Speed Slider */}
        <div className="rounded-xl bg-background p-3.5 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-text-primary">
              <Gauge className="h-3.5 w-3.5 text-primary" /> Velocity Speed
            </span>
            <span className="font-mono text-sm font-extrabold text-primary">
              {speed} km/h
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="140"
            step="1"
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { label: "Park (0)", val: 0 },
              { label: "City (40)", val: 40 },
              { label: "Transit (68)", val: 68 },
              { label: "Highway (105)", val: 105 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => handleSpeedChange(p.val)}
                className={`rounded-lg py-1 text-[10px] font-mono font-semibold transition border ${
                  speed === p.val
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-text-secondary border-border hover:bg-surface-hover"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Heading Compass Bearing */}
        <div className="rounded-xl bg-background p-3.5 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-text-primary">
              <Compass className="h-3.5 w-3.5 text-primary" /> Heading Direction
            </span>
            <span className="font-mono text-sm font-bold text-text-primary">
              {heading}°
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="359"
            step="5"
            value={heading}
            onChange={(e) => handleHeadingChange(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { label: "N (0°)", deg: 0 },
              { label: "E (90°)", deg: 90 },
              { label: "S (180°)", deg: 180 },
              { label: "W (270°)", deg: 270 },
            ].map((c) => (
              <button
                key={c.deg}
                type="button"
                onClick={() => handleHeadingChange(c.deg)}
                className={`rounded-lg py-1 text-[10px] font-mono font-semibold transition border ${
                  heading === c.deg
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-text-secondary border-border hover:bg-surface-hover"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Update Interval & Teleport Corridors */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
              <Clock className="inline w-3 h-3 text-primary mr-1" />
              Interval
            </label>
            <select
              value={intervalMs}
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-white px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={2000}>2s (High Rate)</option>
              <option value={4000}>4s (Optimal)</option>
              <option value={8000}>8s (Battery Safe)</option>
              <option value={15000}>15s (Slow)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
              <MapPin className="inline w-3 h-3 text-primary mr-1" />
              Transit Corridor
            </label>
            <select
              onChange={(e) => {
                const p = PRESET_ROUTES[Number(e.target.value)];
                if (p) handlePresetSelect(p);
              }}
              className="w-full rounded-xl border border-border bg-white px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Jump Route...</option>
              {PRESET_ROUTES.map((p, idx) => (
                <option key={p.name} value={idx}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls: START / STOP / STEP */}
        <div className="flex items-center gap-2 pt-1">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              disabled={vehicles.length === 0}
              className="flex-1 py-2.5 text-xs gap-2"
            >
              <Play className="h-4 w-4 fill-white" /> Start Stream
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={handleStop}
              className="flex-1 py-2.5 text-xs gap-2"
            >
              <Square className="h-4 w-4 fill-white" /> Stop Stream
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={handleSingleStep}
            disabled={isRunning || isStepping || vehicles.length === 0}
            className="py-2.5 text-xs gap-1.5"
            title="Dispatch 1 simulated GPS packet immediately"
          >
            {isStepping ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Step
          </Button>
        </div>

        {/* Firestore Real-Time Stream Log */}
        <div className="space-y-1.5 border-t border-border pt-3">
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
              <Activity className="h-3 w-3 text-primary" /> Firestore Packet Log ({packetCount})
            </span>
            <button
              type="button"
              onClick={() => simulatorEngine.clearLogs()}
              className="text-[10px] text-text-muted hover:text-text-primary transition"
            >
              Clear
            </button>
          </div>

          <div className="h-24 overflow-y-auto rounded-xl bg-slate-900 p-2.5 font-mono text-[10px] text-slate-200 border border-slate-800 space-y-1">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic py-2 text-center">
                Stream idle. Click &quot;Start Stream&quot; to write GPS packets.
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start justify-between gap-1 leading-tight ${
                    log.status === "error" ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  <span>
                    [{log.timestamp}] #{log.seq}: {log.speed}km/h @ {log.heading}° ({log.latitude.toFixed(4)}, {log.longitude.toFixed(4)})
                  </span>
                  <span className="text-slate-500 shrink-0">{log.latencyMs}ms</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
