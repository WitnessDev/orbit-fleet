"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Map as MapIcon,
  Truck,
  Car,
  Radio,
  User,
  Cpu,
  RefreshCw,
  Gauge,
  Compass,
  Plus,
  Sliders,
  Sparkles,
  Navigation,
} from "lucide-react";
import Link from "next/link";

import DashboardLayout from "@/components/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Speedometer from "@/components/telemetry/Speedometer";
import HeadingCompass from "@/components/telemetry/HeadingCompass";
import TelemetryCard from "@/components/telemetry/TelemetryCard";
import VehicleMarker from "@/components/telemetry/VehicleMarker";
import VehicleInfoWindow from "@/components/telemetry/VehicleInfoWindow";
import SimulatorPanel from "@/components/simulator/SimulatorPanel";

import { useFleetTelemetry } from "@/hooks/telemetry/useFleetTelemetry";
import { useVehicleTelemetry } from "@/hooks/telemetry/useVehicleTelemetry";
import { addVehicle, getVehicles, type Vehicle } from "@/app/dashbord/database";

// Default coordinate center (Arusha, Tanzania)
const DEFAULT_CENTER = { lat: -3.3869, lng: 36.683 };

export default function TrackingPage() {
  const { fleet, loading: fleetLoading, stats } = useFleetTelemetry();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [showInfoWindow, setShowInfoWindow] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<"radar" | "satellite">("radar");
  const [zoom, setZoom] = useState<number>(13);
  const [seeding, setSeeding] = useState<boolean>(false);

  // Raw vehicle list for simulator target selection
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    getVehicles().then((list) => {
      setAllVehicles(list);
    });
  }, [fleet]);

  // Derive active vehicle ID
  const effectiveVehicleId = selectedVehicleId || (fleet.length > 0 ? fleet[0].vehicleId : null);

  // Telemetry for specifically selected vehicle
  const {
    telemetry: activeTelemetry,
    status: activeTelemetryStatus,
    loading: activeTelemetryLoading,
  } = useVehicleTelemetry(effectiveVehicleId);

  // Currently selected item from fleet list
  const activeFleetItem = useMemo(() => {
    return fleet.find((v) => v.vehicleId === effectiveVehicleId) || (fleet.length > 0 ? fleet[0] : null);
  }, [fleet, effectiveVehicleId]);

  // Handle auto-seed realistic test fleet if database is empty
  const handleSeedSampleFleet = async () => {
    setSeeding(true);
    try {
      const sample1 = await addVehicle({
        registrationNumber: "T 123 ABC",
        make: "Toyota",
        model: "Hilux 4x4",
        year: 2023,
        color: "White",
        type: "Pickup",
        status: "online",
        driverName: "John Doe",
        deviceId: "GPS-001",
        deviceSerial: "TELT-8821-AF",
        location: "Arusha Clock Tower",
        latitude: -3.3869,
        longitude: 36.683,
        mileage: 42350,
        fuelLevel: 85,
      });

      await addVehicle({
        registrationNumber: "T 456 DEF",
        make: "Scania",
        model: "R450 Heavy Hauler",
        year: 2022,
        color: "Royal Blue",
        type: "Truck",
        status: "online",
        driverName: "Kassim Majaliwa",
        deviceId: "GPS-002",
        deviceSerial: "TELT-9934-TX",
        location: "Arusha Moshi Highway",
        latitude: -3.398,
        longitude: 36.715,
        mileage: 128400,
        fuelLevel: 62,
      });

      await addVehicle({
        registrationNumber: "T 789 GHI",
        make: "Isuzu",
        model: "NPR 3.5 Tonner",
        year: 2021,
        color: "Silver",
        type: "Van/Truck",
        status: "idle",
        driverName: "Witness Kivuyo",
        deviceId: "GPS-003",
        deviceSerial: "TELT-5512-AR",
        location: "Njiro Industrial Yard",
        latitude: -3.412,
        longitude: 36.695,
        mileage: 67100,
        fuelLevel: 94,
      });

      if (sample1?.id) {
        setSelectedVehicleId(sample1.id);
      }
    } catch (err) {
      console.error("Failed to seed sample fleet:", err);
    } finally {
      setSeeding(false);
    }
  };

  // Coordinate projection helper: converts GPS (lat, lng) to canvas percentages (x%, y%)
  const projectionCenter = useMemo(() => {
    if (activeFleetItem && typeof activeFleetItem.latitude === "number") {
      return { lat: activeFleetItem.latitude, lng: activeFleetItem.longitude };
    }
    return DEFAULT_CENTER;
  }, [activeFleetItem]);

  const calculateMarkerPosition = (lat: number, lng: number) => {
    const scale = Math.pow(1.5, zoom - 12);
    const deltaLat = lat - projectionCenter.lat;
    const deltaLng = lng - projectionCenter.lng;
    const spanDeg = 0.08 / scale;

    const x = 50 + (deltaLng / spanDeg) * 50;
    const y = 50 - (deltaLat / spanDeg) * 50;

    return { xPercent: x, yPercent: y };
  };

  return (
    <DashboardLayout title="Live Fleet Tracking & Telemetry">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-text-primary">
              Live Fleet Telemetry
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Real-time Firestore stream, GPS coordinate interpolation, velocity sensors, and dev simulator.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 border border-border shadow-xs text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-slate-700">Stream Connected</span>
            <span className="font-mono text-slate-400">|</span>
            <span className="font-mono text-emerald-600 font-bold">{stats.live} Live</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSimulator(!showSimulator)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm border ${
              showSimulator
                ? "bg-slate-900 text-emerald-400 border-slate-700"
                : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500"
            }`}
          >
            <Sliders className="h-4 w-4" />
            {showSimulator ? "Hide GPS Simulator" : "Open GPS Simulator"}
          </button>
        </div>
      </div>

      {/* Fleet KPI Telemetry Summary Ribbons */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Total Units</p>
          <p className="font-display text-xl font-bold text-text-primary mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active Stream
          </p>
          <p className="font-display text-xl font-bold text-emerald-600 mt-1">{stats.live}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
            <Truck className="h-3 w-3 text-blue-500" /> In Transit
          </p>
          <p className="font-display text-xl font-bold text-blue-600 mt-1">{stats.moving}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Parked / Idle
          </p>
          <p className="font-display text-xl font-bold text-amber-600 mt-1">{stats.idle}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Offline / Stale</p>
          <p className="font-display text-xl font-bold text-slate-600 mt-1">{stats.offline}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
            <Gauge className="h-3 w-3 text-primary" /> Fleet Avg Speed
          </p>
          <p className="font-display text-xl font-bold text-text-primary mt-1">
            {stats.avgSpeed} <span className="text-xs font-normal text-text-muted">km/h</span>
          </p>
        </div>
      </div>

      {fleetLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white border border-border p-8 text-text-muted">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-semibold text-text-primary">Subscribing to Firestore GPS Telemetry Stream...</p>
          <p className="text-xs text-text-muted mt-1">Listening for real-time location and speed updates</p>
        </div>
      ) : fleet.length === 0 ? (
        <Card className="p-12 text-center max-w-2xl mx-auto">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MapIcon className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-text-primary">
            No Fleet Telemetry Stream Active
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            Your Firestore database has no vehicles yet. You can create a vehicle manually or load realistic sample vehicles to test real-time simulator movement immediately.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSeedSampleFleet}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition disabled:opacity-50"
            >
              {seeding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Load Test Fleet with GPS (Arusha)
            </button>
            <Link
              href="/dashbord/vehicles"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-xs font-bold text-text-primary hover:bg-surface-hover transition"
            >
              <Plus className="h-4 w-4" /> Add Vehicle
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left Column: Interactive Map Stage */}
          <div className="space-y-4">
            <Card className="relative min-h-[580px] overflow-hidden rounded-2xl border border-border bg-slate-950 shadow-xl flex flex-col justify-between p-4 sm:p-6 text-white select-none">
              {/* Map Top Ribbon Controls */}
              <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-950/85 p-3 backdrop-blur-md border border-slate-800 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Radio className="h-4 w-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100 font-mono">
                        {activeFleetItem ? activeFleetItem.registrationNumber : "FLEET"}
                      </span>
                      {activeTelemetry?.isSimulated && (
                        <span className="rounded bg-sky-950 px-1.5 py-0.5 text-[9px] font-mono font-bold text-sky-400 border border-sky-800/50">
                          SIMULATED
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                      {activeFleetItem ? `${activeFleetItem.make} ${activeFleetItem.model}` : "Monitoring fleet"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {/* Coordinates Badge */}
                  <span className="hidden sm:inline-flex rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-mono text-emerald-400 border border-slate-800">
                    Lat: {activeFleetItem?.latitude.toFixed(4)}, Lng: {activeFleetItem?.longitude.toFixed(4)}
                  </span>

                  {/* Map Type / Layer Switch */}
                  <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setMapMode("radar")}
                      className={`rounded px-2 py-1 text-[10px] font-bold uppercase transition ${
                        mapMode === "radar" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Radar
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapMode("satellite")}
                      className={`rounded px-2 py-1 text-[10px] font-bold uppercase transition ${
                        mapMode === "satellite" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Sat
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(z + 1, 17))}
                      className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs font-bold hover:bg-slate-700 transition"
                      title="Zoom In"
                    >
                      +
                    </button>
                    <span className="rounded bg-slate-900 px-1.5 py-1 text-[10px] font-mono text-slate-400 border border-slate-800">
                      {zoom}z
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(z - 1, 9))}
                      className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs font-bold hover:bg-slate-700 transition"
                      title="Zoom Out"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>

              {/* Map Canvas Background Grid / Radar Display */}
              <div className="absolute inset-0 overflow-hidden">
                {mapMode === "radar" ? (
                  <>
                    {/* Dark High-Tech Radar Grid */}
                    <div
                      className="absolute inset-0 opacity-25"
                      style={{
                        backgroundImage: `radial-gradient(#10b981 1.2px, transparent 1.2px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                        backgroundSize: `${32 * Math.pow(1.15, zoom - 13)}px ${32 * Math.pow(1.15, zoom - 13)}px`,
                      }}
                    />

                    {/* Concentric distance rings around projection center */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="absolute h-[650px] w-[650px] rounded-full border border-emerald-500/5 animate-pulse" />
                      <div className="absolute h-[450px] w-[450px] rounded-full border border-emerald-500/10" />
                      <div className="absolute h-[250px] w-[250px] rounded-full border border-emerald-500/20" />
                      <div className="absolute h-[100px] w-[100px] rounded-full border border-emerald-500/30" />

                      {/* Radar sweep beam */}
                      <div className="absolute h-[450px] w-[450px] rounded-full border border-emerald-500/10 opacity-30 animate-spin origin-center [animation-duration:12s]" />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Simulated Satellite Terrain Texture */}
                    <div className="absolute inset-0 bg-slate-900 bg-radial from-slate-800 via-slate-900 to-slate-950 opacity-90" />
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage: `linear-gradient(45deg, #0f172a 25%, transparent 25%), linear-gradient(-45deg, #0f172a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0f172a 75%), linear-gradient(-45deg, transparent 75%, #0f172a 75%)`,
                        backgroundSize: "40px 40px",
                      }}
                    />
                  </>
                )}

                {/* Map Geographic Landmark Anchors */}
                <div className="absolute top-16 left-6 pointer-events-none text-[11px] font-mono text-emerald-500/40 flex items-center gap-1">
                  <Navigation className="h-3 w-3" /> ARUSHA TRANSIT CORRIDOR • GRID ZONE 36S
                </div>
                <div className="absolute bottom-20 right-6 pointer-events-none text-[10px] font-mono text-slate-600">
                  REF: WGS-84 / GEODESIC STREAM
                </div>

                {/* All Fleet Vehicle Markers with Live Interpolation */}
                {fleet.map((item) => {
                  const isSelected = activeFleetItem?.vehicleId === item.vehicleId;
                  const pos = calculateMarkerPosition(item.latitude, item.longitude);

                  return (
                    <VehicleMarker
                      key={item.vehicleId}
                      id={item.vehicleId}
                      registrationNumber={item.registrationNumber}
                      makeModel={`${item.make} ${item.model}`}
                      speed={item.speed}
                      heading={item.heading}
                      status={item.status}
                      telemetryStatus={item.telemetryStatus}
                      selected={isSelected}
                      onClick={() => {
                        setSelectedVehicleId(item.vehicleId);
                        setShowInfoWindow(true);
                      }}
                      xPercent={pos.xPercent}
                      yPercent={pos.yPercent}
                    />
                  );
                })}

                {/* Selected Vehicle Info Popover Window (when open) */}
                {showInfoWindow && activeFleetItem && (
                  <div className="absolute top-20 right-4 z-40 w-72 sm:w-80">
                    <VehicleInfoWindow
                      registrationNumber={activeFleetItem.registrationNumber}
                      makeModel={`${activeFleetItem.make} ${activeFleetItem.model}`}
                      driverName={activeFleetItem.driverName}
                      deviceId={activeFleetItem.deviceSerial || activeFleetItem.deviceId}
                      status={activeFleetItem.status}
                      telemetryStatus={activeFleetItem.telemetryStatus}
                      telemetry={activeTelemetry}
                      onClose={() => setShowInfoWindow(false)}
                      onOpenSimulator={() => setShowSimulator(true)}
                    />
                  </div>
                )}
              </div>

              {/* Bottom Quick-Telemetry Summary Bar on Map */}
              <div className="relative z-30 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-slate-950/85 p-3 backdrop-blur-md border border-slate-800 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-emerald-400" /> Velocity
                  </p>
                  <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {activeTelemetry ? `${Math.round(activeTelemetry.speed)} km/h` : `${Math.round(activeFleetItem?.speed ?? 0)} km/h`}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Compass className="h-3 w-3 text-emerald-400" /> Heading
                  </p>
                  <p className="text-sm font-bold font-mono text-slate-200 mt-0.5">
                    {activeTelemetry ? `${Math.round(activeTelemetry.heading)}°` : `${Math.round(activeFleetItem?.heading ?? 90)}°`}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <User className="h-3 w-3 text-emerald-400" /> Operator
                  </p>
                  <p className="text-sm font-bold text-slate-200 truncate mt-0.5">
                    {activeFleetItem?.driverName || "Assigned Driver"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-emerald-400" /> GPS Unit
                  </p>
                  <p className="text-sm font-bold font-mono text-slate-200 truncate mt-0.5">
                    {activeFleetItem?.deviceSerial || activeFleetItem?.deviceId || "GPS-ACTIVE"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Live Speedometer & Compass Telemetry Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Speedometer
                speed={activeTelemetry ? activeTelemetry.speed : activeFleetItem?.speed ?? 0}
                maxSpeed={120}
              />
              <HeadingCompass
                heading={activeTelemetry ? activeTelemetry.heading : activeFleetItem?.heading ?? 90}
              />
            </div>
          </div>

          {/* Right Column: Fleet List, Telemetry Card & Simulator Controller */}
          <div className="space-y-4">
            {/* Real-time Telemetry Summary Card */}
            {activeFleetItem && (
              <TelemetryCard
                registrationNumber={activeFleetItem.registrationNumber}
                makeModel={`${activeFleetItem.make} ${activeFleetItem.model}`}
                driverName={activeFleetItem.driverName}
                deviceId={activeFleetItem.deviceSerial || activeFleetItem.deviceId}
                telemetry={activeTelemetry}
                status={activeTelemetryStatus}
                loading={activeTelemetryLoading}
                onOpenSimulator={() => setShowSimulator(true)}
              />
            )}

            {/* Active Developer GPS Simulator Panel */}
            {showSimulator && (
              <SimulatorPanel
                vehicles={allVehicles}
                selectedVehicleId={effectiveVehicleId || undefined}
                onVehicleChange={(vId) => setSelectedVehicleId(vId)}
                onClose={() => setShowSimulator(false)}
              />
            )}

            {/* Fleet Units Selection List */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-bold text-text-primary">
                  Monitored Units ({fleet.length})
                </h3>
                <span className="text-[11px] font-semibold text-text-muted">
                  Click to track
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {fleet.map((v) => {
                  const isSelected = activeFleetItem?.vehicleId === v.vehicleId;

                  return (
                    <button
                      key={v.vehicleId}
                      type="button"
                      onClick={() => {
                        setSelectedVehicleId(v.vehicleId);
                        setShowInfoWindow(true);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition border ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                          : "border-border hover:bg-surface-hover"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-surface text-text-secondary"
                          }`}
                        >
                          <Car className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-text-primary font-mono">
                              {v.registrationNumber}
                            </p>
                            {v.telemetryStatus === "live" && (
                              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                            )}
                          </div>
                          <p className="text-[11px] text-text-muted">
                            {v.driverName ? v.driverName : "Unassigned"} • {Math.round(v.speed)} km/h
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge status={v.status === "online" ? "online" : v.status === "idle" ? "idle" : "offline"}>
                          {v.status}
                        </Badge>
                        <span className="text-[10px] font-mono text-text-muted">
                          {v.heading}°
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
