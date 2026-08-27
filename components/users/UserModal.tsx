"use client";

import { useState } from "react";
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Truck,
  Search,
  Building2,
} from "lucide-react";
import type {
  User,
  UserRole,
  UserStatus,
  VehicleOption,
  RoleDefinition,
} from "@/types/user";
import RoleSelect from "./RoleSelect";
import type { UserFormData, ValidationErrors } from "@/lib/users/userValidation";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => Promise<boolean>;
  userToEdit?: User | null;
  vehicles: VehicleOption[];
  roles: RoleDefinition[];
}

function UserModalForm({
  onClose,
  onSave,
  userToEdit,
  vehicles,
  roles,
}: Omit<UserModalProps, "isOpen">) {
  const isEditing = Boolean(userToEdit);

  // Form states initialized directly from props
  const [name, setName] = useState(userToEdit?.name || "");
  const [email, setEmail] = useState(userToEdit?.email || "");
  const [phone, setPhone] = useState(userToEdit?.phone || "");
  const [role, setRole] = useState<UserRole>(userToEdit?.role || "fleet_manager");
  const [status, setStatus] = useState<UserStatus>(userToEdit?.status || "active");
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>(
    userToEdit?.vehicleIds || []
  );
  const [department, setDepartment] = useState(userToEdit?.department || "Operations");
  const [notes, setNotes] = useState(userToEdit?.notes || "");

  // Vehicle filter search
  const [vehicleSearch, setVehicleSearch] = useState("");

  // Submission / validation state
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Toggle vehicle selection
  const toggleVehicle = (vehicleId: string) => {
    setSelectedVehicleIds((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  // Select all or clear vehicles
  const handleSelectAllVehicles = () => {
    if (selectedVehicleIds.length === vehicles.length) {
      setSelectedVehicleIds([]);
    } else {
      setSelectedVehicleIds(vehicles.map((v) => v.id));
    }
  };

  // Filtered vehicle options
  const filteredVehicles = vehicles.filter((v) => {
    if (!vehicleSearch.trim()) return true;
    const q = vehicleSearch.toLowerCase().trim();
    return (
      v.registrationNumber.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side quick checks
    const newErrors: ValidationErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      setErrors({});

      const formData: UserFormData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role,
        status,
        vehicleIds: selectedVehicleIds,
        department: department.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save user.";
      setErrors({ general: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative z-10 my-8 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isEditing ? "Edit User" : "Add New User"}
          </h2>
          <p className="text-xs text-slate-500">
            {isEditing
              ? "Update user profile details and vehicle permissions."
              : "Create a new user account for Orbit Fleet."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-6 space-y-5"
      >
        {errors.general && (
          <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {errors.general}
          </div>
        )}

        {/* Section: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Account Credentials
          </h3>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Baraka Msuya"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2 text-sm text-slate-900 outline-none transition ${
                  errors.name
                    ? "border-rose-300 ring-2 ring-rose-500/10"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
            )}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="user@orbitfleet.co.tz"
                  className={`w-full rounded-xl border pl-10 pr-3.5 py-2 text-sm text-slate-900 outline-none transition ${
                    errors.email
                      ? "border-rose-300 ring-2 ring-rose-500/10"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+255 712 345 678"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Role & Status */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Access & Permissions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                User Role
              </label>
              <RoleSelect
                value={role}
                onChange={(newRole) => setRole(newRole)}
                roles={roles}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="w-full h-[42px] appearance-none rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 cursor-pointer"
              >
                <option value="active">Active (Full Access)</option>
                <option value="inactive">Inactive (Paused)</option>
                <option value="pending">Pending (Invited)</option>
                <option value="suspended">Suspended (Blocked)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Department / Team
            </label>
            <div className="relative flex items-center">
              <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Operations & Dispatch"
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
          </div>
        </div>

        {/* Section: Vehicle Assignment Multi-Select */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Vehicle Access Assignment
              </h3>
              <p className="text-[11px] text-slate-400">
                Select vehicles this user is authorized to monitor or drive.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                <Truck className="h-3 w-3 text-emerald-600" />
                <span>{selectedVehicleIds.length} assigned</span>
              </span>
              <button
                type="button"
                onClick={handleSelectAllVehicles}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline transition cursor-pointer"
              >
                {selectedVehicleIds.length === vehicles.length ? "Clear" : "Select All"}
              </button>
            </div>
          </div>

          {/* Vehicle Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              placeholder="Search vehicles by plate or model..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-900 outline-none transition focus:bg-white focus:border-emerald-500"
            />
          </div>

          {/* Vehicles Checklist Box */}
          <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/30 p-2 space-y-1">
            {filteredVehicles.length === 0 ? (
              <p className="p-3 text-center text-xs text-slate-400">
                No vehicles found matching search.
              </p>
            ) : (
              filteredVehicles.map((vehicle) => {
                const isChecked = selectedVehicleIds.includes(vehicle.id);
                return (
                  <label
                    key={vehicle.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl p-2.5 transition-all text-xs ${
                      isChecked
                        ? "bg-emerald-50/90 border border-emerald-200 text-emerald-950 font-medium"
                        : "hover:bg-white border border-transparent text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleVehicle(vehicle.id)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <span className="font-mono font-bold text-slate-900 mr-2">
                          {vehicle.registrationNumber}
                        </span>
                        <span className="text-slate-500">
                          — {vehicle.make} {vehicle.model} ({vehicle.type})
                        </span>
                      </div>
                    </div>

                    <span className="rounded bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500 border border-slate-200/60 shrink-0">
                      {vehicle.status}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Section: Notes */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            Administrative Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Primary Dar es Salaam route supervisor. Driving license verified."
            rows={2}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 active:scale-[0.98] transition disabled:opacity-50 cursor-pointer"
          >
            {saving
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function UserModal(props: UserModalProps) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={props.onClose}
      />
      <UserModalForm
        key={`${props.userToEdit?.id || "new"}-${props.isOpen}`}
        onClose={props.onClose}
        onSave={props.onSave}
        userToEdit={props.userToEdit}
        vehicles={props.vehicles}
        roles={props.roles}
      />
    </div>
  );
}
