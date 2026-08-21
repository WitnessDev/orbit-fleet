"use client";

import {
  Navigation,
  X,
  Gauge,
  MapPin,
  Truck,
  Users,
  Bell,
  Settings,
  CircleHelp,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const vehicles = [
  {
    plate: "T 123 ABC",
    driver: "John Mushi",
    type: "Toyota Hilux",
    status: "Online",
    speed: "64 km/h",
    location: "Arusha",
  },
  {
    plate: "T 456 XYZ",
    driver: "Peter Joseph",
    type: "Isuzu D-Max",
    status: "Online",
    speed: "48 km/h",
    location: "Moshi",
  },
  {
    plate: "T 789 DEF",
    driver: "Michael Elias",
    type: "Toyota Land Cruiser",
    status: "Idle",
    speed: "0 km/h",
    location: "Dodoma",
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-text-primary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-border bg-background-secondary transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo with Gradient Accent */}
        <div className="flex h-[78px] items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
              <Navigation size={19} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="font-display text-[17px] font-bold tracking-tight">
                ORBIT
              </h1>
              <p className="text-[10px] font-bold tracking-[0.25em] text-gradient">
                FLEET
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-text-muted hover:text-text-primary lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
            Main menu
          </p>

          <div className="space-y-1">
            <NavItem active icon={<Gauge size={18} />} label="Dashboard" />
            <NavItem icon={<MapPin size={18} />} label="Live Tracking" />
            <NavItem icon={<Truck size={18} />} label="Vehicles" />
            <NavItem icon={<Users size={18} />} label="Drivers" />
            <NavItem icon={<Navigation size={18} />} label="Trips" />
          </div>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
            Management
          </p>

          <div className="space-y-1">
            <NavItem icon={<MapPin size={18} />} label="Geofences" />
            <NavItem
              icon={<Bell size={18} />}
              label="Alerts"
              notification
            />
            <NavItem icon={<Gauge size={18} />} label="Reports" />
          </div>
        </nav>

        {/* Bottom User Section */}
        <div className="border-t border-border p-4">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<CircleHelp size={18} />} label="Help Center" />

          <div className="mt-4 flex items-center gap-3 rounded-lg bg-surface p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-white">
              W
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Witness</p>
              <p className="truncate text-xs text-text-muted">Fleet Owner</p>
            </div>

            <ChevronDown size={15} className="text-text-muted" />
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-[250px]">
        {/* Topbar */}
        <header className="flex h-[78px] items-center justify-between border-b border-border bg-background px-5 md:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-secondary lg:hidden"
          >
            <Menu size={23} />
          </button>

          <div className="hidden lg:block">
            <p className="text-xs text-text-muted">Monday, August 17, 2026</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition hover:border-border-light hover:text-text-primary">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>

            <div className="hidden h-7 w-px bg-border sm:block" />

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold">Witness Kivuyo</p>
                <p className="text-[11px] text-text-muted">Owner account</p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display font-bold text-white">
                W
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-5 md:p-8">
          {/* Hero Header with Multi-Color Text */}
          <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Fleet overview
              </p>

              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Good afternoon, <span className="text-gradient">Witness</span>.
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                Here&apos;s what&apos;s happening across your fleet right now.
              </p>
            </div>

            <Button className="w-fit px-5 py-3">
              <Truck size={17} />
              Add vehicle
            </Button>
          </section>

          {/* Stats Cards Grid */}
          <section className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard
              label="Total vehicles"
              value="24"
              detail="+3 this month"
              accent={true}
            />

            <StatCard
              label="Online"
              value="18"
              detail="75% of fleet"
              status="success"
            />

            <StatCard
              label="Idle"
              value="04"
              detail="Currently stopped"
              status="warning"
            />

            <StatCard
              label="Offline"
              value="02"
              detail="Requires attention"
              status="danger"
            />
          </section>

          {/* Map & Vehicle Activity Panel */}
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            {/* Map Card */}
            <Card className="overflow-hidden">
              <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                    <h3 className="font-display text-base font-bold">
                      Live fleet
                    </h3>
                  </div>

                  <p className="mt-1 text-xs text-text-muted">
                    Real-time vehicle locations
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-medium text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Moving
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    Idle
                  </span>

                  <button className="rounded-md border border-border px-3 py-1.5 text-text-secondary hover:text-text-primary">
                    Full map
                  </button>
                </div>
              </div>

              {/* Simulated Map View */}
              <div className="relative h-[420px] overflow-hidden bg-slate-900">
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                  }}
                />

                <div className="absolute left-[15%] top-[-10%] h-[130%] w-px rotate-[24deg] bg-white/10" />
                <div className="absolute left-[45%] top-[-10%] h-[130%] w-px rotate-[-17deg] bg-white/10" />
                <div className="absolute left-[-10%] top-[55%] h-px w-[130%] rotate-[-8deg] bg-white/10" />
                <div className="absolute left-[-10%] top-[28%] h-px w-[130%] rotate-[14deg] bg-white/10" />

                <div className="absolute left-5 top-5 rounded-lg border border-border bg-surface/90 px-4 py-3 backdrop-blur-md shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">
                    Current region
                  </p>
                  <p className="mt-1 font-display text-sm font-semibold">
                    Northern Tanzania
                  </p>
                </div>

                <MapMarker left="25%" top="42%" plate="T 123 ABC" />
                <MapMarker left="58%" top="32%" plate="T 456 XYZ" />
                <MapMarker
                  left="70%"
                  top="66%"
                  plate="T 789 DEF"
                  idle
                />

                <div className="absolute bottom-5 right-5 flex flex-col overflow-hidden rounded-lg border border-border bg-surface/90 backdrop-blur-md">
                  <button className="flex h-10 w-10 items-center justify-center border-b border-border text-lg hover:bg-surface-hover">
                    +
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center text-lg hover:bg-surface-hover">
                    −
                  </button>
                </div>
              </div>
            </Card>

            {/* Active Vehicles List Panel */}
            <div className="rounded-xl border border-border bg-surface shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b border-border p-5">
                <div>
                  <h3 className="font-display text-base font-bold">
                    Active vehicles
                  </h3>
                  <p className="mt-1 text-xs text-text-muted">
                    Latest fleet activity
                  </p>
                </div>

                <button className="text-xs font-bold text-primary hover:text-primary-hover">
                  View all
                </button>
              </div>

              <div className="divide-y divide-border">
                {vehicles.map((vehicle) => (
                  <VehicleItem key={vehicle.plate} vehicle={vehicle} />
                ))}
              </div>

              <div className="p-4">
                <button className="w-full rounded-lg border border-border py-2.5 text-xs font-bold text-text-secondary transition hover:border-border-light hover:text-text-primary">
                  View fleet
                </button>
              </div>
            </div>
          </section>

          {/* Bottom Insights */}
          <section className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                    Fleet health
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold">
                    Everything looks good
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-light text-success">
                  <Gauge size={18} />
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[88%] rounded-full bg-primary" />
              </div>

              <div className="mt-3 flex justify-between text-xs text-text-muted">
                <span>Fleet health</span>
                <span className="font-bold text-success">88%</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Quick insight
              </p>

              <h3 className="mt-1 font-display text-lg font-bold">
                <span className="text-gradient">18 vehicles</span> are currently moving
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Your fleet is operating normally. Two vehicles are offline
                and may require a connection check.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* --------------------------------
   Helper Components
