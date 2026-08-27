"use client";

import {
  Users,
  SearchX,
  AlertTriangle,
  Plus,
  RotateCcw,
} from "lucide-react";
import type { User, VehicleOption } from "@/types/user";
import UserRow from "./UserRow";

interface UserTableProps {
  users: User[];
  vehicles: VehicleOption[];
  loading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onAddUser: () => void;
  onResetFilters: () => void;
  onRetry: () => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onAssignVehicles: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({
  users,
  vehicles,
  loading,
  error,
  hasActiveFilters,
  onAddUser,
  onResetFilters,
  onRetry,
  onView,
  onEdit,
  onChangeRole,
  onAssignVehicles,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  // Map vehicles by ID for fast lookup
  const vehiclesMap = vehicles.reduce<Record<string, VehicleOption>>(
    (acc, v) => {
      acc[v.id] = v;
      return acc;
    },
    {}
  );

  /* =========================================================
     1. LOADING STATE (SKELETON)
     ========================================================= */
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        {/* Desktop Skeleton Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 pl-6 pr-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Vehicles</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 rounded bg-slate-200" />
                        <div className="h-2.5 w-16 rounded bg-slate-100" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-3 w-32 rounded bg-slate-100" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-20 rounded-full bg-slate-100" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-24 rounded-lg bg-slate-100" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-16 rounded-full bg-slate-100" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-3 w-20 rounded bg-slate-100" />
                  </td>
                  <td className="py-4 pl-4 pr-6 text-right">
                    <div className="ml-auto h-7 w-7 rounded bg-slate-100" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Skeleton Cards */}
        <div className="md:hidden p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div className="space-y-1 flex-1">
                  <div className="h-3.5 w-32 rounded bg-slate-200" />
                  <div className="h-2.5 w-20 rounded bg-slate-100" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-4 w-16 rounded-full bg-slate-100" />
                <div className="h-4 w-16 rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     2. ERROR STATE
     ========================================================= */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/40 p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-3 shadow-xs">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Failed to load users
        </h3>
        <p className="mt-1 max-w-md text-xs text-slate-600 leading-relaxed">
          {error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  /* =========================================================
     3. EMPTY SEARCH RESULTS STATE
     ========================================================= */
  if (users.length === 0 && hasActiveFilters) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          No users match your filters
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
          Try clearing search keywords or switching role and status filters to
          locate accounts.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>Clear All Filters</span>
        </button>
      </div>
    );
  }

  /* =========================================================
     4. NO USERS AT ALL (EMPTY STATE)
     ========================================================= */
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/20 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-3 shadow-xs">
          <Users className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No users yet</h3>
        <p className="mt-1 max-w-md text-xs text-slate-500 leading-relaxed">
          Add administrators, fleet managers, drivers, and viewers to coordinate
          vehicle tracking and security across Orbit Fleet.
        </p>
        <button
          type="button"
          onClick={onAddUser}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition active:scale-[0.98] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add First User</span>
        </button>
      </div>
    );
  }

  /* =========================================================
     5. POPULATED TABLE
     ========================================================= */
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <th className="py-3.5 pl-6 pr-4">User</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Vehicles</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Last Login</th>
              <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                vehiclesMap={vehiclesMap}
                onView={onView}
                onEdit={onEdit}
                onChangeRole={onChangeRole}
                onAssignVehicles={onAssignVehicles}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden p-3.5 space-y-3 bg-slate-50/40">
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            vehiclesMap={vehiclesMap}
            onView={onView}
            onEdit={onEdit}
            onChangeRole={onChangeRole}
            onAssignVehicles={onAssignVehicles}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
