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
} from "lucide-react";
import { logout } from "@/app/dashbord/database";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashbord",
      active: pathname === "/dashbord",
    },
    {
      label: "Vehicles",
      icon: Truck,
      href: "/dashbord/vehicles",
      active: pathname.startsWith("/dashbord/vehicles"),
    },
    {
      label: "Drivers",
      icon: Users,
      href: "/dashbord/drivers",
      active: pathname.startsWith("/dashbord/drivers"),
    },
    {
      label: "User Management",
      icon: ShieldCheck,
      href: "/dashbord/users",
      active: pathname.startsWith("/dashbord/users") || pathname.startsWith("/users"),
    },
    {
      label: "Devices",
      icon: Activity,
      href: "/dashbord/devices",
      active: pathname.startsWith("/dashbord/devices"),
    },
    {
      label: "Live Tracking",
      icon: Map,
      href: "/dashbord/tracking",
      active: pathname.startsWith("/dashbord/tracking"),
    },
    {
      label: "Settings & Users",
      icon: Settings,
      href: "/dashbord/settings",
      active: pathname.startsWith("/dashbord/settings"),
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface shadow-sm">
      {/* Brand */}
      <div className="flex h-20 items-center border-b border-border px-6">
        <Link
          href="/dashbord"
          onClick={onCloseMobile}
          className="flex items-center gap-3"
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
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
          Workspace
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                  item.active
                    ? "bg-primary text-white shadow-md shadow-primary/15"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    item.active
                      ? "text-white"
                      : "text-text-muted group-hover:text-primary"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account / Logout */}
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-background p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-text-primary">
              Orbit Admin
            </p>
            <p className="truncate text-[10px] text-text-muted">
              Fleet Operator
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-danger transition hover:bg-danger/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
