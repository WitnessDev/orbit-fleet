"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative">
          <Bell size={21} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle size={30} />
          <span className="text-sm font-medium">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}