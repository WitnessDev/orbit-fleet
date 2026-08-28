"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Check,
  Search,
  UserCheck,
  RefreshCw,
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
              Manage user permissions, roles and organization settings.
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

      {/* Role Management Card */}
      <Card className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-text-primary">
              User Directory & Role Assignments
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Assign roles to control access across Orbit Fleet modules
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-border bg-white pl-9 pr-4 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              variant="secondary"
              className="px-2.5 py-1.5 text-xs"
              onClick={loadUsers}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted">
            No users match your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-surface-hover transition">
                    <td className="p-3 font-semibold text-text-primary">
                      {u.name || "Unnamed User"}
                    </td>
                    <td className="p-3 font-mono text-text-secondary">
                      {u.email}
                    </td>
                    <td className="p-3">
                      <Badge
                        status={
                          u.role === "super_admin"
                            ? "online"
                            : u.role === "manager"
                            ? "idle"
                            : "offline"
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {selectedUser?.uid === u.uid ? (
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as UserRole)}
                            className="rounded-lg border border-border bg-white px-2 py-1 text-xs text-text-primary focus:outline-none"
                          >
                            <option value="driver">driver</option>
                            <option value="manager">manager</option>
                            <option value="super_admin">super_admin</option>
                          </select>
                          <Button
                            className="px-2.5 py-1 text-xs"
                            onClick={handleRoleChange}
                            disabled={updating}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            className="px-2.5 py-1 text-xs"
                            onClick={() => setSelectedUser(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          className="px-2.5 py-1 text-xs"
                          onClick={() => {
                            setSelectedUser(u);
                            setNewRole(u.role || "driver");
                          }}
                        >
                          <UserCheck className="h-3.5 w-3.5 mr-1" />
                          Change Role
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
