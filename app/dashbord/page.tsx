"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  Car,
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
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";

export default function DashboardPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /*
   * IMPORTANT:
   * No vehicles are created here.
   * No fake numbers are inserted.
   *
   * These values should later come from Firestore.
   */
  const dashboardStats = {
    vehicles: 0,
    online: 0,
    idle: 0,
    offline: 0,
  };

  const handleLogout = () => {
    // Firebase logout will be connected here.
    router.push("/login");
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
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary">

      {/* ======================================================
          MOBILE SIDEBAR OVERLAY
      ======================================================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ======================================================
          SIDEBAR
      ======================================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-border bg-surface
          transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* BRAND */}

        <div className="flex h-20 items-center justify-between border-b border-border px-6">

          <button
            type="button"
            onClick={() => router.push("/dashbord")}
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <Truck className="h-5 w-5" />
            </div>

            <div className="text-left">
              <p className="font-display text-lg font-bold tracking-tight">
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
                  className={`
                    group flex w-full items-center gap-3 rounded-xl
                    px-3 py-3 text-sm font-semibold transition-all
                    ${
                      item.active
                        ? "bg-primary text-white shadow-lg shadow-primary/15"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    }
                  `}
                >

                  <Icon
                    className={`
                      h-[18px] w-[18px]
                      ${
                        item.active
                          ? "text-white"
                          : "text-text-muted group-hover:text-primary"
                      }
                    `}
                  />

                  <span>{item.label}</span>

                  {item.active && (
                    <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                  )}

                </button>
              );
            })}

          </nav>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
            System
          </p>

          <nav className="space-y-1">

            <button
              type="button"
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
            >
              <Settings className="h-[18px] w-[18px] text-text-muted group-hover:text-primary" />
              Settings
            </button>

          </nav>

        </div>

        {/* SIDEBAR USER */}

        <div className="border-t border-border p-4">

          <div className="mb-3 flex items-center gap-3 rounded-xl bg-background p-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <CircleUserRound className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                Account
              </p>

              <p className="truncate text-[11px] text-text-muted">
                Fleet administrator
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>

        </div>

      </aside>

      {/* ======================================================
          MAIN AREA
      ======================================================= */}

      <div className="lg:pl-72">

        {/* ====================================================
            TOP HEADER
        ===================================================== */}

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

                <h1 className="font-display text-lg font-bold">
                  Dashboard
                </h1>
              </div>

            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                className="relative rounded-xl border border-border bg-surface p-2.5 text-text-secondary transition hover:text-text-primary"
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
                  <p className="text-xs font-bold">
                    Administrator
                  </p>

                  <p className="text-[10px] text-text-muted">
                    Fleet Manager
                  </p>
                </div>

              </div>

            </div>

          </div>

        </header>

        {/* ====================================================
            CONTENT
        ===================================================== */}

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

          {/* HERO */}

          <section className="mb-8">

            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">

              {/* decorative background */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative">

                <div className="mb-4 flex items-center gap-2">

                  <Badge status="online">
                    System Ready
                  </Badge>

                </div>

                <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Fleet command center
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                  Monitor your vehicles, drivers, devices and
                  operations from one centralized workspace.
                </p>

              </div>

            </div>

          </section>

          {/* ==================================================
              STATS
          =================================================== */}

          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              label="Total Vehicles"
              value={dashboardStats.vehicles.toString()}
              detail="Vehicles registered in fleet"
              status="primary"
            />

            <StatCard
              label="Online"
              value={dashboardStats.online.toString()}
              detail="Currently connected"
              status="success"
            />

            <StatCard
              label="Idle"
              value={dashboardStats.idle.toString()}
              detail="Currently stationary"
              status="warning"
            />

            <StatCard
              label="Offline"
              value={dashboardStats.offline.toString()}
              detail="Currently disconnected"
              status="danger"
            />

          </section>

          {/* ==================================================
              MAIN GRID
          =================================================== */}

          <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

            {/* LIVE MAP */}

            <Card className="overflow-hidden">

              <div className="flex items-center justify-between border-b border-border p-5">

                <div>
                  <div className="flex items-center gap-2">

                    <Map className="h-4 w-4 text-primary" />

                    <h3 className="font-display text-base font-semibold">
                      Live Fleet Map
                    </h3>

                  </div>

                  <p className="mt-1 text-xs text-text-muted">
                    Real-time vehicle positioning
                  </p>
                </div>

                <Button
                  variant="ghost"
                  onClick={() =>
                    router.push("/dashbord/tracking")
                  }
                >
                  Open Map
                  <ChevronRight className="h-4 w-4" />
                </Button>

              </div>

              <div className="flex min-h-[360px] items-center justify-center bg-background p-6">

                <div className="max-w-sm text-center">

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface shadow-sm">

                    <Map className="h-7 w-7 text-text-muted" />

                  </div>

                  <h4 className="font-display text-base font-semibold">
                    No vehicle locations available
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    Add vehicles and connect GPS devices to begin
                    viewing your fleet on the live map.
                  </p>

                  <Button
                    variant="secondary"
                    className="mt-5"
                    onClick={() =>
                      router.push("/dashbord/vehicles")
                    }
                  >
                    Manage Vehicles
                  </Button>

                </div>

              </div>

            </Card>

            {/* OPERATIONS */}

            <Card className="overflow-hidden">

              <div className="border-b border-border p-5">

                <div className="flex items-center gap-2">

                  <Activity className="h-4 w-4 text-primary" />

                  <h3 className="font-display text-base font-semibold">
                    Operations
                  </h3>

                </div>

                <p className="mt-1 text-xs text-text-muted">
                  Fleet management shortcuts
                </p>

              </div>

              <div className="divide-y divide-border">

                {/* VEHICLES */}

                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashbord/vehicles")
                  }
                  className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-background"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-bold">
                      Vehicles
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Register and manage fleet vehicles
                    </p>

                  </div>

                  <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />

                </button>

                {/* DRIVERS */}

                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashbord/drivers")
                  }
                  className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-background"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-bold">
                      Drivers
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Manage driver profiles and assignments
                    </p>

                  </div>

                  <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />

                </button>

                {/* DEVICES */}

                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashbord/devices")
                  }
                  className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-background"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-bold">
                      GPS Devices
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Connect and monitor tracking devices
                    </p>

                  </div>

                  <ChevronRight className="h-4 w-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary" />

                </button>

              </div>

            </Card>

          </section>

          {/* ==================================================
              SYSTEM STATUS
          =================================================== */}

          <section className="mt-6">

            <Card className="p-5">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
                    <ShieldCheck className="h-5 w-5 text-success" />
                  </div>

                  <div>

                    <h3 className="text-sm font-bold">
                      System Status
                    </h3>

                    <p className="mt-1 text-xs text-text-muted">
                      Orbit Fleet services are ready for configuration.
                    </p>

                  </div>

                </div>

                <Badge status="online">
                  Operational
                </Badge>

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