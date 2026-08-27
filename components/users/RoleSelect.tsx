"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Shield, ShieldCheck, UserCheck, Car, Eye } from "lucide-react";
import type { UserRole, RoleDefinition } from "@/types/user";

interface RoleSelectProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  roles?: RoleDefinition[];
  disabled?: boolean;
  error?: string;
  className?: string;
}

const DEFAULT_ROLE_OPTIONS = [
  {
    role: "admin" as UserRole,
    label: "Admin",
    description: "Full access to all system features, users, and billing.",
  },
  {
    role: "owner" as UserRole,
    label: "Owner",
    description: "Executive control over all company fleet assets and telemetry.",
  },
  {
    role: "fleet_manager" as UserRole,
    label: "Fleet Manager",
    description: "Manage vehicles, assign drivers, and monitor dispatch routes.",
  },
  {
    role: "driver" as UserRole,
    label: "Driver",
    description: "Assigned vehicle trips, navigation, and live route status.",
  },
  {
    role: "viewer" as UserRole,
    label: "Viewer",
    description: "Read-only access to view active fleet tracking and reports.",
  },
];

export default function RoleSelect({
  value,
  onChange,
  roles,
  disabled = false,
  error,
  className = "",
}: RoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format label and info for current selection
  const currentRole = roles?.find((r) => r.id === value) ||
    DEFAULT_ROLE_OPTIONS.find((r) => r.role === value) || {
      label: value ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Select Role",
      description: "Custom role permissions",
    };

  const roleList = roles && roles.length > 0
    ? roles.map((r) => ({
        role: r.id as UserRole,
        label: r.label,
        description: r.description,
      }))
    : DEFAULT_ROLE_OPTIONS;

  const renderIcon = (roleId: string, classNameStr: string) => {
    switch (roleId) {
      case "admin":
        return <ShieldCheck className={classNameStr} />;
      case "owner":
        return <Shield className={classNameStr} />;
      case "fleet_manager":
        return <UserCheck className={classNameStr} />;
      case "driver":
        return <Car className={classNameStr} />;
      case "viewer":
        return <Eye className={classNameStr} />;
      default:
        return <Shield className={classNameStr} />;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition-all duration-200 outline-none ${
          disabled
            ? "cursor-not-allowed bg-slate-100/70 opacity-60 border-slate-200 text-slate-400"
            : error
            ? "border-rose-300 ring-2 ring-rose-500/10 focus:border-rose-500"
            : isOpen
            ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm"
            : "border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            {renderIcon(value, "h-4 w-4")}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 leading-tight">
              {currentRole.label}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {currentRole.description}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
        />
      </button>

      {error && (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-64 overflow-y-auto space-y-1">
            {roleList.map((item) => {
              const isSelected = value === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => {
                    onChange(item.role);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-start gap-3 rounded-xl p-2.5 text-left text-xs transition-colors duration-150 ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-900 font-medium"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {renderIcon(item.role, "h-3.5 w-3.5")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">
                        {item.label}
                      </p>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
