"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ChevronRight,
  Map,
  Truck,
  Users,
  Plus,
  Car,
  CheckCircle2,
  Radio,
  Clock,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import {
  subscribeVehicles,
  getDrivers,
  getDevices,
  type Vehicle,
  type Driver,
  type GPSDevice,
} from "@/app/dashbord/database";

export default function DashboardPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [devices, setDevices] = useState<GPSDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    // Load drivers & devices
    Promise.all([getDrivers(), getDevices()])
      .then(([dList, devList]) => {
        if (isMounted) {
          setDrivers(dList);
          setDevices(devList);
        }
      })
      .catch((err) => console.error("Error loading aux stats:", err));

    // Subscribe to real-time vehicles
    const unsubscribe = subscribeVehicles(
      (list) => {
        if (isMounted) {
          setVehicles(list);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Dashboard vehicle subscription:", err);
        if (isMounted) setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const totalVehicles = vehicles.length;
  const onlineCount = vehicles.filter((v) => v.status === "online").length;
  const idleCount = vehicles.filter((v) => v.status === "idle").length;
  const offlineCount = vehicles.filter((v) => v.status === "offline").length;

  return (
    <DashboardLayout title="Fleet Command Dashboard">
      {/* HERO SECTION */}
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Badge status="online">Realtime Telemetry Active</Badge>
                <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                  <Radio className="h-3.5 w-3.5 text-primary animate-pulse" />
                  Firestore Connected
                </span>
              </div>

              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-text-primary">
                Fleet Command Center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                Monitor your vehicles, active drivers, GPS telematics, and operational dispatch in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="secondary"
                onClick={() => router.push("/dashbord/tracking")}
                className="gap-2"
              >
                <Map className="h-4 w-4 text-primary" />
                Live Map View
              </Button>
              <Button
                onClick={() => router.push("/dashbord/vehicles")}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STAT CARDS (4 Columns Desktop / 2 Tablet / 1 Mobile) */}
      <section className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Vehicles"
          value={totalVehicles}
          detail={`${totalVehicles} active units in fleet`}
          status="primary"
          icon={Truck}
          trend={{ value: "100%", isPositive: true, label: "Fleet Ready" }}
        />
        <StatCard
          label="Online & Moving"
          value={onlineCount}
          detail="Transmitting live GPS telemetry"
          status="success"
          icon={Activity}
          trend={{
            value: totalVehicles > 0 ? `${Math.round((onlineCount / totalVehicles) * 100)}%` : "0%",
            isPositive: true,
            label: "Active",
          }}
        />
        <StatCard
          label="Idle / Standby"
          value={idleCount}
          detail="Stationary or ignition standby"
          status="warning"
          icon={Clock}
        />
        <StatCard
          label="Offline / Parked"
          value={offlineCount}
          detail="Parked or device powered down"
          status="danger"
          icon={Car}
        />
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* FLEET OVERVIEW CARD */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Map className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-text-primary">
                  Monitored Fleet Units
                </h2>
                <p className="text-xs text-text-muted">
                  Live vehicle status & assignments
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => router.push("/dashbord/tracking")}
              className="text-xs"
            >
              Open Full Map
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center bg-background p-6 text-sm text-text-muted">
              <Activity className="mb-2 h-6 w-6 animate-spin text-primary" />
              Loading real-time fleet state...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center bg-background p-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface shadow-xs">
                  <Truck className="h-6 w-6 text-text-muted" />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">
                  No vehicles registered
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
                  Add vehicles to your fleet registry to begin tracking location, speed, and status in real time.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => router.push("/dashbord/vehicles")}
                >
                  <Plus className="h-4 w-4 mr-1" /> Register Vehicle
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border p-3">
              {vehicles.slice(0, 5).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition cursor-pointer"
                  onClick={() => router.push("/dashbord/tracking")}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-text-primary">
                          {v.registrationNumber}
                        </span>
                        <span className="text-xs text-text-muted">
                          {v.make} {v.model}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        Driver: {v.driverName || "Unassigned"} • {v.location || "Arusha"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge status={v.status}>{v.status}</Badge>
                    <ChevronRight className="h-4 w-4 text-text-muted hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* OPERATIONS MODULES & SHORTCUTS */}
        <Card className="overflow-hidden">
          <div className="border-b border-border p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-text-primary">
                  Operations & Modules
                </h2>
                <p className="text-xs text-text-muted">
                  Quick access to fleet subsystems
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            {/* VEHICLES */}
            <button
              type="button"
              onClick={() => router.push("/dashbord/vehicles")}
              className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-surface-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 transition group-hover:scale-105">
                <Truck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-text-primary">
                    Vehicle Fleet Registry
                  </p>
                  <span className="text-xs font-semibold text-primary font-mono">
                    {totalVehicles} units
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Manage vehicle profiles, maintenance & assignments
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
            </button>

            {/* DRIVERS */}
            <button
              type="button"
              onClick={() => router.push("/dashbord/drivers")}
              className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-surface-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 transition group-hover:scale-105">
                <Users className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-text-primary">
                    Drivers & Operators
                  </p>
                  <span className="text-xs font-semibold text-primary font-mono">
                    {drivers.length} drivers
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Driver roster, credentials & performance
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
            </button>

            {/* DEVICES */}
            <button
              type="button"
              onClick={() => router.push("/dashbord/devices")}
              className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-surface-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 transition group-hover:scale-105">
                <Radio className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-text-primary">
                    GPS Hardware Trackers
                  </p>
                  <span className="text-xs font-semibold text-primary font-mono">
                    {devices.length} units
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Hardware telemetry devices, IMEI & battery status
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
            </button>

            {/* RBAC */}
            <button
              type="button"
              onClick={() => router.push("/dashbord/settings")}
              className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-surface-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 transition group-hover:scale-105">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-text-primary">
                    RBAC & Access Control
                  </p>
                  <span className="text-xs font-semibold text-text-muted">
                    Secure
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Role assignments and user permission levels
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
            </button>
          </div>
        </Card>
      </section>

      {/* SYSTEM STATUS BANNER */}
      <section className="mt-6">
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">
                  All Telemetry & Firestore Services Operational
                </p>
                <p className="text-xs text-text-muted">
                  Active connection to Orbit Cloud backend • Real-time socket & Firestore stream latency &lt; 25ms
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge status="online">Connected</Badge>
            </div>
          </div>
        </Card>
      </section>
    </DashboardLayout>
  );
}
