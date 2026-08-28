"use client";

import { useState } from "react";
import { X, ShieldCheck, Plus, Lock } from "lucide-react";
import type { RoleDefinition, UserRole } from "@/types/user";
import { SYSTEM_PERMISSIONS } from "@/lib/users/userService";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRole: (role: RoleDefinition) => Promise<void>;
  existingRoles: RoleDefinition[];
}

function RoleModalForm({
  onClose,
  onSaveRole,
  existingRoles,
}: Omit<RoleModalProps, "isOpen">) {
  const initialRole = existingRoles && existingRoles.length > 0 ? existingRoles[0] : null;

  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(initialRole);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [roleName, setRoleName] = useState(initialRole?.label || "");
  const [roleDescription, setRoleDescription] = useState(initialRole?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initialRole?.permissions || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = (role: RoleDefinition) => {
    setSelectedRole(role);
    setIsCreatingNew(false);
    setRoleName(role.label);
    setRoleDescription(role.description);
    setSelectedPermissions(role.permissions || []);
    setError(null);
  };

  const handleStartNewRole = () => {
    setIsCreatingNew(true);
    setSelectedRole(null);
    setRoleName("");
    setRoleDescription("");
    setSelectedPermissions(["perm_view_vehicles", "perm_view_live_location"]);
    setError(null);
  };

  const togglePermission = (permId: string) => {
    if (selectedRole?.id === "admin") return;

    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setError("Role name is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const roleId = isCreatingNew
        ? roleName.toLowerCase().replace(/[^a-z0-9]/g, "_")
        : selectedRole?.id || roleName.toLowerCase().replace(/[^a-z0-9]/g, "_");

      const roleToSave: RoleDefinition = {
        id: roleId as UserRole,
        name: roleId as UserRole,
        label: roleName.trim(),
        description: roleDescription.trim() || `${roleName.trim()} role permissions`,
        isCustom: isCreatingNew ? true : selectedRole?.isCustom,
        colorVariant: isCreatingNew ? "blue" : selectedRole?.colorVariant || "emerald",
        permissions: selectedPermissions,
      };

      await onSaveRole(roleToSave);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save role.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by category
  const categories = Array.from(new Set(SYSTEM_PERMISSIONS.map((p) => p.category)));

  return (
    <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Roles & Permission Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Configure role capabilities and access control for Orbit Fleet.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content: 2-Column Layout */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Role list */}
        <div className="w-full md:w-64 border-r border-slate-100 bg-slate-50/70 p-4 overflow-y-auto">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              System Roles
            </span>
            <button
              type="button"
              onClick={handleStartNewRole}
              className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              <span>New</span>
            </button>
          </div>

          <div className="space-y-1">
            {existingRoles.map((role) => {
              const isActive = !isCreatingNew && selectedRole?.id === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={`flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-white shadow-sm border border-slate-200 text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{role.label}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {role.permissions?.length || 0} permissions
                    </p>
                  </div>
                  {role.id === "admin" && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase">
                      Core
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Panel: Permission matrix form */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                disabled={selectedRole?.id === "admin"}
                placeholder="e.g. Regional Supervisor"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="Brief summary of duties"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {/* Permission Checkboxes Grouped by Category */}
          <div className="flex-1 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Granular Permissions ({selectedPermissions.length} selected)
              </span>
              {selectedRole?.id === "admin" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Lock className="h-3 w-3" /> Core Admin role retains all permissions
                </span>
              )}
            </div>

            {categories.map((cat) => {
              const permsInCat = SYSTEM_PERMISSIONS.filter((p) => p.category === cat);
              return (
                <div key={cat} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                    {cat}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {permsInCat.map((perm) => {
                      const isChecked = selectedPermissions.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                            isChecked
                              ? "border-emerald-200 bg-emerald-50/60 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          } ${selectedRole?.id === "admin" ? "opacity-90 cursor-default" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={selectedRole?.id === "admin"}
                            onChange={() => togglePermission(perm.id)}
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900">
                              {perm.label}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              {perm.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || (selectedRole?.id === "admin" && !isCreatingNew)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 active:scale-[0.98] transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : isCreatingNew ? "Create Role" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RoleModal(props: RoleModalProps) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={props.onClose}
      />
      <RoleModalForm
        key={`role-modal-${props.isOpen}`}
        onClose={props.onClose}
        onSaveRole={props.onSaveRole}
        existingRoles={props.existingRoles}
      />
    </div>
  );
}
