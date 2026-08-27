"use client";

import { Bell, UserCircle, Menu } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface NavbarProps {
  title?: string;
  onOpenMobileSidebar?: () => void;
}

export default function Navbar({
  title = "Dashboard",
  onOpenMobileSidebar,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-xl p-2 text-text-secondary hover:bg-surface lg:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Fleet Intelligence
          </p>
          <h1 className="font-display text-lg font-bold text-text-primary">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge status="online">System Live</Badge>

        <button
          type="button"
          className="relative rounded-xl border border-border bg-surface p-2.5 text-text-secondary transition hover:text-text-primary"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <div className="hidden items-center gap-2.5 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserCircle className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-text-primary">Fleet Manager</p>
            <p className="text-[10px] text-text-muted">Operations Dispatch</p>
          </div>
        </div>
      </div>
    </header>
  );
}