-------------------------------- */

function NavItem({
  icon,
  label,
  active = false,
  notification = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  notification?: boolean;
}) {
  return (
    <button
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
        active
          ? "bg-primary text-white"
          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
      }`}
    >
      {icon}

      <span className="flex-1">{label}</span>

      {notification && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active ? "bg-white" : "bg-primary"
          }`}
        />
      )}
    </button>
  );
}

function StatCard({
  label,
  value,
  detail,
  accent = false,
  status,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
  status?: "success" | "warning" | "danger";
}) {
  const statusColor = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-text-muted">
          {label}
        </p>

        <span
          className={`h-1.5 w-1.5 rounded-full ${
            accent
              ? "bg-primary"
              : status === "success"
                ? "bg-success"
                : status === "warning"
                  ? "bg-warning"
                  : "bg-danger"
          }`}
        />
      </div>

      <p
        className={`mt-4 font-display text-3xl font-semibold tracking-tight ${
          accent ? "text-primary" : status ? statusColor[status] : ""
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs text-text-muted">{detail}</p>
    </div>
  );
}

function VehicleItem({
  vehicle,
}: {
  vehicle: (typeof vehicles)[number];
}) {
  const isIdle = vehicle.status === "Idle";

  return (
    <div className="p-5 transition hover:bg-surface-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-bold">{vehicle.plate}</p>
          <p className="mt-1 text-xs text-text-muted">{vehicle.type}</p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
            isIdle
              ? "bg-warning-light text-warning"
              : "bg-success-light text-success"
          }`}
        >
          {vehicle.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">
            Driver
          </p>
          <p className="mt-1 text-xs font-medium">{vehicle.driver}</p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">
            Speed
          </p>
          <p className="mt-1 font-display text-xs font-semibold">
            {vehicle.speed}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-text-muted">
        <MapPin size={12} />
        {vehicle.location}
      </div>
    </div>
  );
}

function MapMarker({
  left,
  top,
  plate,
  idle = false,
}: {
  left: string;
  top: string;
  plate: string;
  idle?: boolean;
}) {
  return (
    <div
      className="absolute"
      style={{
        left,
        top,
      }}
    >
      <div className="group relative">
        <div
          className={`absolute -inset-3 animate-ping rounded-full opacity-25 ${
            idle ? "bg-warning" : "bg-primary"
          }`}
        />

        <div
          className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface shadow-lg ${
            idle ? "bg-warning text-white" : "bg-primary text-white"
          }`}
        >
          <Truck size={15} strokeWidth={2.5} />
        </div>

        <div className="absolute left-1/2 top-11 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2.5 py-1.5 text-[10px] font-bold shadow-xl group-hover:block">
          {plate}
        </div>
      </div>
    </div>
  );
}