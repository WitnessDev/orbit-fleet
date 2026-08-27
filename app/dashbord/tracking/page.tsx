"use client";

import { useEffect, useState } from "react";
import {
  Map,
  Truck,
  Car,
  Radio,
  User,
  Cpu,
  RefreshCw,
  Gauge,
  Compass,
  Plus,
} from "lucide-react";
import Link from "next/link";

import DashboardLayout from "@/components/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  subscribeVehicles,
  getVehicles,
  type Vehicle,
} from "@/app/dashbord/database";

export default function TrackingPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [zoomLevel, setZoomLevel] = useState(13);

  useEffect(() => {
    const unsub = subscribeVehicles(
      (list) => {
        setVehicles(list);
        if (list.length > 0 && !selectedVehicle) {
          setSelectedVehicle(list[0]);
        }
        setLoading(false);
      },
      () => {
        getVehicles().then((list) => {
          setVehicles(list);
          if (list.length > 0 && !selectedVehicle) {
            setSelectedVehicle(list[0]);
          }
          setLoading(false);
        });
      }
    );

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [selectedVehicle]);

  const activeVehicle = selectedVehicle || (vehicles.length > 0 ? vehicles[0] : null);

  return (
    <DashboardLayout title="Live Fleet Tracking">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-text-primary">
              Live Fleet Map
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Real-time telemetry stream, GPS coordinates, vehicle velocities, and active transit paths.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge status="online">Telemetry Active</Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-surface p-8 text-text-muted">
          <RefreshCw className="mr-2 h-5 w-5 animate-spin text-primary" />
          Connecting to GPS telemetry stream...
        </div>
      ) : vehicles.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Map className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-text-primary">
            No vehicle locations available
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            Add vehicles and connect GPS devices to begin viewing your fleet on the live map.
          </p>
          <Link
            href="/dashbord/vehicles"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition"
          >
            <Plus className="h-4 w-4" /> Manage Vehicles
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Map Viewer Canvas */}
          <Card className="relative min-h-[560px] overflow-hidden rounded-2xl border border-border bg-slate-900 shadow-xl flex flex-col justify-between p-6 text-white">
            {/* Top Overlay / Controls */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-950/80 p-3 backdrop-blur-md border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Radio className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 font-mono">
                    {activeVehicle ? activeVehicle.registrationNumber : "FLEET-01"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : "Monitoring"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-mono text-emerald-400">
                  Lat: {activeVehicle?.latitude?.toFixed(4) || "-6.7924"}, Lng: {activeVehicle?.longitude?.toFixed(4) || "39.2083"}
                </span>
                <div className="flex items-center gap-1">
                  <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-mono text-slate-400">
                    {zoomLevel}x
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
                    className="h-7 w-7 rounded bg-slate-800 text-xs font-bold hover:bg-slate-700 transition"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 1, 6))}
                    className="h-7 w-7 rounded bg-slate-800 text-xs font-bold hover:bg-slate-700 transition"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>

            {/* Map Grid / Radar Graphic */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {/* Stylized grid pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Radar circular rings */}
              <div className="absolute h-96 w-96 rounded-full border border-emerald-500/10 animate-pulse" />
              <div className="absolute h-64 w-64 rounded-full border border-emerald-500/20" />
              <div className="absolute h-32 w-32 rounded-full border border-emerald-500/30" />

              {/* Active vehicle marker pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.7)] text-white">
                  <Truck className="h-7 w-7" />
                  <span className="absolute -inset-2 rounded-full border-2 border-emerald-400 animate-ping opacity-60" />
                </div>
                <div className="mt-3 rounded-lg bg-slate-950/90 px-3 py-1.5 text-center text-xs shadow-lg border border-emerald-500/30">
                  <p className="font-bold text-emerald-400 font-mono">
                    {activeVehicle?.registrationNumber}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    {activeVehicle?.location || "Central Terminal"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Status bar */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-slate-950/80 p-3 backdrop-blur-md border border-slate-800 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Gauge className="h-3 w-3 text-emerald-400" /> Speed
                </p>
                <p className="text-sm font-bold font-mono text-emerald-400">
                  {activeVehicle?.status === "online" ? "54 km/h" : "0 km/h"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Compass className="h-3 w-3 text-emerald-400" /> Heading
                </p>
                <p className="text-sm font-bold font-mono text-slate-200">
                  NNE 042°
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <User className="h-3 w-3 text-emerald-400" /> Driver
                </p>
                <p className="text-sm font-bold text-slate-200 truncate">
                  {activeVehicle?.driverName || "Assigned Driver"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-emerald-400" /> GPS Unit
                </p>
                <p className="text-sm font-bold font-mono text-slate-200 truncate">
                  {activeVehicle?.deviceSerial || "GPS-ACTIVE"}
                </p>
              </div>
            </div>
          </Card>

          {/* Vehicle Selection List */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-display text-sm font-bold text-text-primary mb-3">
                Fleet Units ({vehicles.length})
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {vehicles.map((v) => {
                  const isSelected = activeVehicle?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVehicle(v)}
                      className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition border ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:bg-surface-hover"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-surface text-text-secondary"
                          }`}
                        >
                          <Car className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-primary">
                            {v.registrationNumber}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {v.driverName ? v.driverName : "Unassigned"}
                          </p>
                        </div>
                      </div>
                      <Badge status={v.status}>{v.status}</Badge>
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
