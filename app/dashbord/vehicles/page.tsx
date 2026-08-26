"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Car,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Truck,
  UserRound,
  X,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";

interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: string;
  driver: string;
  location: string;
  status: "online" | "idle" | "offline";
}

interface VehicleForm {
  registration: string;
  make: string;
  model: string;
  year: string;
  driver: string;
  location: string;
  status: "online" | "idle" | "offline";
}

const emptyForm: VehicleForm = {
  registration: "",
  make: "",
  model: "",
  year: "",
  driver: "",
  location: "",
  status: "offline",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState<VehicleForm>(emptyForm);

  const totalVehicles = vehicles.length;

  const onlineVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "online"
  ).length;

  const idleVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "idle"
  ).length;

  const offlineVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "offline"
  ).length;

  const handleInputChange = (
    field: keyof VehicleForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleAddVehicle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newVehicle: Vehicle = {
      id: crypto.randomUUID(),
      registration: form.registration.trim(),
      make: form.make.trim(),
      model: form.model.trim(),
      year: form.year.trim(),
      driver: form.driver.trim(),
      location: form.location.trim(),
      status: form.status,
    };

    setVehicles((previous) => [...previous, newVehicle]);

    setForm(emptyForm);
    setShowAddForm(false);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* =====================================================
            TOP NAVIGATION
        ====================================================== */}

        <div className="mb-6 flex items-center justify-between gap-4">
          <a
            href="/dashbord"
            className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-text-secondary transition hover:bg-surface hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

            Back to Dashboard
          </a>

          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4" />

            Add Vehicle
          </Button>
        </div>

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Vehicles
              </h1>

              <p className="mt-1 text-sm text-text-secondary">
                Manage and monitor your fleet vehicles.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Vehicles"
            value={totalVehicles.toString()}
            detail="Vehicles currently registered"
            status="primary"
          />

          <StatCard
            label="Online"
            value={onlineVehicles.toString()}
            detail="Currently connected"
            status="success"
          />

          <StatCard
            label="Idle"
            value={idleVehicles.toString()}
            detail="Currently stationary"
            status="warning"
          />

          <StatCard
            label="Offline"
            value={offlineVehicles.toString()}
            detail="Currently disconnected"
            status="danger"
          />
        </div>

        {/* =====================================================
            ADD VEHICLE FORM
        ====================================================== */}

        {showAddForm && (
          <Card className="mb-6 overflow-hidden">

            {/* Form Header */}

            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="font-display text-lg font-semibold">
                  Add Vehicle
                </h2>

                <p className="mt-1 text-xs text-text-muted">
                  Enter the vehicle information below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-lg p-2 text-text-muted transition hover:bg-surface-hover hover:text-text-primary"
                aria-label="Close add vehicle form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleAddVehicle}
              className="p-5"
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {/* Registration */}

                <div>
                  <label
                    htmlFor="registration"
                    className="mb-2 block text-xs font-bold text-text-secondary"
                  >
                    Registration Number
                  </label>

                  <input
                    id="registration"
                    type="text"
                    value={form.registration}
                    onChange={(event) =>
                      handleInputChange(
                        "registration",
                        event.target.value
                      )
                    }
                    placeholder="Enter registration number"
                    required
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Make */}

                <div>
                  <label
                    htmlFor="make"
                    className="mb-2 block text-xs font-bold text-text-secondary"
                  >
                    Make
                  </label>

                  <input
                    id="make"
                    type="text"
                    value={form.make}
                    onChange={(event) =>
                      handleInputChange(
                        "make",
                        event.target.value
                      )
                    }
                    placeholder="Enter vehicle make"
                    required
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Model */}

                <div>
                  <label
                    htmlFor="model"
                    className="mb-2 block text-xs font-bold text-text-secondary"
                  >
                    Model
                  </label>

                  <input
                    id="model"
                    type="text"
                    value={form.model}
                    onChange={(event) =>
                      handleInputChange(
                        "model",
                        event.target.value
                      )
                    }
                    placeholder="Enter vehicle model"
                    required
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Year */}

                <div>
                  <label
                    htmlFor="year"
                    className="mb-2 block text-xs font-bold text-text-secondary"
                  >
                    Year
                  </label>

                  <input
                    id="year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.year}
                    onChange={(event) =>
                      handleInputChange(
                        "year",
                        event.target.value
                      )
                    }
                    placeholder="Enter vehicle year"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Driver */}

                <div>
                  <label
                    htmlFor="driver"
                    className="mb-2 block text-xs font-bold text-text-secondary"
                  >
                    Driver
                  </label>

                  <input
                    id="driver"
                    type="text"
                    value={form.driver}
                    onChange={(event) =>
                      handleInputChange(
                        "driver",
                        event.target.value
                      )
                    }
                    placeholder="Enter driver name"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Location */}

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-xs font-bold text-text-secondary"
                  >
                    Current Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={(event) =>
                      handleInputChange(
                        "location",
                        event.target.value
                      )
                    }
                    placeholder="Enter current location"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Status */}

                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-xs font-bold text-text-secondary"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    value={form.status}
                    onChange={(event) =>
                      handleInputChange(
                        "status",
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="offline">
                      Offline
                    </option>

                    <option value="idle">
                      Idle
                    </option>

                    <option value="online">
                      Online
                    </option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseForm}
                >
                  Cancel
                </Button>

                <Button type="submit">
                  <Plus className="h-4 w-4" />

                  Save Vehicle
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* =====================================================
            VEHICLES CARD
        ====================================================== */}

        <Card className="overflow-hidden">

          {/* Search / Filter */}

          <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">
                Fleet Vehicles
              </h2>

              <p className="mt-1 text-xs text-text-muted">
                {vehicles.length === 0
                  ? "No vehicles have been added yet."
                  : `${vehicles.length} vehicle${
                      vehicles.length === 1 ? "" : "s"
                    } in your fleet.`}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                <input
                  type="search"
                  placeholder="Search vehicles..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition placeholder:text-text-muted focus:border-primary sm:w-64"
                />
              </div>

              <Button variant="secondary">
                <Filter className="h-4 w-4" />

                Filter
              </Button>
            </div>
          </div>

          {/* =====================================================
              EMPTY STATE
          ====================================================== */}

          {vehicles.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Car className="h-8 w-8 text-primary" />
              </div>

              <h3 className="font-display text-lg font-semibold">
                No vehicles yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
                Your fleet is currently empty. Add your first vehicle
                to start managing your fleet.
              </p>

              <Button
                className="mt-6"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4" />

                Add Your First Vehicle
              </Button>
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================== */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-background/60">
                      <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Vehicle
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Driver
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Location
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {vehicles.map((vehicle) => (
                      <tr
                        key={vehicle.id}
                        className="transition hover:bg-background/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Car className="h-5 w-5 text-primary" />
                            </div>

                            <div>
                              <p className="text-sm font-bold">
                                {vehicle.registration}
                              </p>

                              <p className="mt-0.5 text-xs text-text-muted">
                                {vehicle.make} {vehicle.model}

                                {vehicle.year &&
                                  ` • ${vehicle.year}`}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {vehicle.driver ? (
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background">
                                <UserRound className="h-4 w-4 text-text-muted" />
                              </div>

                              <span className="text-sm text-text-secondary">
                                {vehicle.driver}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-text-muted">
                              Not assigned
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm text-text-secondary">
                            {vehicle.location || "Unavailable"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <Badge status={vehicle.status}>
                            {vehicle.status}
                          </Badge>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-text-muted transition hover:bg-surface-hover hover:text-text-primary"
                            aria-label={`Actions for ${vehicle.registration}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE CARDS
              ================================================== */}

              <div className="divide-y divide-border md:hidden">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Car className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                          <p className="text-sm font-bold">
                            {vehicle.registration}
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            {vehicle.make} {vehicle.model}
                          </p>
                        </div>
                      </div>

                      <Badge status={vehicle.status}>
                        {vehicle.status}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-background p-3">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                          Driver
                        </p>

                        <p className="mt-1 text-xs font-semibold">
                          {vehicle.driver || "Not assigned"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-background p-3">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                          Location
                        </p>

                        <p className="mt-1 text-xs font-semibold">
                          {vehicle.location || "Unavailable"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="mt-6 flex justify-center">
          <p className="text-[10px] text-text-muted">
            Orbit Fleet • Fleet Management
          </p>
        </div>
      </main>
    </div>
  );
}