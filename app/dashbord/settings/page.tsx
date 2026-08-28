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
              Manage user permissions, roles  and organization settings.
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

     
    </DashboardLayout>
  );
}
