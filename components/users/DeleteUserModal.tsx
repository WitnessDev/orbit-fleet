"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import type { User } from "@/types/user";

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirmDelete: (userId: string) => Promise<void>;
}

export default function DeleteUserModal({
  isOpen,
  user,
  onClose,
  onConfirmDelete,
}: DeleteUserModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onConfirmDelete(user.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <Trash2 className="h-6 w-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-slate-900">Delete User?</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-slate-900">{user.name}</span> (
            <span className="text-slate-700">{user.email}</span>)?
          </p>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-200">
            <span className="font-semibold text-slate-700">Notice:</span> This
            will revoke all vehicle tracking access, telemetry permissions, and
            login credentials. This action cannot be undone.
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={deleting}
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-[0.98] transition disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{deleting ? "Deleting..." : "Delete User"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
