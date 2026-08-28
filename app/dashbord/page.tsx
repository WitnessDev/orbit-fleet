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
  Clock,
  ShieldCheck,
  Navigation,
  Cpu,
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
import { useCurrentRole } from "@/lib/auth/useCurrentRole";

export default function DashboardPage() {
  const router = useRouter();
  const { role, roleConfig, canAccess } = useCurrentRole();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [devices, setDevices] = useState<GPSDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getDrivers(), getDevices()])
      .then(([dList, devList]) => {
        if (isMounted) {
          setDrivers(dList);
          setDevices(devList);
        }
      })
      .catch((err) => console.error("Error loading aux stats:", err));

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
      {/* Header Bar */}
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {role === "driver" ? "Driver Command View" : "Fleet Operations Overview"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${roleConfig.badgeStyles.bg} ${roleConfig.badgeStyles.border}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${roleConfig.badgeStyles.dot}`} />
                  {roleConfig.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Orbit Cloud Stream Active • Latency &lt; 20ms
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              onClick={() => router.push("/dashbord/tracking")}
              className="gap-2 text-xs"
            >
              <Map className="h-4 w-4 text-emerald-600" />
              Live Map
            </Button>
            {canAccess("vehicles.create") && (
              <Button
                onClick={() => router.push("/dashbord/vehicles")}
                className="gap-1.5 text-xs"
              >
                <Plus className="h-4 w-4" />
                Add Vehicle
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* StatCards Grid: 4 on Desktop, 2 on Tablet, 1 on Mobile */}
      <section className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Registered Units"
          value={totalVehicles}
          detail={`${totalVehicles} vehicles in registry`}
          status="primary"
          icon={Truck}
          trend={{ value: "100%", isPositive: true, label: "Fleet Ready" }}
        />
        <StatCard
          label="Online & Moving"
          value={onlineCount}
          detail="Active telemetry stream"
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
          detail="Ignition standby"
          status="warning"
          icon={Clock}
        />
        <StatCard
          label="Offline / Parked"
          value={offlineCount}
          detail="Depot parking"
          status="danger"
          icon={Car}
        />
      </section>

      {/* Main Operational 2-Column Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Monitored Fleet Units */}
        <Card className="overflow-hidden border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Map className="h-4 w-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Monitored Fleet Units
              </h2>
            </div>

            <Button
              variant="ghost"
              onClick={() => router.push("/dashbord/tracking")}
              className="text-xs text-slate-600 hover:text-emerald-700 gap-1"
            >
              Tracking View
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center p-6 text-xs text-slate-500">
              <Activity className="mb-2 h-5 w-5 animate-spin text-emerald-600" />
              Synchronizing fleet state...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center p-6 text-center">
              <Truck className="h-10 w-10 text-slate-300 mb-2" />
              <p className="font-bold text-slate-900 text-sm">No vehicles registered</p>
              <p className="text-xs text-slate-500 mt-1">
                Register vehicles to begin live GPS tracking.
              </p>
              {canAccess("vehicles.create") && (
                <Button
                  variant="secondary"
                  className="mt-3 text-xs"
                  onClick={() => router.push("/dashbord/vehicles")}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Vehicle
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 p-2">
              {vehicles.slice(0, 5).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => router.push(`/dashbord/tracking?vehicle=${v.id}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <Car className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {v.registrationNumber}
                        </span>
                        <span className="text-xs text-slate-500 truncate">
                          {v.make} {v.model}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {v.driverName ? `Driver: ${v.driverName}` : "Unassigned"} • {v.location || "Arusha"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge status={v.status}>{v.status}</Badge>
                    <ChevronRight className="h-4 w-4 text-slate-400 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Operations Subsystems */}
        <Card className="overflow-hidden border border-slate-200">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Activity className="h-4 w-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Operations & Subsystems
              </h2>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Live Tracking Shortcut */}
            <button
              type="button"
              onClick={() => router.push("/dashbord/tracking")}
              className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 transition group-hover:scale-105">
                <Navigation className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">
                    Live Telemetry Map
                  </p>
                  <span className="text-xs font-semibold text-emerald-700 font-mono">
                    Real-time
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  GPS coordinates, velocity speedometer, and compass
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
            </button>

            {/* Vehicles Registry */}
            {canAccess("vehicles.view") && (
              <button
                type="button"
                onClick={() => router.push("/dashbord/vehicles")}
                className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 transition group-hover:scale-105">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">
                      Vehicle Registry
                    </p>
                    <span className="text-xs font-semibold text-emerald-700 font-mono">
                      {totalVehicles} units
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vehicle profiles, plate assignments & statuses
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
              </button>
            )}

            {/* Drivers */}
            {canAccess("drivers.view") && (
              <button
                type="button"
                onClick={() => router.push("/dashbord/drivers")}
                className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 transition group-hover:scale-105">
                  <Users className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">
                      Drivers & Operators
                    </p>
                    <span className="text-xs font-semibold text-emerald-700 font-mono">
                      {drivers.length} drivers
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Driver roster and contact verification
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
              </button>
            )}

            {/* GPS Hardware Devices */}
            {canAccess("devices.view") && (
              <button
                type="button"
                onClick={() => router.push("/dashbord/devices")}
                className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 transition group-hover:scale-105">
                  <Cpu className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">
                      GPS Hardware Trackers
                    </p>
                    <span className="text-xs font-semibold text-emerald-700 font-mono">
                      {devices.length} units
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hardware tracker telemetry and serial status
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
              </button>
            )}

            {/* Access Control & RBAC */}
            {canAccess("settings.view") && (
              <button
                type="button"
                onClick={() => router.push("/dashbord/settings")}
                className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 transition group-hover:scale-105">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">
                      Access Control & Roles
                    </p>
                    <span className="text-xs font-semibold text-slate-500">
                      RBAC
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Role permissions & organization settings
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
              </button>
            )}
          </div>
        </Card>
      </section>

      {/* System Operational Bar */}
      <section className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Firestore & Geodesic Telemetry Pipeline Connected
              </p>
              <p className="text-[11px] text-slate-500">
                Real-time WebSocket & snapshot synchronizers operating normally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
