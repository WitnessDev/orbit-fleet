"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Search,
  Check,
  RefreshCw,
  Phone,
  CreditCard,
  Truck,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import {
  addDriver,
  getDrivers,
  subscribeDrivers,
  updateDriver,
  deleteDriver,
  getVehicles,
  updateVehicle,
  type Driver,
  type DriverStatus,
  type Vehicle,
} from "@/app/dashbord/database";

interface DriverFormData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: DriverStatus;
  vehicleId: string;
  experienceYears: string;
  notes: string;
}

const emptyForm: DriverFormData = {
  name: "",
  email: "",
  phone: "",
  licenseNumber: "",
  status: "available",
  vehicleId: "",
  experienceYears: "3",
  notes: "",
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deleteConfirmDriver, setDeleteConfirmDriver] = useState<Driver | null>(null);

  const [form, setForm] = useState<DriverFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState("");

  const loadVehicles = async () => {
    try {
      const vList = await getVehicles();
      setVehicles(vList);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getVehicles()
      .then((vList) => {
        if (isMounted) setVehicles(vList);
      })
      .catch((err) => {
        console.error("Failed to load vehicles:", err);
      });

    const unsubscribe = subscribeDrivers(
      (list) => {
        if (isMounted) {
          setDrivers(list);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Drivers subscription error:", error);
        getDrivers().then((list) => {
          if (isMounted) {
            setDrivers(list);
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

  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter((d) => d.status === "available").length;
  const onTripDrivers = drivers.filter((d) => d.status === "on_trip").length;
  const offDutyDrivers = drivers.filter((d) => d.status === "off_duty").length;

  const handleInputChange = (field: keyof DriverFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setForm({
      name: driver.name,
      email: driver.email || "",
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      status: driver.status,
      vehicleId: driver.vehicleId || "",
      experienceYears: driver.experienceYears?.toString() || "3",
      notes: driver.notes || "",
    });
  };

  const handleSaveDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.licenseNumber.trim()) {
      alert("Please fill in Driver Name, Phone Number, and License Number.");
      return;
    }

    try {
      setSubmitting(true);
      const assignedVehicle = vehicles.find((v) => v.id === form.vehicleId);
      const vehicleRegistration = assignedVehicle ? assignedVehicle.registrationNumber : null;

      if (editingDriver) {
        // Update Driver
        await updateDriver(editingDriver.id, {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          licenseNumber: form.licenseNumber.trim().toUpperCase(),
          status: form.status,
          vehicleId: form.vehicleId || null,
          vehicleRegistration,
          experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
          notes: form.notes.trim(),
        });

        // Sync vehicle's driver info if assigned
        if (form.vehicleId) {
          await updateVehicle(form.vehicleId, {
            driverId: editingDriver.id,
            driverName: form.name.trim(),
          });
        }

        setFeedback(`Driver profile for ${form.name} updated.`);
        setEditingDriver(null);
      } else {
        // Create Driver
        const newDriver = await addDriver({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          licenseNumber: form.licenseNumber.trim().toUpperCase(),
          status: form.status,
          vehicleId: form.vehicleId || null,
          vehicleRegistration,
          experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
          notes: form.notes.trim(),
        });

        // Sync vehicle if assigned
        if (form.vehicleId && newDriver.id) {
          await updateVehicle(form.vehicleId, {
            driverId: newDriver.id,
            driverName: form.name.trim(),
          });
        }

        setFeedback(`Driver ${form.name} added successfully.`);
        setShowAddModal(false);
      }

      setForm(emptyForm);
      loadVehicles();
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      console.error("Failed to save driver:", err);
      alert("Failed to save driver profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmDriver) return;
    try {
      setSubmitting(true);
      await deleteDriver(deleteConfirmDriver.id);
      setFeedback(`Driver ${deleteConfirmDriver.name} deleted.`);
      setDeleteConfirmDriver(null);
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      console.error("Failed to delete driver:", err);
      alert("Failed to delete driver profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      d.name?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.phone?.toLowerCase().includes(q) ||
      d.licenseNumber?.toLowerCase().includes(q) ||
      d.vehicleRegistration?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout title="Drivers Management">
      {/* Top Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-text-primary">
              Fleet Drivers 
            </h1>

          </div>
        </div>

        <Button onClick={openAddModal}>
          <UserPlus className="h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800 border border-emerald-200">
          <Check className="h-5 w-5 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Drivers"
          value={totalDrivers.toString()}
          detail="Active driver records in fleet"
          status="primary"
        />
        <StatCard
          label="Available"
          value={availableDrivers.toString()}
          detail="Ready for vehicle dispatch"
          status="success"
        />
        <StatCard
          label="On Active Trip"
          value={onTripDrivers.toString()}
          detail="Currently navigating routes"
          status="primary"
        />
        <StatCard
          label="Off Duty / Standby"
          value={offDutyDrivers.toString()}
          detail="Scheduled rest or shift end"
          status="warning"
        />
      </div>

      {/* Drivers List Card */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-text-primary">
              Registered Drivers
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              {drivers.length === 0
                ? "No drivers registered in Firestore."
                : `${drivers.length} registered driver${drivers.length === 1 ? "" : "s"}.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-border bg-background p-1 text-xs font-semibold">
              {(["all", "available", "on_trip", "off_duty", "suspended"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-md px-3 py-1.5 capitalize transition ${
                    statusFilter === st
                      ? "bg-surface text-primary shadow-sm font-bold"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search driver, license, phone..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center p-8 text-sm text-text-muted">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin text-primary" />
            Loading drivers from Firestore...
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold text-text-primary">
              No drivers found
            </h3>
            <p className="mt-2 max-w-md text-sm text-text-muted">
              {search || statusFilter !== "all"
                ? "No driver matching your filter criteria."
                : "Your driver roster is currently empty. Register your first driver."}
            </p>
            <Button className="mt-6" onClick={openAddModal}>
              <UserPlus className="h-4 w-4" />
              Add Your First Driver
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Driver
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    License Number
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Contact Phone
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Assigned Vehicle
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
                {filteredDrivers.map((d) => (
                  <tr key={d.id} className="transition hover:bg-surface-hover/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                          {d.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            {d.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {d.email || "No email on record"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-semibold text-slate-800">
                        <CreditCard className="h-3 w-3 text-slate-500" />
                        {d.licenseNumber}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-text-muted" />
                        {d.phone}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {d.vehicleRegistration || d.vehicleId ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <Truck className="h-3.5 w-3.5" />
                          <span>{d.vehicleRegistration || "Assigned"}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted italic">No vehicle</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <Badge status={d.status}>
                        {d.status.replace("_", " ")}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(d)}
                          className="rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-primary transition"
                          title="Edit Driver Profile"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmDriver(d)}
                          className="rounded-lg p-2 text-text-muted hover:bg-danger/10 hover:text-danger transition"
                          title="Delete Driver"
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

      {/* Add / Edit Driver Modal */}
      {(showAddModal || editingDriver) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-text-primary">
                    {editingDriver ? "Edit Driver Profile" : "Register New Driver"}
                  </h2>
                  <p className="text-xs text-text-muted">
                    Save driver details, commercial license, and assign a fleet vehicle.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDriver(null);
                }}
                className="rounded-lg p-2 text-text-muted hover:bg-surface-hover"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDriver} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g. Juma Hamisi"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+255 712 345 678"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="juma@orbitfleet.com"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Driver License Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.licenseNumber}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                    placeholder="e.g. DL-TZ-99281"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary uppercase"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={form.experienceYears}
                    onChange={(e) => handleInputChange("experienceYears", e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Operational Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleInputChange("status", e.target.value as DriverStatus)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="available">Available (Ready)</option>
                    <option value="on_trip">On Trip (En Route)</option>
                    <option value="off_duty">Off Duty (Resting)</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Assign Fleet Vehicle 
                  </label>
                  <select
                    value={form.vehicleId}
                    onChange={(e) => handleInputChange("vehicleId", e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="">-- No Vehicle Assigned --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} — {v.make} {v.model} ({v.type || "Vehicle"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDriver(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingDriver ? "Save Changes" : "Register Driver"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-border text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-bold text-text-primary">
              Delete Driver?
            </h3>
            <p className="mt-2 text-xs text-text-muted">
              Are you sure you want to remove <strong>{deleteConfirmDriver.name}</strong> ({deleteConfirmDriver.licenseNumber}) from the driver roster?
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirmDriver(null)}
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
