"use client";

import { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  RefreshCw,
  Download,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import UserSearch from "@/components/users/UserSearch";
import UserFilters from "@/components/users/UserFilters";
import UserTable from "@/components/users/UserTable";
import UserPagination from "@/components/users/UserPagination";
import UserModal from "@/components/users/UserModal";
import DeleteUserModal from "@/components/users/DeleteUserModal";
import UserDetailsModal from "@/components/users/UserDetailsModal";
import RoleModal from "@/components/users/RoleModal";
import { useUsers } from "@/hooks/users/useUsers";
import { useCreateUser } from "@/hooks/users/useCreateUser";
import { useUpdateUser } from "@/hooks/users/useUpdateUser";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import type { User, RoleDefinition } from "@/types/user";
import type { UserFormData } from "@/lib/users/userValidation";

export default function UserManagementPage() {
  const {
    users,
    stats,
    total,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    filter,
    vehicles,
    roles,
    setFilter,
    resetFilter,
    setPage,
    setPageSize,
    refreshUsers,
  } = useUsers(10);

  // Modal dialog states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [userToView, setUserToView] = useState<User | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Mutation hooks
  const { createUser } = useCreateUser(() => {
    refreshUsers();
  });

  const { updateUser, updateStatus } = useUpdateUser(() => {
    refreshUsers();
  });

  const { deleteUser } = useDeleteUser(() => {
    refreshUsers();
  });

  // Action handlers
  const handleOpenAddUser = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const handleOpenViewUser = (user: User) => {
    setUserToView(user);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    await updateStatus(user.id, nextStatus);
  };

  const handleSaveUser = async (data: UserFormData): Promise<boolean> => {
    if (userToEdit) {
      const result = await updateUser(userToEdit.id, data);
      return Boolean(result);
    } else {
      const result = await createUser(data);
      return Boolean(result);
    }
  };

  const handleConfirmDelete = async (userId: string) => {
    await deleteUser(userId);
  };

  const handleSaveRole = async (roleToSave: RoleDefinition) => {
    const { userService } = await import("@/lib/users/userService");
    await userService.saveRole(roleToSave);
    await refreshUsers();
  };

  const hasActiveFilters =
    Boolean(filter.search && filter.search.trim().length > 0) ||
    filter.role !== "all" ||
    filter.status !== "all";

  // Export CSV helper
  const handleExportCSV = () => {
    if (users.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Role", "Status", "Department", "Vehicles Count", "Last Login"];
    const rows = users.map((u) => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.phone || ""}"`,
      u.role,
      u.status,
      `"${u.department || ""}"`,
      u.vehicleIds?.length || 0,
      `"${u.lastLogin || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orbit_fleet_users_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6 pb-12">
        {/* =========================================================================
            1. PAGE HEADER (Title, Breadcrumb & Action CTAs)
           ========================================================================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                User Management
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                {total} accounts
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Manage accounts, roles, access permissions, and vehicle assignments across the Orbit Fleet ecosystem.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition active:scale-[0.98] cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>Roles & Permissions</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition active:scale-[0.98] cursor-pointer"
              title="Export filtered users to CSV"
            >
              <Download className="h-4 w-4 text-slate-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddUser}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-600 active:scale-[0.98] transition cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. STATS KPI OVERVIEW CARDS
           ========================================================================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={String(stats.totalUsers)}
            detail="Registered team accounts"
            status="primary"
          />
          <StatCard
            label="Active Accounts"
            value={String(stats.activeUsers)}
            detail={`${Math.round((stats.activeUsers / Math.max(1, stats.totalUsers)) * 100)}% operational status`}
            status="success"
          />
          <StatCard
            label="Drivers Assigned"
            value={String(stats.driverCount)}
            detail="Field delivery & transport"
            status="primary"
          />
          <StatCard
            label="Admins & Managers"
            value={String(stats.adminManagerCount)}
            detail="Dispatch & system leads"
            status="primary"
          />
        </div>

        {/* =========================================================================
            3. CONTROLS BAR (Search, Filters & Actions)
           ========================================================================= */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          {/* Search Box */}
          <div className="flex-1 max-w-md">
            <UserSearch
              value={filter.search || ""}
              onChange={(search) => setFilter({ search })}
            />
          </div>

          {/* Filters + Refresh */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
            <UserFilters
              filter={filter}
              onChange={setFilter}
              onReset={resetFilter}
              roles={roles}
            />

            <button
              type="button"
              onClick={() => refreshUsers()}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              title="Refresh users"
              aria-label="Refresh users"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            4. MAIN USERS DATA TABLE
           ========================================================================= */}
        <UserTable
          users={users}
          vehicles={vehicles}
          loading={loading}
          error={error}
          hasActiveFilters={hasActiveFilters}
          onAddUser={handleOpenAddUser}
          onResetFilters={resetFilter}
          onRetry={refreshUsers}
          onView={handleOpenViewUser}
          onEdit={handleOpenEditUser}
          onChangeRole={handleOpenEditUser}
          onAssignVehicles={handleOpenEditUser}
          onToggleStatus={handleToggleStatus}
          onDelete={handleOpenDeleteUser}
        />

        {/* =========================================================================
            5. PAGINATION BAR
           ========================================================================= */}
        {!loading && users.length > 0 && (
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}

        {/* =========================================================================
            6. MODALS & DIALOGS
           ========================================================================= */}
        {/* Add / Edit User Modal */}
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setUserToEdit(null);
          }}
          onSave={handleSaveUser}
          userToEdit={userToEdit}
          vehicles={vehicles}
          roles={roles}
        />

        {/* User Details Inspection Sheet */}
        <UserDetailsModal
          isOpen={isDetailsModalOpen}
          user={userToView}
          vehicles={vehicles}
          roles={roles}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setUserToView(null);
          }}
          onEdit={(user) => {
            setIsDetailsModalOpen(false);
            handleOpenEditUser(user);
          }}
        />

        {/* Delete Confirmation Modal */}
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          user={userToDelete}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          onConfirmDelete={handleConfirmDelete}
        />

        {/* Roles & Permissions Matrix Modal */}
        <RoleModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onSaveRole={handleSaveRole}
          existingRoles={roles}
        />
      </div>
    </DashboardLayout>
  );
}
