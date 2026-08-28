"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  Activity,
  Map,
  Settings,
  LogOut,
  ShieldCheck,
  Shield,
  UserCheck,
  Radio,
  Car,
  X,
} from "lucide-react";
import { logout } from "@/app/dashbord/database";
import { useCurrentRole } from "@/lib/auth/useCurrentRole";
import { OFFICIAL_ROLES, type UserRole } from "@/lib/auth/permissions";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, roleConfig, setRole, canAccess } = useCurrentRole();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Dynamic Navigation Items based on Role Permissions
  const allNavItems = [
    {
      label: role === "driver" ? "My Dashboard" : "Dashboard",
      icon: LayoutDashboard,
      href: "/dashbord",
      active: pathname === "/dashbord",
      show: true,
    },
    {
      label: role === "driver" ? "My Live Route" : "Live Tracking",
      icon: Map,
      href: "/dashbord/tracking",
      active: pathname.startsWith("/dashbord/tracking"),
      show: canAccess("tracking.view") || canAccess("tracking.view_assigned"),
    },
    {
      label: role === "driver" ? "Assigned Vehicle" : "Vehicles",
      icon: Truck,
      href: "/dashbord/vehicles",
      active: pathname.startsWith("/dashbord/vehicles"),
      show: canAccess("vehicles.view") || canAccess("vehicles.view_assigned"),
    },
    {
      label: "Drivers",
      icon: Users,
      href: "/dashbord/drivers",
      active: pathname.startsWith("/dashbord/drivers"),
      show: canAccess("drivers.view"),
    },
    {
      label: "User Management",
      icon: ShieldCheck,
      href: "/dashbord/users",
      active: pathname.startsWith("/dashbord/users") || pathname.startsWith("/users"),
      show: canAccess("users.view"),
    },
    {
      label: "GPS Devices",
      icon: Activity,
      href: "/dashbord/devices",
      active: pathname.startsWith("/dashbord/devices"),
      show: canAccess("devices.view"),
    },
    {
      label: "Settings & Access",
      icon: Settings,
      href: "/dashbord/settings",
      active: pathname.startsWith("/dashbord/settings"),
      show: canAccess("settings.view"),
    },
  ];

  const visibleNavItems = allNavItems.filter((item) => item.show);

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case "owner":
        return <Shield className="h-4 w-4 text-emerald-700" />;
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-purple-700" />;
      case "fleet_manager":
        return <UserCheck className="h-4 w-4 text-blue-700" />;
      case "dispatcher":
        return <Radio className="h-4 w-4 text-teal-700" />;
      case "driver":
        return <Car className="h-4 w-4 text-slate-700" />;
      default:
        return <Shield className="h-4 w-4 text-emerald-700" />;
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-white shadow-xl lg:shadow-xs">
      {/* Brand & Mobile Close */}
      <div className="flex h-20 items-center justify-between border-b border-border px-6">
        <Link
          href="/dashbord"
          onClick={onCloseMobile}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-slate-900">
              Orbit Fleet
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Fleet Intelligence
            </p>
          </div>
        </Link>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex items-center justify-between mb-3 px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            {roleConfig.label}
          </span>
        </div>

        <nav className="space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                  item.active
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    item.active
                      ? "text-white"
                      : "text-slate-400 group-hover:text-primary"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher & Account Footer */}
      <div className="border-t border-border p-4 bg-slate-50/50 space-y-3">
        {/* Role Identity Card with Quick Role Selector */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                {getRoleIcon(role)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  Role: {roleConfig.label}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase border ${roleConfig.badgeStyles.bg} ${roleConfig.badgeStyles.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${roleConfig.badgeStyles.dot}`} />
              {role}
            </span>
          </div>

          <label className="block text-[10px] text-slate-400 font-semibold mb-1">
            Simulate Role View:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 focus:border-primary focus:outline-none"
          >
            {Object.values(OFFICIAL_ROLES).map((r) => (
              <option key={r.id} value={r.id}>
                {r.label} ({r.shortDescription})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 hover:border-rose-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
