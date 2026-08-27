import { useState, useEffect, useCallback } from "react";
import type {
  User,
  UserFilterState,
  UserStats,
  VehicleOption,
  RoleDefinition,
} from "@/types/user";
import { userService } from "@/lib/users/userService";

interface UseUsersReturn {
  users: User[];
  stats: UserStats;
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filter: UserFilterState;
  vehicles: VehicleOption[];
  roles: RoleDefinition[];
  setFilter: (newFilter: Partial<UserFilterState>) => void;
  resetFilter: () => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refreshUsers: () => Promise<void>;
}

const DEFAULT_FILTER: UserFilterState = {
  search: "",
  role: "all",
  status: "all",
};

const DEFAULT_STATS: UserStats = {
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  adminManagerCount: 0,
  driverCount: 0,
};

export function useUsers(initialPageSize = 10): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<UserFilterState>(DEFAULT_FILTER);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [usersResult, vehiclesList, rolesList] = await Promise.all([
          userService.getUsers(filter, currentPage, pageSize),
          userService.getVehicles(),
          userService.getRoles(),
        ]);

        if (isMounted) {
          setUsers(usersResult.users);
          setStats(usersResult.stats);
          setTotal(usersResult.total);
          setTotalPages(usersResult.totalPages);
          setVehicles(vehiclesList);
          setRoles(rolesList);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Failed to load user management data.";
          setError(errorMsg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [filter, currentPage, pageSize, refreshTrigger]);

  const setFilter = useCallback((newFilter: Partial<UserFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
    setCurrentPage(1);
  }, []);

  const resetFilter = useCallback(() => {
    setFilterState(DEFAULT_FILTER);
    setCurrentPage(1);
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  }, []);

  const refreshUsers = useCallback(async () => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
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
  };
}
