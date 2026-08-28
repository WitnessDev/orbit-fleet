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
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
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
  const router = useRouter();
  const { fleet, loading: fleetLoading, stats } = useFleetTelemetry();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [showInfoWindow, setShowInfoWindow] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<"radar" | "satellite">("radar");
  const [zoom, setZoom] = useState<number>(13);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "moving" | "idle" | "offline">("all");

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
    return (
      fleet.find((v) => v.vehicleId === effectiveVehicleId) ||
      (fleet.length > 0 ? fleet[0] : null)
    );
  }, [fleet, effectiveVehicleId]);

  // Filtered fleet list for selector
  const filteredFleet = useMemo(() => {
    return fleet.filter((v) => {
      const matchesSearch =
        searchQuery === "" ||
        v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.driverName && v.driverName.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === "moving") return v.speed > 3;
      if (statusFilter === "idle") return v.status === "idle" || (v.status === "online" && v.speed <= 3);
      if (statusFilter === "offline") return v.status === "offline";
      return true;
    });
  }, [fleet, searchQuery, statusFilter]);

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
    <DashboardLayout title="Live Fleet Tracking">
      {/* Top Header & Quick Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-text-primary">
              Live Fleet Tracking
            </h1>
            <Badge status="online">Live Stream</Badge>
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            Real-time geospatial tracking, velocity telemetry, and developer GPS simulation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant={showSimulator ? "primary" : "secondary"}
            onClick={() => setShowSimulator(!showSimulator)}
            className="gap-2 text-xs"
          >
            <Sliders className="h-4 w-4" />
            {showSimulator ? "Hide Simulator" : "Open GPS Simulator"}
          </Button>
        </div>
      </div>

      {/* Fleet KPI Quick Status Bar */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Total Units</p>
          <p className="font-display text-xl font-bold text-text-primary mt-1">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Stream
          </p>
          <p className="font-display text-xl font-bold text-emerald-700 mt-1">{stats.live}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
            <Truck className="h-3 w-3 text-blue-500" /> In Transit
          </p>
          <p className="font-display text-xl font-bold text-blue-700 mt-1">{stats.moving}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Idle / Standby
          </p>
          <p className="font-display text-xl font-bold text-amber-700 mt-1">{stats.idle}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Offline</p>
          <p className="font-display text-xl font-bold text-slate-700 mt-1">{stats.offline}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
            <Gauge className="h-3 w-3 text-primary" /> Avg Velocity
          </p>
          <p className="font-display text-xl font-bold text-text-primary mt-1">
            {stats.avgSpeed} <span className="text-xs font-normal text-text-muted">km/h</span>
          </p>
        </div>
      </div>

      {fleetLoading ? (
        <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl bg-white border border-border p-8 text-text-muted">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-semibold text-text-primary">Subscribing to Firestore GPS Telemetry Stream...</p>
          <p className="text-xs text-text-muted mt-1">Establishing real-time connection</p>
        </div>
      ) : fleet.length === 0 ? (
        <Card className="p-12 text-center max-w-2xl mx-auto">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MapIcon className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-text-primary">
            No Fleet Vehicles Found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            Your Firestore database has no vehicles yet. You can create a vehicle manually or load realistic sample vehicles to test real-time simulator movement immediately.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={handleSeedSampleFleet} disabled={seeding} className="gap-2">
              {seeding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Load Test Fleet (Arusha Corridor)
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/dashbord/vehicles")}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add Vehicle
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* PRIMARY MAP CONTAINER (Spacious, prominent) */}
          <div className="relative">
            <Card className="relative h-[540px] sm:h-[620px] overflow-hidden rounded-2xl border border-border bg-slate-950 shadow-lg flex flex-col justify-between p-4 sm:p-6 text-white select-none">
              {/* Floating Top Map Toolbar */}
              <div className="relative z-30 flex flex-wrap items-center justify-between gap-2.5 rounded-xl bg-slate-950/85 p-2.5 sm:p-3 backdrop-blur-md border border-slate-800 shadow-md">
                {/* Active Tracking Target info */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
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
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px] sm:max-w-[220px]">
                      {activeFleetItem ? `${activeFleetItem.make} ${activeFleetItem.model}` : "Monitoring fleet"}
                    </p>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="flex items-center gap-2 text-xs">
                  {/* Coordinates Badge */}
                  <span className="hidden md:inline-flex rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-mono text-emerald-400 border border-slate-800">
                    Lat: {activeFleetItem?.latitude.toFixed(4)}, Lng: {activeFleetItem?.longitude.toFixed(4)}
                  </span>

                  {/* Map Layer Switch */}
                  <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setMapMode("radar")}
                      className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase transition ${
                        mapMode === "radar" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Radar
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapMode("satellite")}
                      className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase transition ${
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
                      className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs font-bold hover:bg-slate-700 transition text-slate-200"
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
                      className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs font-bold hover:bg-slate-700 transition text-slate-200"
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
                    {/* High-Tech Radar Grid */}
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
                  <Navigation className="h-3 w-3" /> ARUSHA TRANSIT CORRIDOR • GRID 36S
                </div>
                <div className="absolute bottom-16 right-6 pointer-events-none text-[10px] font-mono text-slate-600">
                  REF: WGS-84 / GEODESIC
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
              <div className="relative z-30 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-slate-950/85 p-2.5 sm:p-3 backdrop-blur-md border border-slate-800 text-xs">
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
                    <User className="h-3 w-3 text-emerald-400" /> Driver
                  </p>
                  <p className="text-sm font-bold text-slate-200 truncate mt-0.5">
                    {activeFleetItem?.driverName || "Unassigned"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-emerald-400" /> GPS Device
                  </p>
                  <p className="text-sm font-bold font-mono text-slate-200 truncate mt-0.5">
                    {activeFleetItem?.deviceSerial || activeFleetItem?.deviceId || "GPS-ACTIVE"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Floating Simulator Drawer / Side Panel (opens on demand) */}
            {showSimulator && (
              <div className="mt-4 lg:mt-0">
                <SimulatorPanel
                  vehicles={allVehicles}
                  selectedVehicleId={effectiveVehicleId || undefined}
                  onVehicleChange={(vId) => setSelectedVehicleId(vId)}
                  onClose={() => setShowSimulator(false)}
                  isFloating={true}
                />
              </div>
            )}
          </div>

          {/* TELEMETRY WIDGETS SECTION (3 Columns Desktop / 2 Tablet / 1 Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Speedometer Widget */}
            <Speedometer
              speed={activeTelemetry ? activeTelemetry.speed : activeFleetItem?.speed ?? 0}
              maxSpeed={120}
            />

            {/* Heading Compass Widget */}
            <HeadingCompass
              heading={activeTelemetry ? activeTelemetry.heading : activeFleetItem?.heading ?? 90}
            />

            {/* Full Telemetry Card */}
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
          </div>

          {/* MONITORED FLEET ROSTER & FILTER LIST */}
          <Card className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-text-primary">
                  Monitored Units ({fleet.length})
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Select any vehicle to center map tracking and stream telemetry
                </p>
              </div>

              {/* Search and Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search fleet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border border-border bg-white pl-8 pr-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-center rounded-xl bg-surface p-0.5 border border-border text-xs">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                      statusFilter === "all" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    All ({fleet.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("moving")}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                      statusFilter === "moving" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Moving ({stats.moving})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("idle")}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                      statusFilter === "idle" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Idle ({stats.idle})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("offline")}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                      statusFilter === "offline" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Offline ({stats.offline})
                  </button>
                </div>
              </div>
            </div>

            {filteredFleet.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No vehicles matching filter &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredFleet.map((v) => {
                  const isSelected = activeFleetItem?.vehicleId === v.vehicleId;

                  return (
                    <button
                      key={v.vehicleId}
                      type="button"
                      onClick={() => {
                        setSelectedVehicleId(v.vehicleId);
                        setShowInfoWindow(true);
                      }}
                      className={`flex items-center justify-between rounded-xl p-3.5 text-left transition border ${
                        isSelected
                          ? "border-primary bg-emerald-50/50 shadow-xs ring-1 ring-primary/30"
                          : "border-border bg-white hover:bg-surface-hover hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-surface text-text-secondary border border-border"
                          }`}
                        >
                          <Car className="h-5 w-5" />
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
                            {v.make} {v.model} • {v.driverName || "No driver"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge status={v.status === "online" ? "online" : v.status === "idle" ? "idle" : "offline"}>
                          {v.status}
                        </Badge>
                        <span className="text-[11px] font-mono font-semibold text-text-primary">
                          {Math.round(v.speed)} km/h
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
