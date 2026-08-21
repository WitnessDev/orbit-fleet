"use client";

import {
  ChevronDown,
  Compass,
  Grid,
  LogOut,
  Route,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md md:px-12">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            Orbit Fleet
          </span>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              App
            </span>
            <button className="flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Dashboards
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="App launcher"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              aria-label="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-14">
        {/* Hero Card Container */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 md:p-12">
          {/* Subtle Map Grid Background Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
              backgroundSize: "20px 20px, 40px 40px, 40px 40px",
            }}
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6">
              {/* Vibrant Gradient Heading */}
              <h1 className="font-display text-4xl font-extrabold tracking-tight leading-[1.15] md:text-5xl">
                Streamline{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-lime-500 bg-clip-text text-transparent">
                  Your Fleet Management
                </span>
              </h1>

              <p className="mt-5 text-sm leading-relaxed text-slate-600 md:text-base">
                Optimize operations, track vehicles in real-time, reduce costs,
                and enhance driver safety with our comprehensive, cloud-based
                fleet solutions. Real-time GPS tracking, maintenance alerts,
                and insightful analytics at your fingertips.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-800 shadow-md shadow-emerald-700/20"
                >
                  Get Started for Free
                </Link>
                <button className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                  Request Demo
                </button>
              </div>

              {/* Quick Feature Highlights */}
              <div className="mt-12 flex items-center gap-8 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Compass className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Live Tracking
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Route className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Routing
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Maintenance
                  </span>
                </div>
              </div>
            </div>

            {/* Right Graphic Illustration Column */}
            <div className="relative flex justify-center lg:col-span-6">
              <div className="relative w-full max-w-lg">
                <Image
                  src="/fleet-illustration.png" // Place your vector graphic in /public/fleet-illustration.png
                  alt="Fleet Management Illustration"
                  width={600}
                  height={450}
                  priority
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Floating Metric Pill */}
          <div className="relative mt-8 z-10 flex justify-center lg:justify-end">
            <div className="inline-flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white/90 px-5 py-2.5 text-xs font-medium text-slate-600 shadow-lg shadow-slate-100 backdrop-blur-sm">
              <span>
                Active Vehicles:{" "}
                <strong className="font-bold text-slate-900">1,452</strong>
              </span>
              <span className="h-3 w-px bg-slate-200" />
              <span>
                Driver Safety:{" "}
                <strong className="font-bold text-slate-900">96%</strong>
              </span>
              <span className="h-3 w-px bg-slate-200" />
              <span>
                Maintenance Alerts:{" "}
                <strong className="font-bold text-slate-900">12</strong>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}