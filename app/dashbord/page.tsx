"use client";

import Link from "next/link";
import {
  Navigation,
  ArrowRight,
  MapPin,
  Truck,
  ShieldCheck,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      {/* Navigation */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Navigation size={20} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="font-display text-lg font-bold tracking-tight">
                ORBIT
              </h1>

              <p className="text-[10px] font-bold tracking-[0.25em] text-gradient">
                FLEET
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Features
            </a>

            <a
              href="#tracking"
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Tracking
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              About
            </a>
          </nav>

          {/* Login */}
          <Link
            href="/login"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-2">
          {/* Hero Content */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />

              <span className="text-xs font-bold text-text-secondary">
                Fleet management platform
              </span>
            </div>

            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Manage your fleet.
              <br />
              <span className="text-gradient">Move smarter.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary md:text-lg">
              Orbit Fleet gives you complete visibility over your vehicles,
              drivers, trips and GPS activity from one powerful platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary-hover"
              >
                Get started
                <ArrowRight size={17} />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3.5 text-sm font-bold text-text-primary transition hover:bg-surface-hover"
              >
                Explore features
              </a>
            </div>

            {/* Small Stats */}
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-border pt-7">
              <div>
                <p className="font-display text-2xl font-bold">24/7</p>
                <p className="mt-1 text-xs text-text-muted">
                  Fleet visibility
                </p>
              </div>

              <div>
                <p className="font-display text-2xl font-bold">GPS</p>
                <p className="mt-1 text-xs text-text-muted">
                  Live tracking
                </p>
              </div>

              <div>
                <p className="font-display text-2xl font-bold">100%</p>
                <p className="mt-1 text-xs text-text-muted">
                  Fleet control
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs text-text-muted">Fleet overview</p>

                  <p className="mt-1 font-display text-lg font-bold">
                    Live operations
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-success" />

                  <span className="text-xs font-semibold text-success">
                    Live
                  </span>
                </div>
              </div>

              {/* Fake Map */}
              <div className="relative mt-4 h-[360px] overflow-hidden rounded-xl bg-slate-900">
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                    backgroundSize: "45px 45px",
                  }}
                />

                <div className="absolute left-[18%] top-[30%] h-[160%] w-px rotate-[25deg] bg-white/10" />

                <div className="absolute left-[58%] top-[-20%] h-[160%] w-px rotate-[-18deg] bg-white/10" />

                <div className="absolute left-[-10%] top-[55%] h-px w-[130%] rotate-[-8deg] bg-white/10" />

                <MapMarker left="25%" top="40%" />

                <MapMarker left="62%" top="30%" />

                <MapMarker left="72%" top="65%" idle />

                {/* Location Label */}
                <div className="absolute left-5 top-5 rounded-lg border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
                  <p className="text-[10px] uppercase tracking-wider text-white/50">
                    Current region
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    Northern Tanzania
                  </p>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-5 right-5 overflow-hidden rounded-lg border border-white/10 bg-black/40 backdrop-blur-md">
                  <button className="flex h-10 w-10 items-center justify-center border-b border-white/10 text-lg text-white">
                    +
                  </button>

                  <button className="flex h-10 w-10 items-center justify-center text-lg text-white">
                    −
                  </button>
                </div>
              </div>

              {/* Preview Footer */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <PreviewStat
                  icon={<Truck size={15} />}
                  value="24"
                  label="Vehicles"
                />

                <PreviewStat
                  icon={<Activity size={15} />}
                  value="18"
                  label="Moving"
                />

                <PreviewStat
                  icon={<MapPin size={15} />}
                  value="12"
                  label="Locations"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-border bg-background-secondary py-20"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Everything in one place
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Complete fleet control
            </h2>

            <p className="mt-4 text-text-secondary">
              Manage your entire fleet operation from a simple and powerful
              dashboard.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<MapPin size={20} />}
              title="Live Tracking"
              description="Monitor vehicle locations and movement in real time."
            />

            <FeatureCard
              icon={<Truck size={20} />}
              title="Vehicle Management"
              description="Keep complete records of every vehicle in your fleet."
            />

            <FeatureCard
              icon={<Activity size={20} />}
              title="Trip Management"
              description="Track trips, routes, activity and fleet performance."
            />

            <FeatureCard
              icon={<ShieldCheck size={20} />}
              title="Secure Access"
              description="Manage users and fleet permissions with secure authentication."
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Orbit Fleet
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight md:text-4xl">
            Smarter fleet operations start here.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-text-secondary">
            Orbit Fleet is built to help fleet owners, managers and
            organizations understand what is happening across their vehicles
            and operations.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            Enter Orbit Fleet
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 text-xs text-text-muted md:flex-row md:px-8">
          <p>© 2026 Orbit Fleet. All rights reserved.</p>

          <p>Fleet management & GPS tracking platform.</p>
        </div>
      </footer>
    </main>
  );
}

/* --------------------------------
   Feature Card
-------------------------------- */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
        {icon}
      </div>

      <h3 className="mt-5 font-display text-base font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {description}
      </p>
    </div>
  );
}

/* --------------------------------
   Preview Stat
-------------------------------- */

function PreviewStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background-secondary p-3">
      <div className="flex items-center gap-2 text-primary">
        {icon}

        <span className="font-display text-sm font-bold">{value}</span>
      </div>

      <p className="mt-1 text-[10px] text-text-muted">{label}</p>
    </div>
  );
}

/* --------------------------------
   Map Marker
-------------------------------- */

function MapMarker({
  left,
  top,
  idle = false,
}: {
  left: string;
  top: string;
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
      <div
        className={`absolute -inset-3 animate-ping rounded-full opacity-25 ${
          idle ? "bg-warning" : "bg-primary"
        }`}
      />

      <div
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/20 shadow-lg ${
          idle ? "bg-warning" : "bg-primary"
        }`}
      >
        <Truck size={15} className="text-white" />
      </div>
    </div>
  );
}