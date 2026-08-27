"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Search,
  Check,
  Building2,
  Mail,
  Calendar,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import {
  getAllUsers,
  updateUserRole,
  type UserProfile,
  type UserRole,
} from "@/app/dashbord/database";

export default function SettingsPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("driver");
  const [updating, setUpdating] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");

  const loadUsers = async () => {
    try {
      const list = await getAllUsers();
      setUsers(list);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAllUsers()
      .then((list) => {
        if (isMounted) {
          setUsers(list);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error loading users:", error);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    try {
      setUpdating(true);
      await updateUserRole(selectedUser.uid, newRole);
      setSuccessNotice(`Updated role for ${selectedUser.name || selectedUser.email} to ${newRole}`);
      setSelectedUser(null);
      await loadUsers();
      setTimeout(() => setSuccessNotice(""), 4000);
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update user role.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const superAdmins = users.filter((u) => u.role === "super_admin").length;
  const managers = users.filter((u) => u.role === "manager").length;
  const drivers = users.filter((u) => u.role === "driver").length;

  return (
    <DashboardLayout title="Settings & User Roles">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-text-primary">
              Role-Based Access Control (RBAC)
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Manage user permissions, roles (Super Admin, Manager, Driver), and organization settings.
            </p>
          </div>
        </div>
      </div>

      {/* Success alert */}
      {successNotice && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 border border-emerald-200">
          <Check className="h-5 w-5 text-emerald-600" />
          {successNotice}
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Registered Users"
          value={users.length.toString()}
          detail="Active accounts in Firestore"
          status="primary"
        />
        <StatCard
          label="Super Admins"
          value={superAdmins.toString()}
          detail="Full system configuration"
          status="primary"
        />
        <StatCard
          label="Managers"
          value={managers.toString()}
          detail="Fleet and dispatch operations"
          status="success"
        />
        <StatCard
          label="Drivers"
          value={drivers.toString()}
          detail="Vehicle operators & telemetry"
          status="warning"
        />
      </div>

      {/* Grid: Users Table & Role Permissions Card */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* User Management Table */}
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-text-primary">
                Users & Permissions (Day 5)
              </h2>
              <p className="text-xs text-text-muted">
                Assign and modify role permissions across your organization.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user or role..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary sm:w-56"
                />
              </div>

              <button
                type="button"
                onClick={loadUsers}
                className="rounded-lg border border-border p-2.5 text-text-muted hover:bg-surface-hover hover:text-text-primary transition"
                title="Refresh user list"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center p-8 text-sm text-text-muted">
              Loading users from Firestore...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
              <Users className="mb-3 h-10 w-10 text-text-muted opacity-50" />
              <p className="font-semibold text-text-primary">No users found</p>
              <p className="text-xs text-text-muted mt-1">
                Registered users will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      User
                    </th>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Role
                    </th>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Joined
                    </th>
                    <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((u) => (
                    <tr key={u.uid} className="transition hover:bg-surface-hover/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                            {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-primary">
                              {u.name || "Unnamed User"}
                            </p>
                            <p className="text-xs text-text-muted flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <Badge status={u.role || "driver"}>
                          {u.role === "super_admin"
                            ? "Super Admin"
                            : u.role === "manager"
                            ? "Manager"
                            : "Driver"}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="secondary"
                          className="text-xs py-1 px-3"
                          onClick={() => {
                            setSelectedUser(u);
                            setNewRole(u.role || "driver");
                          }}
                        >
                          Change Role
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Role Explanations & Organization Card */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2.5 mb-4 border-b border-border pb-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-display text-sm font-bold text-text-primary">
                Role Permissions Matrix
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-purple-900">Super Admin</span>
                  <Badge status="super_admin">Tier 1</Badge>
                </div>
                <p className="text-purple-800 leading-relaxed text-[11px]">
                  Full access to workspace settings, user role assignment, fleet deletion, and database configuration.
                </p>
              </div>

              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-teal-900">Manager</span>
                  <Badge status="manager">Tier 2</Badge>
                </div>
                <p className="text-teal-800 leading-relaxed text-[11px]">
                  Manage fleet vehicles, assign drivers, connect GPS devices, and monitor live tracking.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">Driver</span>
                  <Badge status="driver">Tier 3</Badge>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  View assigned vehicle, trip history, route assignments, and submit vehicle status updates.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-display text-sm font-bold text-text-primary">
                Workspace Info
              </h3>
            </div>
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-text-muted">Organization:</span>
                <span className="font-semibold text-text-primary">Orbit Fleet Headquarters</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-text-muted">Firestore DB:</span>
                <span className="font-semibold text-emerald-700">orbit-fleet-dev</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Active Platform:</span>
                <span className="font-semibold text-text-primary">Next.js + Firebase</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Role Change Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-text-primary">
                  Change Role
                </h3>
                <p className="text-xs text-text-muted">
                  Update role for {selectedUser.name || selectedUser.email}
                </p>
              </div>
            </div>

            <div className="my-4 space-y-2">
              <label className="block text-xs font-bold text-text-secondary">
                Select New Role
              </label>
              <div className="space-y-2">
                {[
                  {
                    value: "super_admin",
                    label: "Super Admin",
                    desc: "Full workspace & user management permissions",
                  },
                  {
                    value: "manager",
                    label: "Manager",
                    desc: "Fleet, drivers, and device operational control",
                  },
                  {
                    value: "driver",
                    label: "Driver",
                    desc: "Assigned vehicle and trip status access",
                  },
                ].map((item) => (
                  <label
                    key={item.value}
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      newRole === item.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-surface-hover"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={item.value}
                      checked={newRole === item.value}
                      onChange={() => setNewRole(item.value as UserRole)}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <p className="text-xs font-bold text-text-primary">{item.label}</p>
                      <p className="text-[11px] text-text-muted">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <Button
                variant="secondary"
                onClick={() => setSelectedUser(null)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button onClick={handleRoleChange} disabled={updating}>
                {updating ? "Saving..." : "Update Role"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
