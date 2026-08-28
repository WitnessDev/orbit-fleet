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
  User,
} from "lucide-react";
import { logout } from "@/app/dashbord/database";
import { useCurrentRole } from "@/lib/auth/useCurrentRole";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, roleConfig, canAccess } = useCurrentRole();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Determine user display name and email from Firestore profile / Auth
  const displayName =
    profile?.name ||
    user?.displayName ||
    (user?.email ? user.email.split("@")[0].replace(/[._-]/g, " ") : "Authenticated User");
  const displayEmail = profile?.email || user?.email || "";

  // Dynamic Navigation Items strictly governed by Firestore Role Permissions
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
        return <User className="h-4 w-4 text-slate-700" />;
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
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden cursor-pointer"
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
            Workspace Navigation
          </p>
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

      {/* Authenticated User Profile Footer (Display Only - No Role Switcher) */}
      <div className="border-t border-border p-4 bg-slate-50/50 space-y-3">
        {/* User Identity Card - Display Only */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
              {getRoleIcon(role)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate capitalize">
                {displayName}
              </p>
              {displayEmail && (
                <p className="text-[11px] font-mono text-slate-400 truncate">
                  {displayEmail}
                </p>
              )}
              {/* Display-only official role badge */}
              <div className="mt-1.5 flex items-center">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold border ${roleConfig.badgeStyles.bg} ${roleConfig.badgeStyles.border}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${roleConfig.badgeStyles.dot}`} />
                  {roleConfig.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Action */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50 hover:border-rose-200 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
