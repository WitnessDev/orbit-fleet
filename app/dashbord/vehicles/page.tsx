"use client";

import { useEffect, useState } from "react";
import {
  Car,
  MoreHorizontal,
  Plus,
  Search,
  Truck,
  UserRound,
  X,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  Cpu,
  MapPin,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import {
  addVehicle,
  getVehicles,
  subscribeVehicles,
  updateVehicle,
  deleteVehicle,
  getDrivers,
  getDevices,
  type Vehicle,
  type VehicleStatus,
  type Driver,
  type GPSDevice,
} from "@/app/dashbord/database";

interface VehicleFormData {
  registrationNumber: string;
  make: string;
  model: string;
  year: string;
  color: string;
  type: string;
  status: VehicleStatus;
  driverId: string;
  deviceId: string;
  location: string;
}

const emptyForm: VehicleFormData = {
  registrationNumber: "",
  make: "",
  model: "",
  year: new Date().getFullYear().toString(),
  color: "White",
  type: "Delivery Van",
  status: "offline",
  driverId: "",
  deviceId: "",
  location: "Central Depot",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [devices, setDevices] = useState<GPSDevice[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirmVehicle, setDeleteConfirmVehicle] = useState<Vehicle | null>(null);

  const [form, setForm] = useState<VehicleFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let isMounted = true;
    Promise.all([getDrivers(), getDevices()])
      .then(([dList, devList]) => {
        if (isMounted) {
          setDrivers(dList);
          setDevices(devList);
        }
      })
      .catch((err) => {
        console.error("Failed to load drivers/devices:", err);
      });

    // Real-time listener
    const unsubscribe = subscribeVehicles(
      (list) => {
        if (isMounted) {
          setVehicles(list);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Firestore real-time subscription error:", error);
        // Fallback fetch
        getVehicles().then((list) => {
          if (isMounted) {
            setVehicles(list);
            setLoading(false);
          }
        });
      }
    );

    return () => {
      isMounted = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const totalVehicles = vehicles.length;
  const onlineVehicles = vehicles.filter((v) => v.status === "online").length;
  const idleVehicles = vehicles.filter((v) => v.status === "idle").length;
  const offlineVehicles = vehicles.filter((v) => v.status === "offline").length;

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      registrationNumber: vehicle.registrationNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year?.toString() || "",
      color: vehicle.color || "White",
      type: vehicle.type || "Delivery Van",
      status: vehicle.status,
      driverId: vehicle.driverId || "",
      deviceId: vehicle.deviceId || "",
      location: vehicle.location || "Central Depot",
    });
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.registrationNumber || !form.make || !form.model) {
      alert("Please fill in Registration Number, Make, and Model.");
      return;
    }

    try {
      setSubmitting(true);

      const assignedDriver = drivers.find((d) => d.id === form.driverId);
      const assignedDevice = devices.find((dev) => dev.id === form.deviceId);

      if (editingVehicle) {
        // Update
        await updateVehicle(editingVehicle.id, {
          registrationNumber: form.registrationNumber.trim().toUpperCase(),
          make: form.make.trim(),
          model: form.model.trim(),
          year: form.year ? Number(form.year) : undefined,
          color: form.color.trim(),
          type: form.type.trim(),
          status: form.status,
          driverId: form.driverId || null,
          driverName: assignedDriver ? assignedDriver.name : null,
          deviceId: form.deviceId || null,
          deviceSerial: assignedDevice ? assignedDevice.deviceId : null,
          location: form.location.trim(),
        });
        setFeedback(`Vehicle ${form.registrationNumber} updated successfully.`);
        setEditingVehicle(null);
      } else {
        // Create
        await addVehicle({
          registrationNumber: form.registrationNumber.trim().toUpperCase(),
          make: form.make.trim(),
          model: form.model.trim(),
          year: form.year ? Number(form.year) : undefined,
          color: form.color.trim(),
          type: form.type.trim(),
          status: form.status,
          driverId: form.driverId || null,
          driverName: assignedDriver ? assignedDriver.name : null,
          deviceId: form.deviceId || null,
          deviceSerial: assignedDevice ? assignedDevice.deviceId : null,
          location: form.location.trim(),
        });
        setFeedback(`Vehicle ${form.registrationNumber} added to fleet.`);
        setShowAddModal(false);
      }

      setForm(emptyForm);
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      console.error("Error saving vehicle:", err);
      alert("Failed to save vehicle. Please check network/Firestore.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmVehicle) return;
    try {
      setSubmitting(true);
      await deleteVehicle(deleteConfirmVehicle.id);
      setFeedback(`Vehicle ${deleteConfirmVehicle.registrationNumber} removed.`);
      setDeleteConfirmVehicle(null);
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("Failed to delete vehicle.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const q = search.toLowerCase();
    const matchesSearch =
      v.registrationNumber?.toLowerCase().includes(q) ||
      v.make?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      v.driverName?.toLowerCase().includes(q) ||
      v.location?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout title="Vehicles Management">
      {/* Top action header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-text-primary">
              Fleet Vehicles (Day 7)
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Register, edit, assign drivers, and monitor fleet vehicle status in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={openAddModal}>
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800 border border-emerald-200">
          <Check className="h-5 w-5 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* Statistics */}
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
          detail="Active telemetry signal"
          status="success"
        />
        <StatCard
          label="Idle"
          value={idleVehicles.toString()}
          detail="Stationary / Ignition off"
          status="warning"
        />
        <StatCard
          label="Offline"
          value={offlineVehicles.toString()}
          detail="Disconnected / In storage"
          status="danger"
        />
      </div>

      {/* Vehicles Table Card */}
      <Card className="overflow-hidden">
        {/* Search & Filter bar */}
        <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-text-primary">
              Registered Fleet
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              {vehicles.length === 0
                ? "No vehicles registered yet in Firestore."
                : `${vehicles.length} total vehicle${vehicles.length === 1 ? "" : "s"} in database.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex rounded-lg border border-border bg-background p-1 text-xs font-semibold">
              {(["all", "online", "idle", "offline"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-md px-3 py-1.5 capitalize transition ${
                    statusFilter === st
                      ? "bg-surface text-primary shadow-sm font-bold"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search registration, make, driver..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center p-8 text-sm text-text-muted">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin text-primary" />
            Loading vehicles from Firestore...
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold text-text-primary">
              No vehicles found
            </h3>
            <p className="mt-2 max-w-md text-sm text-text-muted">
              {search || statusFilter !== "all"
                ? "No vehicle matched your current filter criteria."
                : "Your fleet is currently empty. Add your first vehicle to start tracking."}
            </p>
            <Button className="mt-6" onClick={openAddModal}>
              <Plus className="h-4 w-4" />
              Add Your First Vehicle
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Vehicle
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Assigned Driver
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    GPS Device
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Location
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="transition hover:bg-surface-hover/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Car className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            {v.registrationNumber}
                          </p>
                          <p className="text-xs text-text-muted">
                            {v.make} {v.model} {v.year ? `(${v.year})` : ""} • {v.color || "White"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {v.driverName ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <UserRound className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-text-primary">
                            {v.driverName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted italic">Unassigned</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {v.deviceSerial || v.deviceId ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-medium text-slate-700">
                          <Cpu className="h-3 w-3 text-emerald-600" />
                          {v.deviceSerial || v.deviceId?.slice(0, 8)}
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted italic">No GPS</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <MapPin className="h-3.5 w-3.5 text-text-muted" />
                        {v.location || "Central Garage"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <Badge status={v.status}>{v.status}</Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewVehicle(v)}
                          className="rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-text-primary transition"
                          title="View Details"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(v)}
                          className="rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-primary transition"
                          title="Edit Vehicle"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmVehicle(v)}
                          className="rounded-lg p-2 text-text-muted hover:bg-danger/10 hover:text-danger transition"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* =======================================================
          ADD / EDIT VEHICLE MODAL
      ======================================================== */}
      {(showAddModal || editingVehicle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-text-primary">
                    {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                  </h2>
                  <p className="text-xs text-text-muted">
                    Save vehicle parameters, assigned driver, and GPS tracker directly to Firestore.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingVehicle(null);
                }}
                className="rounded-lg p-2 text-text-muted hover:bg-surface-hover"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                    placeholder="e.g. T 452 DRZ"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary uppercase"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Vehicle Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="Delivery Van">Delivery Van</option>
                    <option value="Heavy Truck">Heavy Truck</option>
                    <option value="Pickup 4x4">Pickup 4x4</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Make *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.make}
                    onChange={(e) => handleInputChange("make", e.target.value)}
                    placeholder="e.g. Toyota"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="e.g. Hilux Double Cabin"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Manufacturing Year
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max="2030"
                    value={form.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    placeholder="2024"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Color
                  </label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="e.g. Silver White"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Assign Driver (Day 8 Relational link)
                  </label>
                  <select
                    value={form.driverId}
                    onChange={(e) => handleInputChange("driverId", e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="">-- No Driver Assigned --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.licenseNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Assign GPS Device (Day 9 Device link)
                  </label>
                  <select
                    value={form.deviceId}
                    onChange={(e) => handleInputChange("deviceId", e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="">-- No GPS Tracker Assigned --</option>
                    {devices.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.deviceId} • {dev.model} ({dev.imei})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleInputChange("status", e.target.value as VehicleStatus)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="online">Online (Active on Road)</option>
                    <option value="idle">Idle (Stationary)</option>
                    <option value="offline">Offline (Parked/Depot)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Current Base / Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g. Dar Port Terminal 2"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingVehicle(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingVehicle ? "Save Changes" : "Create Vehicle"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================
          VIEW VEHICLE DETAILS MODAL
      ======================================================== */}
      {viewVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text-primary">
                    {viewVehicle.registrationNumber}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {viewVehicle.make} {viewVehicle.model} {viewVehicle.year ? `(${viewVehicle.year})` : ""}
                  </p>
                </div>
              </div>
              <Badge status={viewVehicle.status}>{viewVehicle.status}</Badge>
            </div>

            <div className="my-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-background p-3">
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Driver</p>
                <p className="mt-1 font-bold text-text-primary">{viewVehicle.driverName || "Not assigned"}</p>
              </div>
              <div className="rounded-xl bg-background p-3">
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">GPS Device</p>
                <p className="mt-1 font-bold text-text-primary">{viewVehicle.deviceSerial || "Not connected"}</p>
              </div>
              <div className="rounded-xl bg-background p-3">
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Location</p>
                <p className="mt-1 font-bold text-text-primary">{viewVehicle.location || "Central Garage"}</p>
              </div>
              <div className="rounded-xl bg-background p-3">
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Color & Type</p>
                <p className="mt-1 font-bold text-text-primary">{viewVehicle.color || "White"} • {viewVehicle.type || "Vehicle"}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="secondary" onClick={() => setViewVehicle(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  const target = viewVehicle;
                  setViewVehicle(null);
                  openEditModal(target);
                }}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit Vehicle
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          DELETE CONFIRM MODAL
      ======================================================== */}
      {deleteConfirmVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-border text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-bold text-text-primary">
              Delete Vehicle?
            </h3>
            <p className="mt-2 text-xs text-text-muted">
              Are you sure you want to remove <strong>{deleteConfirmVehicle.registrationNumber}</strong> from the fleet database?
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirmVehicle(null)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={submitting}>
                {submitting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
