"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  Users,
  Smartphone,
  Map,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/dashbord/database";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-emerald-600">
          Orbit Fleet
        </h1>
      </div>

      <nav className="space-y-2 p-4">
        <Link
          href="/dashbord"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-emerald-50"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          href="/dashbord/vehicles"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-emerald-50"
        >
          <Car size={20} />
          Vehicles
        </Link>

        <Link
          href="/dashbord/drivers"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-emerald-50"
        >
          <Users size={20} />
          Drivers
        </Link>

        <Link
          href="/dashbord/devices"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-emerald-50"
        >
          <Smartphone size={20} />
          Devices
        </Link>

        <Link
          href="/dashbord/tracking"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-emerald-50"
        >
          <Map size={20} />
          Live Map
        </Link>

        <Link
          href="/dashbord/settings"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-emerald-50"
        >
          <Settings size={20} />
          Settings
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}