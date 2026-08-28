"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Check,
  Search,
  UserCheck,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import {
  getAllUsers,
  updateUserRole,
  type UserProfile,
  type UserRole,
} from "@/app/dashbord/database";
import { OFFICIAL_ROLES } from "@/lib/auth/permissions";
import { useCurrentRole } from "@/lib/auth/useCurrentRole";

const ROLE_OPTIONS: { role: UserRole; label: string }[] = [
  { role: "owner", label: "Owner" },
  { role: "admin", label: "Admin" },
  { role: "fleet_manager", label: "Fleet Manager" },
  { role: "dispatcher", label: "Dispatcher / Operations" },
  { role: "driver", label: "Driver" },
];

export default function SettingsPage() {
  const { user: currentAuthUser, role: currentUserRole } = useCurrentRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("driver");
  const [updating, setUpdating] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
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
      setErrorMessage("");

      // Prevent non-owners from downgrading an owner
      if (selectedUser.role === "owner" && newRole !== "owner") {
        const ownerCount = users.filter((u) => u.role === "owner").length;
        if (ownerCount <= 1) {
          setErrorMessage("Cannot reassign the primary account Owner.");
          setUpdating(false);
          return;
        }
      }

      await updateUserRole(selectedUser.uid, newRole);
      setSuccessNotice(`Assigned role "${OFFICIAL_ROLES[newRole]?.label || newRole}" to ${selectedUser.name || selectedUser.email}`);
      setSelectedUser(null);
      await loadUsers();
      setTimeout(() => setSuccessNotice(""), 4000);
    } catch (error) {
      console.error("Failed to update role:", error);
      setErrorMessage("Failed to update user role in database.");
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

  const ownersCount = users.filter((u) => u.role === "owner").length;
  const adminsCount = users.filter((u) => u.role === "admin").length;
  const managersCount = users.filter((u) => u.role === "fleet_manager").length;
  const dispatchersCount = users.filter((u) => u.role === "dispatcher").length;
  const driversCount = users.filter((u) => u.role === "driver").length;

  return (
    <DashboardLayout title="Access Control & Organization Settings">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-slate-900">
              Role-Based Access Control (RBAC)
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Enforce role permissions across Orbit Fleet modules and operational workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successNotice && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 border border-emerald-200 shadow-xs">
          <Check className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-800 border border-rose-200 shadow-xs">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* StatCards Grid: 4x1 on desktop, 2x2 on tablet, 1 on mobile */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Registered Users"
          value={users.length.toString()}
          detail="Accounts in database"
          status="primary"
          trend={{ value: `${ownersCount} Owner • ${adminsCount} Admin`, isPositive: true }}
        />
        <StatCard
          label="Fleet Managers"
          value={managersCount.toString()}
          detail="Regional fleet supervision"
          status="primary"
        />
        <StatCard
          label="Dispatchers"
          value={dispatchersCount.toString()}
          detail="Active route dispatchers"
          status="success"
        />
        <StatCard
          label="Vehicle Drivers"
          value={driversCount.toString()}
          detail="Field delivery operators"
          status="warning"
        />
      </div>

      {/* Role Management Card */}
      <Card className="p-4 sm:p-6 rounded-2xl border border-slate-200">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              User Directory & Role Assignments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Assign one of the 5 official Orbit Fleet system roles
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
            <Button
              variant="secondary"
              className="px-3 py-2 text-xs gap-1.5"
              onClick={loadUsers}
              disabled={loading}
              title="Refresh users"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            {loading ? "Loading users from Firestore..." : "No users match your search query."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Assigned Role</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map((u) => {
                  const roleConfig = OFFICIAL_ROLES[u.role as UserRole] || OFFICIAL_ROLES.driver;
                  const isSelected = selectedUser?.uid === u.uid;

                  return (
                    <tr key={u.uid} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        {u.name || "Unnamed Account"}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 text-[11px]">
                        {u.email}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${roleConfig.badgeStyles.bg} ${roleConfig.badgeStyles.border}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${roleConfig.badgeStyles.dot}`} />
                          {roleConfig.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {u.uid === currentAuthUser?.uid || u.email === currentAuthUser?.email ? (
                          <span className="text-[11px] font-semibold text-slate-400 italic">
                            Current Account
                          </span>
                        ) : u.role === "owner" && currentUserRole !== "owner" ? (
                          <span className="text-[11px] font-semibold text-slate-400 italic">
                            Owner Protected
                          </span>
                        ) : isSelected ? (
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value as UserRole)}
                              className="rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                            >
                              {ROLE_OPTIONS.map((opt) => (
                                <option key={opt.role} value={opt.role}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <Button
                              className="px-3 py-1.5 text-xs"
                              onClick={handleRoleChange}
                              disabled={updating}
                            >
                              {updating ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              variant="secondary"
                              className="px-2.5 py-1.5 text-xs"
                              onClick={() => setSelectedUser(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            className="px-2.5 py-1.5 text-xs gap-1.5 text-slate-600 hover:text-emerald-700"
                            onClick={() => {
                              setSelectedUser(u);
                              setNewRole((u.role as UserRole) || "driver");
                            }}
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Change Role
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
