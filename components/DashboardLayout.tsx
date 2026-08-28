"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Lock, RefreshCw } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useCurrentRole } from "@/lib/auth/useCurrentRole";
import Button from "./ui/Button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  requiredPermission?: string;
}

// Route to permission requirements mapping
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/dashbord/users": ["users.view"],
  "/users": ["users.view"],
  "/dashbord/settings": ["settings.view"],
  "/dashbord/drivers": ["drivers.view"],
  "/dashbord/devices": ["devices.view"],
  "/dashbord/vehicles": ["vehicles.view", "vehicles.view_assigned"],
  "/dashbord/tracking": ["tracking.view", "tracking.view_assigned"],
};

export default function DashboardLayout({
  children,
  title = "Dashboard",
  requiredPermission,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const router = useRouter();
  const { roleConfig, canAccess, loading } = useCurrentRole();

  // 1. AUTO-CLOSE ON ANY ROUTE CHANGE DURING RENDER (No effect warning, immediate close)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }

  // 2. BODY SCROLL LOCKING ON MOBILE DRAWER
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  // 3. ESCAPE KEY LISTENER TO CLOSE MOBILE DRAWER
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Determine required permissions for current route
  const getRequiredPermissions = (): string[] => {
    if (requiredPermission) return [requiredPermission];

    for (const [routePrefix, permissions] of Object.entries(ROUTE_PERMISSIONS)) {
      if (pathname === routePrefix || pathname.startsWith(routePrefix + "/")) {
        return permissions;
      }
    }
    return [];
  };

  const neededPermissions = getRequiredPermissions();
  const isAuthorized =
    neededPermissions.length === 0 ||
    neededPermissions.some((perm) => canAccess(perm));

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setMobileOpen(false);
            }
          }}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden cursor-pointer"
        />
      )}

      {/* Sidebar Drawer Container (Desktop + Mobile) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0 pointer-events-auto"
            : "-translate-x-full pointer-events-none lg:pointer-events-auto"
        }`}
      >
        <Sidebar onCloseMobile={() => setMobileOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen w-full">
        <Navbar
          title={title}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-[1600px] w-full">
            {loading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                <RefreshCw className="h-7 w-7 animate-spin text-primary" />
                <p className="text-xs font-semibold text-slate-500">
                  Verifying permissions & loading workspace...
                </p>
              </div>
            ) : !isAuthorized ? (
              /* ============================================================
                 ACCESS DENIED / DIRECT URL PROTECTION (403 FORBIDDEN)
              ============================================================ */
              <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-200 shadow-sm mb-4">
                  <ShieldAlert className="h-8 w-8" />
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-800 border border-rose-200 mb-3">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Access Restricted (403 Forbidden)</span>
                </div>

                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Unauthorized Page Access
                </h2>

                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Your authenticated role does not have authorization to view or modify this resource ({pathname}).
                </p>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Your current role:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${roleConfig.badgeStyles.bg} ${roleConfig.badgeStyles.border}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${roleConfig.badgeStyles.dot}`} />
                    {roleConfig.label}
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={() => router.push("/dashbord")}
                    className="gap-2 px-5 py-2.5 text-xs"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Return to Dashboard</span>
                  </Button>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>

        <footer className="border-t border-border/50 py-6 text-center text-[10px] uppercase tracking-widest text-text-muted">
          Orbit Fleet • Fleet Intelligence Platform
        </footer>
      </div>
    </div>
  );
}
