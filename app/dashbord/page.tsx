"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  ChevronRight,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Settings,
  ShieldCheck,
  Truck,
  UserRound,
  Users,
  X,
  Plus,
  Car,
  CheckCircle2,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import {
  subscribeVehicles,
  getDrivers,
  getDevices,
  logout,
  type Vehicle,
  type Driver,
  type GPSDevice,
} from "@/app/dashbord/database";

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/login");
    }
  };

  const navigation = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      active: true,
      href: "/dashbord",
    },
    {
      label: "Vehicles",
      icon: Truck,
      active: false,
      href: "/dashbord/vehicles",
    },
    {
      label: "Drivers",
      icon: Users,
      active: false,
      href: "/dashbord/drivers",
    },
    {
      label: "Devices",
      icon: Activity,
      active: false,
      href: "/dashbord/devices",
    },
    {
      label: "Live Tracking",
      icon: Map,
      active: false,
      href: "/dashbord/tracking",
    },
    {
      label: "Settings & RBAC",
      icon: Settings,
      active: false,
      href: "/dashbord/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* BRAND */}
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <button
            type="button"
            onClick={() => router.push("/dashbord")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-bold tracking-tight text-text-primary">
                Orbit Fleet
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted">
                Fleet Intelligence
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-text-muted hover:bg-surface-hover lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push(item.href);
                  }}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                    item.active
                      ? "bg-primary text-white shadow-lg shadow-primary/15"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${
                      item.active
                        ? "text-white"
                        : "text-text-muted group-hover:text-primary"
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.active && (
                    <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR USER & LOGOUT */}
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-background p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <CircleUserRound className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-text-primary">
                Administrator
              </p>
              <p className="truncate text-[11px] text-text-muted">
                Fleet Dispatch Manager
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl p-2.5 text-text-secondary hover:bg-surface lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-xs font-medium text-text-muted">
                  Fleet Operations
                </p>
                <h1 className="font-display text-lg font-bold text-text-primary">
                  Command Center
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="relative rounded-xl border border-border bg-surface p-2.5 text-text-secondary transition hover:text-text-primary"
                title="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>

              <div className="hidden h-9 w-px bg-border sm:block" />

              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <UserRound className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Administrator
                  </p>
                  <p className="text-[10px] text-text-muted">
                    Operations Dispatch
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="mx-auto max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {/* HERO */}
          <section className="mb-8">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Badge status="online">System Connected</Badge>
                    <Badge status="info">Days 1 - 9 Completed</Badge>
                  </div>

                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-text-primary">
                    Fleet command center
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                    Monitor your vehicles, drivers, GPS trackers, and operations in real-time from one unified dashboard.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => router.push("/dashbord/vehicles")}>
                    <Plus className="h-4 w-4 mr-1" /> Add Vehicle
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* STATS (Dynamic Real-time Firestore sync) */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Vehicles"
              value={totalVehicles.toString()}
              detail={`${vehicles.length} active in Firestore`}
              status="primary"
            />
            <StatCard
              label="Online"
              value={onlineCount.toString()}
              detail="Transmitting coordinates"
              status="success"
            />
            <StatCard
              label="Idle"
              value={idleCount.toString()}
              detail="Stationary / Ignition standby"
              status="warning"
            />
            <StatCard
              label="Offline"
              value={offlineCount.toString()}
              detail="Parked or disconnected"
              status="danger"
            />
          </section>

          {/* MAIN GRID */}
          <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* LIVE MAP PREVIEW / ACTIVE VEHICLES */}
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-border p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-base font-semibold text-text-primary">
                      Live Fleet Overview
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    Real-time vehicle positioning & telemetry
                  </p>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => router.push("/dashbord/tracking")}
                >
                  Open Live Map
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {loading ? (
                <div className="flex min-h-[340px] items-center justify-center bg-background p-6 text-sm text-text-muted">
                  <Activity className="mr-2 h-4 w-4 animate-spin text-primary" />
                  Loading fleet data...
                </div>
              ) : vehicles.length === 0 ? (
                <div className="flex min-h-[340px] items-center justify-center bg-background p-6">
                  <div className="max-w-sm text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface shadow-sm">
                      <Map className="h-6 w-6 text-text-muted" />
                    </div>
                    <h4 className="font-display text-base font-semibold text-text-primary">
                      No vehicle locations available
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">
                      Add vehicles and connect GPS devices to begin viewing your fleet on the live map.
                    </p>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={() => router.push("/dashbord/vehicles")}
                    >
                      Manage Vehicles
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 divide-y divide-border">
                  {vehicles.slice(0, 4).map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between py-3 px-2 hover:bg-surface-hover rounded-xl transition cursor-pointer"
                      onClick={() => router.push("/dashbord/vehicles")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Car className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            {v.registrationNumber}
                          </p>
                          <p className="text-xs text-text-muted">
                            {v.make} {v.model} • Driver: {v.driverName || "Unassigned"}
                          </p>
                        </div>
                      </div>
                      <Badge status={v.status}>{v.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* OPERATIONS SHORTCUTS */}
            <Card className="overflow-hidden">
              <div className="border-b border-border p-5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    Operations & Modules
                  </h3>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Days 1 to 9 Fleet components
                </p>
              </div>

              <div className="divide-y divide-border">
                {/* VEHICLES */}
                <button
                  type="button"
                  onClick={() => router.push("/dashbord/vehicles")}
                  className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-background"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-text-primary">
                        Vehicles Management
                      </p>
                      <span className="text-xs font-semibold text-primary">
                        {totalVehicles} units
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">
                      Day 7: Register, edit, assign drivers and GPS trackers
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
                </button>

                {/* DRIVERS */}
                <button
                  type="button"
                  onClick={() => router.push("/dashbord/drivers")}
                  className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-background"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-text-primary">
                        Drivers Management
                      </p>
                      <span className="text-xs font-semibold text-primary">
                        {drivers.length} drivers
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">
                      Day 8: License validation, assignments & status
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
                </button>

                {/* DEVICES */}
                <button
                  type="button"
                  onClick={() => router.push("/dashbord/devices")}
                  className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-background"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-text-primary">
                        GPS Devices & Hardware
                      </p>
                      <span className="text-xs font-semibold text-primary">
                        {devices.length} trackers
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">
                      Day 9: IMEI tracking, connectivity & battery health
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
                </button>

                {/* RBAC */}
                <button
                  type="button"
                  onClick={() => router.push("/dashbord/settings")}
                  className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-background"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-text-primary">
                      RBAC & User Roles
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      Day 5: Super Admin, Manager, and Driver permissions
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
                </button>
              </div>
            </Card>
          </section>

          {/* SYSTEM STATUS */}
          <section className="mt-6">
            <Card className="p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      System Operational (Days 1–9 Active)
                    </h3>
                    <p className="mt-1 text-xs text-text-muted">
                      All schemas, Auth, RBAC, Vehicle, Driver, and Device modules are connected to Firestore.
                    </p>
                  </div>
                </div>
                <Badge status="online">Operational</Badge>
              </div>
            </Card>
          </section>

          {/* FOOTER */}
          <footer className="py-8 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted">
              Orbit Fleet • Fleet Intelligence Platform
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
