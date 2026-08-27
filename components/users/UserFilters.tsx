"use client";

import { RotateCcw } from "lucide-react";
import type { UserFilterState, RoleDefinition } from "@/types/user";

interface UserFiltersProps {
  filter: UserFilterState;
  onChange: (newFilter: Partial<UserFilterState>) => void;
  onReset: () => void;
  roles?: RoleDefinition[];
  className?: string;
}

export default function UserFilters({
  filter,
  onChange,
  onReset,
  roles = [],
  className = "",
}: UserFiltersProps) {
  const isFiltered =
    filter.role !== "all" || filter.status !== "all" || (filter.search && filter.search.trim().length > 0);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "suspended", label: "Suspended" },
  ];

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "owner", label: "Owner" },
    { value: "fleet_manager", label: "Fleet Manager" },
    { value: "driver", label: "Driver" },
    { value: "viewer", label: "Viewer" },
    ...roles
      .filter(
        (r) =>
          !["admin", "owner", "fleet_manager", "driver", "viewer"].includes(
            r.id
          )
      )
      .map((r) => ({ value: r.id, label: r.label })),
  ];

  return (
    <div
      className={`flex flex-wrap items-center gap-2.5 sm:gap-3 ${className}`}
    >
      {/* Role Filter Dropdown */}
      <div className="relative min-w-[140px] flex-1 sm:flex-initial">
        <select
          value={filter.role}
          onChange={(e) => onChange({ role: e.target.value })}
          className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 cursor-pointer"
          aria-label="Filter by role"
        >
          {roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
          ▼
        </span>
      </div>

      {/* Status Filter Dropdown */}
      <div className="relative min-w-[130px] flex-1 sm:flex-initial">
        <select
          value={filter.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 cursor-pointer"
          aria-label="Filter by status"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
          ▼
        </span>
      </div>

      {/* Reset Filters button */}
      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition active:scale-[0.98] cursor-pointer"
          title="Reset all filters"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
