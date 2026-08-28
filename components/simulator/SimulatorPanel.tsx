"use client";

import React, { useEffect, useState } from "react";
import {
  Play,
  Square,
  Radio,
  Gauge,
  Compass,
  MapPin,
  RefreshCw,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp,
  X,
  Send,
} from "lucide-react";
import { simulatorEngine, type SimulationLogEntry } from "@/lib/simulator/simulatorEngine";
import type { Vehicle } from "@/lib/types/vehicle";

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
  { name: "Dar es Salaam (Port Area)", lat: -6.8235, lng: 39.2905, heading: 270 },
  { name: "Dodoma (Central Bypass)", lat: -6.163, lng: 35.7516, heading: 45 },
  { name: "Nairobi (Southern Bypass)", lat: -1.3197, lng: 36.8219, heading: 315 },
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isStepping, setIsStepping] = useState(false);

  // Determine active vehicle id from props or local state or first vehicle
  const activeVehicleId = selectedVehicleId || panelVehicleId || (vehicles.length > 0 ? vehicles[0].id : "");

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

  return (
    <div
      id="simulator-panel"
      className={`rounded-2xl border border-emerald-800/30 bg-slate-950 text-slate-100 shadow-2xl transition-all ${
        isFloating ? "fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]" : "w-full"
      } ${className}`}
    >
      {/* Dev Mode Banner Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-100">
                GPS Telemetry Simulator
              </span>
              <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-700/50">
                DEV MODE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Generates geodesic steps & writes to Firestore
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            title={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
          {/* Status & Packet Stats Ribbon */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900 p-2.5 border border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isRunning ? "bg-emerald-400 animate-ping" : "bg-slate-600"
                }`}
              />
              <span className="text-xs font-bold text-slate-200">
                {isRunning ? "● Stream Active (Writing)" : "○ Engine Stopped"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>Packets: {packetCount}</span>
            </div>
          </div>

          {/* Vehicle Target Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Vehicle
            </label>
            <select
              value={activeVehicleId}
              onChange={(e) => handleVehicleSelect(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              {vehicles.length === 0 ? (
                <option value="">No vehicles found in database</option>
              ) : (
                vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.registrationNumber} ({v.make} {v.model})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Speed Controller Slider & Presets */}
          <div className="space-y-1.5 rounded-xl bg-slate-900/60 p-3 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Gauge className="h-3.5 w-3.5 text-emerald-400" /> Simulated Speed
              </span>
              <span className="font-mono text-sm font-extrabold text-emerald-400">
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
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
            />

            {/* Quick Speed Presets */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: "Park (0)", val: 0 },
                { label: "City (40)", val: 40 },
                { label: "Highway (68)", val: 68 },
                { label: "Express (105)", val: 105 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => handleSpeedChange(p.val)}
                  className={`rounded-lg py-1 text-[10px] font-mono font-semibold transition border ${
                    speed === p.val
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Heading Compass Bearing Slider */}
          <div className="space-y-1.5 rounded-xl bg-slate-900/60 p-3 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Compass className="h-3.5 w-3.5 text-emerald-400" /> Heading Bearing
              </span>
              <span className="font-mono text-sm font-bold text-slate-200">
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
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
            />

            {/* Cardinal Presets */}
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
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Update Interval & Preset Locations */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Clock className="inline w-3 h-3 text-emerald-400 mr-1" />
                Interval
              </label>
              <select
                value={intervalMs}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
              >
                <option value={2000}>2s (High Frequency)</option>
                <option value={4000}>4s (Optimal Dev)</option>
                <option value={8000}>8s (Battery Safe)</option>
                <option value={15000}>15s (Slow Stream)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <MapPin className="inline w-3 h-3 text-emerald-400 mr-1" />
                Teleport Route
              </label>
              <select
                onChange={(e) => {
                  const p = PRESET_ROUTES[Number(e.target.value)];
                  if (p) handlePresetSelect(p);
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
              >
                <option value="">Jump coordinates...</option>
                {PRESET_ROUTES.map((p, idx) => (
                  <option key={p.name} value={idx}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons: START / STOP / STEP */}
          <div className="flex items-center gap-2 pt-1">
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStart}
                disabled={vehicles.length === 0}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-white" /> Start Stream
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition flex items-center justify-center gap-2"
              >
                <Square className="h-4 w-4 fill-white" /> Stop Stream
              </button>
            )}

            <button
              type="button"
              onClick={handleSingleStep}
              disabled={isRunning || isStepping || vehicles.length === 0}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition flex items-center gap-1.5 disabled:opacity-40"
              title="Send 1 telemetry step immediately"
            >
              {isStepping ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Step
            </button>
          </div>

          {/* Telemetry Stream Output Log Terminal */}
          <div className="space-y-1.5 border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                <Activity className="h-3 w-3 text-emerald-400" /> Firestore Stream Log
              </span>
              <button
                type="button"
                onClick={() => simulatorEngine.clearLogs()}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>

            <div className="h-28 overflow-y-auto rounded-lg bg-slate-900/90 p-2 font-mono text-[10px] text-slate-300 border border-slate-800/80 space-y-1">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic py-2 text-center">
                  Stream idle. Click &quot;Start Stream&quot; to write GPS packets.
                </p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start justify-between gap-1 leading-tight ${
                      log.status === "error" ? "text-rose-400" : "text-emerald-400/90"
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
      )}
    </div>
  );
}
