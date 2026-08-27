"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Cpu,
  Plus,
  Search,
  Check,
  RefreshCw,
  Edit2,
  Trash2,
  X,
  Truck,
  Radio,
  BatteryCharging,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import {
  addDevice,
  getDevices,
  subscribeDevices,
  updateDevice,
  deleteDevice,
  getVehicles,
  updateVehicle,
  type GPSDevice,
  type DeviceStatus,
  type Vehicle,
} from "@/app/dashbord/database";

interface DeviceFormData {
  deviceId: string;
  imei: string;
  model: string;
  simNumber: string;
  status: DeviceStatus;
  vehicleId: string;
  batteryLevel: string;
}

const emptyForm: DeviceFormData = {
  deviceId: "",
  imei: "",
  model: "Teltonika FMB920",
  simNumber: "",
  status: "online",
  vehicleId: "",
  batteryLevel: "100",
};

export default function DevicesPage() {
  const [devices, setDevices] = useState<GPSDevice[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<GPSDevice | null>(null);
  const [deleteConfirmDevice, setDeleteConfirmDevice] = useState<GPSDevice | null>(null);

  const [form, setForm] = useState<DeviceFormData>(emptyForm);
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

    const unsubscribe = subscribeDevices(
      (list) => {
        if (isMounted) {
          setDevices(list);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Devices subscription error:", error);
        getDevices().then((list) => {
          if (isMounted) {
            setDevices(list);
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

  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === "online").length;
  const offlineDevices = devices.filter((d) => d.status === "offline").length;
  const assignedDevices = devices.filter((d) => Boolean(d.vehicleId)).length;

  const handleInputChange = (field: keyof DeviceFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (device: GPSDevice) => {
    setEditingDevice(device);
    setForm({
      deviceId: device.deviceId,
      imei: device.imei,
      model: device.model,
      simNumber: device.simNumber || "",
      status: device.status,
      vehicleId: device.vehicleId || "",
      batteryLevel: device.batteryLevel?.toString() || "100",
    });
  };

  const handleSaveDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.deviceId.trim() || !form.imei.trim() || !form.model.trim()) {
      alert("Please fill in Device ID, IMEI, and Model.");
      return;
    }

    try {
      setSubmitting(true);
      const assignedVehicle = vehicles.find((v) => v.id === form.vehicleId);
      const vehicleRegistration = assignedVehicle ? assignedVehicle.registrationNumber : null;

      if (editingDevice) {
        // Update device
        await updateDevice(editingDevice.id, {
          deviceId: form.deviceId.trim().toUpperCase(),
          imei: form.imei.trim(),
          model: form.model.trim(),
          simNumber: form.simNumber.trim(),
          status: form.status,
          vehicleId: form.vehicleId || null,
          vehicleRegistration,
          batteryLevel: Number(form.batteryLevel) || 100,
        });

        // Sync vehicle if assigned
        if (form.vehicleId) {
          await updateVehicle(form.vehicleId, {
            deviceId: editingDevice.id,
            deviceSerial: form.deviceId.trim().toUpperCase(),
          });
        }

        setFeedback(`GPS Tracker ${form.deviceId} updated.`);
        setEditingDevice(null);
      } else {
        // Add device
        const newDevice = await addDevice({
          deviceId: form.deviceId.trim().toUpperCase(),
          imei: form.imei.trim(),
          model: form.model.trim(),
          simNumber: form.simNumber.trim(),
          status: form.status,
          vehicleId: form.vehicleId || null,
          vehicleRegistration,
          batteryLevel: Number(form.batteryLevel) || 100,
        });

        // Sync vehicle if assigned
        if (form.vehicleId && newDevice.id) {
          await updateVehicle(form.vehicleId, {
            deviceId: newDevice.id,
            deviceSerial: form.deviceId.trim().toUpperCase(),
          });
        }

        setFeedback(`GPS Tracker ${form.deviceId} added to network.`);
        setShowAddModal(false);
      }

      setForm(emptyForm);
      loadVehicles();
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      console.error("Failed to save device:", err);
      alert("Failed to save GPS device.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmDevice) return;
    try {
      setSubmitting(true);
      await deleteDevice(deleteConfirmDevice.id);
      setFeedback(`Device ${deleteConfirmDevice.deviceId} removed.`);
      setDeleteConfirmDevice(null);
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      console.error("Failed to delete device:", err);
      alert("Failed to delete GPS device.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDevices = devices.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      d.deviceId?.toLowerCase().includes(q) ||
      d.imei?.toLowerCase().includes(q) ||
      d.model?.toLowerCase().includes(q) ||
      d.vehicleRegistration?.toLowerCase().includes(q) ||
      d.simNumber?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout title="GPS Devices Management">
      {/* Top Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-text-primary">
              GPS Tracking Devices (Day 9)
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Register, configure IMEI serials, link telematics units, and monitor hardware connection status.
            </p>
          </div>
        </div>

        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Register Device
        </Button>
      </div>

      {/* Feedback notice */}
      {feedback && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800 border border-emerald-200">
          <Check className="h-5 w-5 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Hardware Units"
          value={totalDevices.toString()}
          detail="Registered GPS trackers"
          status="primary"
        />
        <StatCard
          label="Online & Transmitting"
          value={onlineDevices.toString()}
          detail="Active telemetry stream"
          status="success"
        />
        <StatCard
          label="Assigned to Vehicles"
          value={assignedDevices.toString()}
          detail="Installed in fleet assets"
          status="primary"
        />
        <StatCard
          label="Offline / Unconnected"
          value={offlineDevices.toString()}
          detail="No signal detected"
          status="danger"
        />
      </div>

      {/* Devices List Card */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-text-primary">
              Hardware Trackers
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              {devices.length === 0
                ? "No GPS devices provisioned in Firestore."
                : `${devices.length} registered device${devices.length === 1 ? "" : "s"} in network.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-border bg-background p-1 text-xs font-semibold">
              {(["all", "online", "offline", "inactive"] as const).map((st) => (
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
                placeholder="Search ID, IMEI, SIM, vehicle..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center p-8 text-sm text-text-muted">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin text-primary" />
            Loading devices from Firestore...
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Radio className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold text-text-primary">
              No devices found
            </h3>
            <p className="mt-2 max-w-md text-sm text-text-muted">
              {search || statusFilter !== "all"
                ? "No tracker matched your filter criteria."
                : "Provision your first GPS telematics device to begin vehicle synchronization."}
            </p>
            <Button className="mt-6" onClick={openAddModal}>
              <Plus className="h-4 w-4" />
              Register GPS Tracker
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Device Identifier
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Hardware IMEI
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Model
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Assigned Vehicle
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Signal Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDevices.map((d) => (
                  <tr key={d.id} className="transition hover:bg-surface-hover/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Cpu className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            {d.deviceId}
                          </p>
                          <p className="text-xs text-text-muted font-mono">
                            SIM: {d.simNumber || "Embedded e-SIM"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-text-secondary">
                        {d.imei}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs font-medium text-text-primary">
                      {d.model}
                    </td>

                    <td className="px-5 py-4">
                      {d.vehicleRegistration || d.vehicleId ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <Truck className="h-3.5 w-3.5" />
                          <span>{d.vehicleRegistration || "Linked"}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted italic">Unlinked</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Badge status={d.status}>
                          {d.status === "online" ? "Online" : d.status === "offline" ? "Offline" : "Inactive"}
                        </Badge>
                        {d.batteryLevel && (
                          <span className="text-[11px] text-text-muted flex items-center gap-1 font-mono">
                            <BatteryCharging className="h-3 w-3 text-emerald-600" />
                            {d.batteryLevel}%
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(d)}
                          className="rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-primary transition"
                          title="Edit GPS Device"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmDevice(d)}
                          className="rounded-lg p-2 text-text-muted hover:bg-danger/10 hover:text-danger transition"
                          title="Delete Device"
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

      {/* Add / Edit Device Modal */}
      {(showAddModal || editingDevice) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-text-primary">
                    {editingDevice ? "Edit GPS Tracker" : "Register GPS Device"}
                  </h2>
                  <p className="text-xs text-text-muted">
                    Configure device serial ID, IMEI, and assign to a fleet vehicle.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDevice(null);
                }}
                className="rounded-lg p-2 text-text-muted hover:bg-surface-hover"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Device Identifier (Serial) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.deviceId}
                    onChange={(e) => handleInputChange("deviceId", e.target.value)}
                    placeholder="e.g. GPS-8821"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Hardware IMEI Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.imei}
                    onChange={(e) => handleInputChange("imei", e.target.value)}
                    placeholder="e.g. 864209048123456"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Device Model *
                  </label>
                  <select
                    value={form.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="Teltonika FMB920">Teltonika FMB920</option>
                    <option value="Teltonika FMC130 (4G)">Teltonika FMC130 (4G)</option>
                    <option value="Queclink GV300">Queclink GV300</option>
                    <option value="Coban GPS-303">Coban GPS-303</option>
                    <option value="Concox Jimi GT06N">Concox Jimi GT06N</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    SIM Card Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.simNumber}
                    onChange={(e) => handleInputChange("simNumber", e.target.value)}
                    placeholder="+255 682 990 112"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Connection Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleInputChange("status", e.target.value as DeviceStatus)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  >
                    <option value="online">Online (Active Signal)</option>
                    <option value="offline">Offline (No Signal)</option>
                    <option value="inactive">Inactive (Disabled)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Battery Level (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.batteryLevel}
                    onChange={(e) => handleInputChange("batteryLevel", e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-text-secondary">
                    Assign to Fleet Vehicle (Day 9 Device Link)
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
                    setEditingDevice(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingDevice ? "Save Changes" : "Register Device"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-border text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-bold text-text-primary">
              Delete GPS Tracker?
            </h3>
            <p className="mt-2 text-xs text-text-muted">
              Are you sure you want to remove <strong>{deleteConfirmDevice.deviceId}</strong> (IMEI: {deleteConfirmDevice.imei}) from the hardware registry?
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirmDevice(null)}
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
