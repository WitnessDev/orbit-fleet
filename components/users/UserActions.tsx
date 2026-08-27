"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  ShieldCheck,
  Truck,
  UserX,
  UserCheck,
  Trash2,
} from "lucide-react";
import type { User } from "@/types/user";

interface UserActionsProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onAssignVehicles: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserActions({
  user,
  onView,
  onEdit,
  onChangeRole,
  onAssignVehicles,
  onToggleStatus,
  onDelete,
}: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isActive = user.status === "active";

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-400 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
        aria-label={`Actions for ${user.name}`}
        aria-expanded={isOpen}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 origin-top-right rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
            <p className="text-[11px] font-bold text-slate-800 truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user.email}
            </p>
          </div>

          <div className="space-y-0.5">
            {/* View Details */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onView(user);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition text-left cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-emerald-600" />
              <span>View Details</span>
            </button>

            {/* Edit User */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onEdit(user);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Edit Profile</span>
            </button>

            {/* Change Role */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onChangeRole(user);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
              <span>Change Role</span>
            </button>

            {/* Assign Vehicles */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onAssignVehicles(user);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
            >
              <Truck className="h-3.5 w-3.5 text-blue-500" />
              <span>Assign Vehicles</span>
            </button>

            {/* Deactivate / Activate */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onToggleStatus(user);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
            >
              {isActive ? (
                <>
                  <UserX className="h-3.5 w-3.5 text-amber-500" />
                  <span>Deactivate User</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Activate User</span>
                </>
              )}
            </button>
          </div>

          <div className="my-1 border-t border-slate-100" />

          {/* Delete */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete(user);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            <span>Delete User</span>
          </button>
        </div>
      )}
    </div>
  );
}
