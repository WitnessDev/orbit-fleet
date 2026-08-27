"use client";

import {
  X,
  Mail,
  Phone,
  Truck,
  Building2,
  Edit2,
  FileText,
} from "lucide-react";
import type { User, VehicleOption, RoleDefinition } from "@/types/user";

interface UserDetailsModalProps {
  isOpen: boolean;
  user: User | null;
  vehicles: VehicleOption[];
  roles: RoleDefinition[];
  onClose: () => void;
  onEdit: (user: User) => void;
}

export default function UserDetailsModal({
  isOpen,
  user,
  vehicles,
  roles,
  onClose,
  onEdit,
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  const roleDef = roles.find((r) => r.id === user.role);

  const assignedVehicles = (user.vehicleIds || [])
    .map((id) => vehicles.find((v) => v.id === id))
    .filter(Boolean) as VehicleOption[];

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 my-8 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Emerald Gradient Banner */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 px-6 py-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white font-bold text-lg border border-white/30 shadow-inner">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-100 border border-white/30">
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                {user.email} • {user.department || "Operations"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                System Role
              </p>
              <p className="mt-1 text-xs font-bold text-slate-900 capitalize">
                {roleDef?.label || user.role.replace(/_/g, " ")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Vehicles Access
              </p>
              <p className="mt-1 text-xs font-bold text-emerald-700">
                {user.vehicleIds?.length || 0} assigned
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Last Activity
              </p>
              <p className="mt-1 text-xs font-bold text-slate-900">
                {user.lastLogin || "Never"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Joined Date
              </p>
              <p className="mt-1 text-xs font-bold text-slate-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active"}
              </p>
            </div>
          </div>

          {/* Contact & Organization Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Overview
            </h3>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-500">
                  <Mail className="h-4 w-4 text-slate-400" /> Email Address
                </span>
                <span className="font-semibold text-slate-900">{user.email}</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-500">
                  <Phone className="h-4 w-4 text-slate-400" /> Phone Number
                </span>
                <span className="font-semibold text-slate-900">
                  {user.phone || "Not configured"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-500">
                  <Building2 className="h-4 w-4 text-slate-400" /> Department
                </span>
                <span className="font-semibold text-slate-900">
                  {user.department || "General Operations"}
                </span>
              </div>

              {user.notes && (
                <div className="pt-1 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" /> Administrative Notes
                  </span>
                  <p className="rounded-xl bg-slate-50 p-2.5 text-slate-600 text-xs italic">
                    {user.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Vehicles List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned Vehicles ({assignedVehicles.length})
              </h3>
            </div>

            {assignedVehicles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                No vehicles currently assigned to this user.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {assignedVehicles.map((veh) => (
                  <div
                    key={veh.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-mono font-bold text-slate-900">
                          {veh.registrationNumber}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {veh.make} {veh.model}
                        </p>
                      </div>
                    </div>
                    <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-600 border border-slate-200">
                      {veh.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(user);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
