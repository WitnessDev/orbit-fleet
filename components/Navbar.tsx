"use client";

import { Bell, Menu, Radio } from "lucide-react";
import { useCurrentRole } from "@/lib/auth/useCurrentRole";

interface NavbarProps {
  title?: string;
  onOpenMobileSidebar?: () => void;
}

export default function Navbar({
  title = "Dashboard",
  onOpenMobileSidebar,
}: NavbarProps) {
  const { roleConfig } = useCurrentRole();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileSidebar && (
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-xl border border-slate-200 bg-surface p-2 text-text-secondary hover:bg-slate-100 hover:text-text-primary lg:hidden cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Fleet Intelligence
          </p>
          <h1 className="font-display text-lg font-bold text-text-primary truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* System Online Live Badge */}
        <div className="hidden xs:flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Telemetry Live</span>
          <span className="sm:hidden">Live</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          className="relative rounded-xl border border-border bg-white p-2.5 text-slate-500 transition hover:text-slate-800 hover:border-slate-300"
          title="Telemetry alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <div className="hidden h-7 w-px bg-border sm:block" />

        {/* User Role Badge in Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Radio className="h-4 w-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">
                {roleConfig.label}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {roleConfig.shortDescription}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
