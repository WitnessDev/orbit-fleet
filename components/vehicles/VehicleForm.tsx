"use client";

import { useState } from "react";
import { createVehicle, type VehicleStatus } from "@/lib/firestore";

interface VehicleFormProps {
  onCreated?: () => void;
}

export default function VehicleForm({
  onCreated,
}: VehicleFormProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<{
    registrationNumber: string;
    make: string;
    model: string;
    year: string;
    color: string;
    status: VehicleStatus;
  }>({
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    color: "",
    status: "active",
  });

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !form.registrationNumber ||
      !form.make ||
      !form.model
    ) {
      alert(
        "Please fill in registration number, make and model."
      );
      return;
    }

    try {
      setLoading(true);

      await createVehicle({
        registrationNumber:
          form.registrationNumber.trim().toUpperCase(),

        make: form.make.trim(),

        model: form.model.trim(),

        year: form.year
          ? Number(form.year)
          : null,

        color: form.color.trim(),

        status: form.status as VehicleStatus,

        driverId: null,

        deviceId: null,

        latitude: null,

        longitude: null,
      });

      setForm({
        registrationNumber: "",
        make: "",
        model: "",
        year: "",
        color: "",
        status: "active",
      });

      alert("Vehicle added successfully.");

      onCreated?.();
    } catch (error) {
      console.error(
        "Error creating vehicle:",
        error
      );

      alert(
        "Failed to add vehicle. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          Add Vehicle
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Register a vehicle into the Orbit Fleet system.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Registration */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Registration Number
          </label>

          <input
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={handleChange}
            placeholder="e.g. T 123 ABC"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Make */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Make
          </label>

          <input
            name="make"
            value={form.make}
            onChange={handleChange}
            placeholder="e.g. Toyota"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Model */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Model
          </label>

          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="e.g. Hilux"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Year */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Year
          </label>

          <input
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            placeholder="e.g. 2024"
            min="1900"
            max="2100"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Color */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Color
          </label>

          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            placeholder="e.g. White"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">
              Maintenance
            </option>
            <option value="suspended">
              Suspended
            </option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving Vehicle..."
            : "Add Vehicle"}
        </button>
      </div>
    </form>
  );
}