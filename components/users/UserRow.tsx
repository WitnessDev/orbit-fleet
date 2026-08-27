"use client";

import { Mail, Clock, Truck } from "lucide-react";
import type { User, VehicleOption } from "@/types/user";
import UserActions from "./UserActions";

interface UserRowProps {
  user: User;
  vehiclesMap: Record<string, VehicleOption>;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onAssignVehicles: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserRow({
  user,
  vehiclesMap,
  onView,
  onEdit,
  onChangeRole,
  onAssignVehicles,
  onToggleStatus,
  onDelete,
}: UserRowProps) {
  // Format initials
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Role Badge Styling
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return {
          label: "Admin",
          bg: "bg-purple-50 text-purple-700 border-purple-200/80",
          dot: "bg-purple-500",
        };
      case "owner":
        return {
          label: "Owner",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
          dot: "bg-emerald-600",
        };
      case "fleet_manager":
        return {
          label: "Fleet Manager",
          bg: "bg-blue-50 text-blue-700 border-blue-200/80",
          dot: "bg-blue-500",
        };
      case "driver":
        return {
          label: "Driver",
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          dot: "bg-slate-500",
        };
      case "viewer":
        return {
          label: "Viewer",
          bg: "bg-amber-50 text-amber-800 border-amber-200/80",
          dot: "bg-amber-500",
        };
      default:
        return {
          label: role.replace(/_/g, " "),
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  // Status Badge Styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
          dot: "bg-emerald-500",
        };
      case "inactive":
        return {
          label: "Inactive",
          bg: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-400",
        };
      case "pending":
        return {
          label: "Pending",
          bg: "bg-amber-50 text-amber-700 border-amber-200/80",
          dot: "bg-amber-500",
        };
      case "suspended":
        return {
          label: "Suspended",
          bg: "bg-rose-50 text-rose-700 border-rose-200/80",
          dot: "bg-rose-500",
        };
      default:
        return {
          label: status,
          bg: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  const roleInfo = getRoleBadge(user.role);
  const statusInfo = getStatusBadge(user.status);

  // Avatar background colors based on name hash
  const getAvatarBg = (name: string) => {
    const colors = [
      "bg-emerald-100 text-emerald-800 border-emerald-200",
      "bg-teal-100 text-teal-800 border-teal-200",
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-slate-100 text-slate-800 border-slate-200",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[hash % colors.length];
  };

  const avatarClasses = getAvatarBg(user.name);

  // Assigned vehicles preview
  const vehicleCount = user.vehicleIds ? user.vehicleIds.length : 0;
  const assignedVehicles = (user.vehicleIds || [])
    .map((vid) => vehiclesMap[vid])
    .filter(Boolean);

  return (
    <>
      {/* Desktop / Tablet Table Row */}
      <tr className="hidden md:table-row border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50/70 group">
        {/* User / Name */}
        <td className="py-4 pl-6 pr-4 align-middle">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${avatarClasses} shadow-xs`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onView(user)}
                className="font-bold text-slate-900 hover:text-emerald-700 transition text-sm truncate block text-left cursor-pointer"
              >
                {user.name}
              </button>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{user.department || "Operations"}</span>
                {user.phone && (
                  <>
                    <span>•</span>
                    <span className="truncate">{user.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Email */}
        <td className="py-4 px-4 align-middle text-xs text-slate-600">
          <div className="flex items-center gap-1.5 max-w-[200px] truncate" title={user.email}>
            <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{user.email}</span>
          </div>
        </td>

        {/* Role */}
        <td className="py-4 px-4 align-middle">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${roleInfo.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${roleInfo.dot}`} />
            {roleInfo.label}
          </span>
        </td>

        {/* Vehicles */}
        <td className="py-4 px-4 align-middle text-xs">
          {vehicleCount === 0 ? (
            <span className="text-slate-400 text-xs italic">No vehicles</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                <Truck className="h-3.5 w-3.5 text-slate-500" />
                <span>
                  {vehicleCount} {vehicleCount === 1 ? "vehicle" : "vehicles"}
                </span>
              </span>
              {assignedVehicles[0] && (
                <span
                  className="hidden xl:inline-block max-w-[120px] truncate text-[11px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200"
                  title={assignedVehicles.map((v) => `${v.registrationNumber} (${v.make})`).join(", ")}
                >
                  {assignedVehicles[0].registrationNumber}
                </span>
              )}
            </div>
          )}
        </td>

        {/* Status */}
        <td className="py-4 px-4 align-middle">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </span>
        </td>

        {/* Last Login */}
        <td className="py-4 px-4 align-middle text-xs text-slate-500 whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{user.lastLogin || "Never"}</span>
          </div>
        </td>

        {/* Actions */}
        <td className="py-4 pl-4 pr-6 align-middle text-right">
          <UserActions
            user={user}
            onView={onView}
            onEdit={onEdit}
            onChangeRole={onChangeRole}
            onAssignVehicles={onAssignVehicles}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        </td>
      </tr>

      {/* Mobile Card View (shown only on small screens) */}
      <div className="md:hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-200 hover:shadow-md hover:border-emerald-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${avatarClasses}`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm truncate">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>

          <UserActions
            user={user}
            onView={onView}
            onEdit={onEdit}
            onChangeRole={onChangeRole}
            onAssignVehicles={onAssignVehicles}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        </div>

        {/* Meta badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-3 pt-2 border-t border-slate-100">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleInfo.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${roleInfo.dot}`} />
            {roleInfo.label}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusInfo.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </span>

          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
            <Truck className="h-3 w-3 text-slate-400" />
            <span>{vehicleCount} {vehicleCount === 1 ? "vehicle" : "vehicles"}</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100/60">
          <span>{user.department || "Operations"}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {user.lastLogin || "Never"}
          </span>
        </div>
      </div>
    </>
  );
}
