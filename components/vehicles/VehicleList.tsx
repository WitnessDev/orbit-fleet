"use client";

import { useEffect, useState } from "react";
import {
  Car,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { getVehicles } from "@/lib/firestore";
import VehicleStatusBadge from "@/components/ui/Badge";

interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year?: number | null;
  color?: string | null;
  status:
    | "active"
    | "inactive"
    | "maintenance"
    | "suspended";
}

interface VehicleListProps {
  refreshKey?: number;
}

export default function VehicleList({
  refreshKey,
}: VehicleListProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadVehicles() {
    try {
      setLoading(true);
      setError("");

      const data = await getVehicles();

      setVehicles(data as Vehicle[]);
    } catch (error) {
      console.error(
        "Failed to load vehicles:",
        error
      );

      setError(
        "Unable to load vehicles from Firestore."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      void loadVehicles();
    }, 0);

    return () => window.clearTimeout(refreshTimer);
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading vehicles...
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="font-bold text-slate-900">
            Fleet Vehicles
          </h2>

          <p className="text-sm text-slate-500">
            {vehicles.length} vehicle
            {vehicles.length !== 1 ? "s" : ""}
            registered
          </p>
        </div>

        <button
          type="button"
          onClick={loadVehicles}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          title="Refresh vehicles"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="m-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!error && vehicles.length === 0 && (
        <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <Car className="h-7 w-7 text-emerald-600" />
          </div>

          <h3 className="font-semibold text-slate-900">
            No vehicles yet
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add your first vehicle using the form above.
          </p>
        </div>
      )}

      {/* Desktop/table */}
      {vehicles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Vehicle
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Registration
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Year
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Color
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                        <Car className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {vehicle.make}{" "}
                          {vehicle.model}
                        </p>

                        <p className="text-xs text-slate-400">
                          ID: {vehicle.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    {vehicle.registrationNumber}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {vehicle.year || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {vehicle.color || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <VehicleStatusBadge status={vehicle.status}>
                      {vehicle.status}
                    </VehicleStatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}