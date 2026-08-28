import type {
  User,
  UserFilterState,
  UserRole,
  UserStats,
  VehicleOption,
  RoleDefinition,
  RolePermission,
} from "@/types/user";
import type { UserFormData } from "./userValidation";

/* =========================================================================
   AVAILABLE VEHICLES (Orbit Fleet Tanzania Fleet Registry)
   ========================================================================= */
export const INITIAL_VEHICLES: VehicleOption[] = [
  {
    id: "veh-001",
    registrationNumber: "T 123 ABC",
    make: "Toyota",
    model: "Hilux Double Cab",
    type: "Pickup",
    status: "online",
    assignedDriverName: "Baraka Msuya",
  },
  {
    id: "veh-002",
    registrationNumber: "T 456 XYZ",
    make: "Toyota",
    model: "Land Cruiser Prado",
    type: "Car",
    status: "online",
    assignedDriverName: "Emmanuel Kweka",
  },
  {
    id: "veh-003",
    registrationNumber: "T 789 DEF",
    make: "Isuzu",
    model: "FTR Heavy Cargo",
    type: "Truck",
    status: "idle",
    assignedDriverName: "Juma Hassan",
  },
  {
    id: "veh-004",
    registrationNumber: "MC 123 AA",
    make: "Bajaj",
    model: "Boxer 150 Express",
    type: "Motorcycle",
    status: "online",
    assignedDriverName: "Ally Rashid",
  },
  {
    id: "veh-005",
    registrationNumber: "T 555 GHL",
    make: "Scania",
    model: "R500 Prime Mover",
    type: "Truck",
    status: "online",
    assignedDriverName: "Kassim Mwamba",
  },
  {
    id: "veh-006",
    registrationNumber: "T 888 TAN",
    make: "Toyota",
    model: "HiAce Super Custom",
    type: "Van",
    status: "maintenance",
  },
  {
    id: "veh-007",
    registrationNumber: "MC 456 TZ",
    make: "Honda",
    model: "Ace 125 Courier",
    type: "Motorcycle",
    status: "offline",
    assignedDriverName: "Saidi Omari",
  },
  {
    id: "veh-008",
    registrationNumber: "T 901 KIL",
    make: "Mitsubishi",
    model: "Fuso Canter 4T",
    type: "Truck",
    status: "online",
    assignedDriverName: "Kelvin Mollel",
  },
  {
    id: "veh-009",
    registrationNumber: "T 342 DSM",
    make: "Ford",
    model: "Ranger XLT 4x4",
    type: "Pickup",
    status: "idle",
    assignedDriverName: "Witness Kivuyo",
  },
  {
    id: "veh-010",
    registrationNumber: "T 770 ZNZ",
    make: "Nissan",
    model: "Civilian 30-Seater",
    type: "Bus",
    status: "online",
  },
];

/* =========================================================================
   STANDARD PERMISSIONS AND ROLES DEFINITIONS
   ========================================================================= */
export const SYSTEM_PERMISSIONS: RolePermission[] = [
  {
    id: "perm_view_vehicles",
    label: "View Vehicles",
    category: "Vehicles",
    description: "View fleet inventory, vehicle telematics, and basic health metrics.",
  },
  {
    id: "perm_manage_vehicles",
    label: "Manage & Edit Vehicles",
    category: "Vehicles",
    description: "Add new vehicles, assign GPS trackers, and modify odometer data.",
  },
  {
    id: "perm_delete_vehicles",
    label: "Delete Vehicles",
    category: "Vehicles",
    description: "Permanently delete vehicles and decommission GPS units.",
  },
  {
    id: "perm_view_live_location",
    label: "View Live Location",
    category: "Tracking",
    description: "Access real-time GPS coordinates, radar speed, and live map playback.",
  },
  {
    id: "perm_geofence_alerts",
    label: "Geofencing & Alerts",
    category: "Tracking",
    description: "Configure restricted entry zones and dispatch critical panic alerts.",
  },
  {
    id: "perm_view_drivers",
    label: "View Drivers",
    category: "Users & Roles",
    description: "Inspect driver licenses, assigned vehicles, and shift rosters.",
  },
  {
    id: "perm_manage_users",
    label: "Manage Users & Permissions",
    category: "Users & Roles",
    description: "Create, invite, edit roles, and manage access to Orbit Fleet.",
  },
  {
    id: "perm_view_trips",
    label: "View Trips & Telematics",
    category: "Reports",
    description: "Access historical playback, trip summaries, and fuel metrics.",
  },
  {
    id: "perm_export_reports",
    label: "Export Analytics & Reports",
    category: "Reports",
    description: "Download automated CSV and PDF fleet intelligence reports.",
  },
];

export const DEFAULT_ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: "owner",
    name: "owner",
    label: "Owner",
    description: "Full account & fleet control with executive oversight.",
    colorVariant: "emerald",
    permissions: [
      "perm_view_vehicles",
      "perm_manage_vehicles",
      "perm_view_live_location",
      "perm_geofence_alerts",
      "perm_view_drivers",
      "perm_manage_users",
      "perm_view_trips",
      "perm_export_reports",
    ],
  },
  {
    id: "admin",
    name: "admin",
    label: "Admin",
    description: "System administration & user management across all assets.",
    colorVariant: "purple",
    permissions: SYSTEM_PERMISSIONS.map((p) => p.id),
  },
  {
    id: "fleet_manager",
    name: "fleet_manager",
    label: "Fleet Manager",
    description: "Fleet operations & driver assignments across regional fleets.",
    colorVariant: "blue",
    permissions: [
      "perm_view_vehicles",
      "perm_manage_vehicles",
      "perm_view_live_location",
      "perm_geofence_alerts",
      "perm_view_drivers",
      "perm_view_trips",
      "perm_export_reports",
    ],
  },
  {
    id: "dispatcher",
    name: "dispatcher",
    label: "Dispatcher / Operations",
    description: "Daily fleet operations, schedule monitoring, and live dispatch.",
    colorVariant: "teal",
    permissions: [
      "perm_view_vehicles",
      "perm_view_live_location",
      "perm_view_drivers",
      "perm_view_trips",
      "perm_export_reports",
    ],
  },
  {
    id: "driver",
    name: "driver",
    label: "Driver",
    description: "Assigned vehicle & trip access with live route navigation.",
    colorVariant: "slate",
    permissions: ["perm_view_vehicles", "perm_view_live_location", "perm_view_trips"],
  },
];

/* =========================================================================
   INITIAL REALISTIC MOCK USERS (Tanzania Orbit Fleet context)
   ========================================================================= */
const INITIAL_USERS: User[] = [
  {
    id: "usr-001",
    name: "Witness Kivuyo",
    email: "witness.kivuyo@orbitfleet.co.tz",
    phone: "+255 754 112 233",
    role: "admin",
    status: "active",
    vehicleIds: ["veh-001", "veh-002", "veh-003", "veh-004", "veh-005", "veh-006", "veh-007", "veh-008", "veh-009", "veh-010"],
    department: "System Administration",
    createdAt: "2026-01-10T08:00:00.000Z",
    lastLogin: "15 minutes ago",
    notes: "Lead System Administrator & Fleet Orchestrator",
  },
  {
    id: "usr-002",
    name: "Dr. Rashid Mwinyi",
    email: "rashid.mwinyi@kilimanjaro-logistics.com",
    phone: "+255 784 990 120",
    role: "owner",
    status: "active",
    vehicleIds: ["veh-001", "veh-002", "veh-003", "veh-005", "veh-008"],
    department: "Executive Board",
    createdAt: "2026-01-15T09:30:00.000Z",
    lastLogin: "2 hours ago",
    notes: "Managing Partner at Kilimanjaro Heavy Haulage",
  },
  {
    id: "usr-003",
    name: "Fatma Said",
    email: "fatma.said@orbitfleet.co.tz",
    phone: "+255 713 445 566",
    role: "fleet_manager",
    status: "active",
    vehicleIds: ["veh-001", "veh-002", "veh-003", "veh-005", "veh-006", "veh-008"],
    department: "Operations & Dispatch",
    createdAt: "2026-02-01T11:15:00.000Z",
    lastLogin: "30 minutes ago",
    notes: "Central Region Fleet Operations Lead",
  },
  {
    id: "usr-004",
    name: "Baraka Msuya",
    email: "baraka.msuya@drivers.orbit.tz",
    phone: "+255 768 334 411",
    role: "driver",
    status: "active",
    vehicleIds: ["veh-001"],
    department: "Field Delivery",
    createdAt: "2026-02-10T14:20:00.000Z",
    lastLogin: "1 hour ago",
    notes: "Assigned to Toyota Hilux T 123 ABC (Dar - Morogoro Route)",
  },
  {
    id: "usr-005",
    name: "Emmanuel Kweka",
    email: "emmanuel.kweka@orbitfleet.co.tz",
    phone: "+255 755 889 900",
    role: "fleet_manager",
    status: "active",
    vehicleIds: ["veh-002", "veh-004", "veh-007"],
    department: "Urban Logistics",
    createdAt: "2026-02-14T07:45:00.000Z",
    lastLogin: "4 hours ago",
  },
  {
    id: "usr-006",
    name: "Ally Rashid",
    email: "ally.rashid@couriers.orbit.tz",
    phone: "+255 682 110 099",
    role: "driver",
    status: "active",
    vehicleIds: ["veh-004"],
    department: "Express Couriers",
    createdAt: "2026-02-18T10:00:00.000Z",
    lastLogin: "45 minutes ago",
  },
  {
    id: "usr-007",
    name: "Amina Bakari",
    email: "amina.bakari@tanzania-ports.gov.tz",
    phone: "+255 777 223 344",
    role: "dispatcher",
    status: "active",
    vehicleIds: ["veh-003", "veh-005", "veh-008"],
    department: "Port Authority Dispatch",
    createdAt: "2026-03-01T12:00:00.000Z",
    lastLogin: "Yesterday",
    notes: "Port clearance dispatch coordinator",
  },
  {
    id: "usr-008",
    name: "Juma Hassan",
    email: "juma.hassan@drivers.orbit.tz",
    phone: "+255 715 667 788",
    role: "driver",
    status: "inactive",
    vehicleIds: ["veh-003"],
    department: "Heavy Transport",
    createdAt: "2026-03-05T08:30:00.000Z",
    lastLogin: "3 days ago",
    notes: "Currently on annual leave rotation",
  },
  {
    id: "usr-009",
    name: "Kassim Mwamba",
    email: "kassim.mwamba@drivers.orbit.tz",
    phone: "+255 762 908 172",
    role: "driver",
    status: "active",
    vehicleIds: ["veh-005"],
    department: "Interstate Transit",
    createdAt: "2026-03-12T16:00:00.000Z",
    lastLogin: "5 hours ago",
  },
  {
    id: "usr-010",
    name: "Grace Makoye",
    email: "grace.makoye@fintech.co.tz",
    phone: "+255 744 190 283",
    role: "dispatcher",
    status: "pending",
    vehicleIds: [],
    department: "Financial Risk",
    createdAt: "2026-03-20T10:45:00.000Z",
    lastLogin: "Never",
    notes: "Invitation sent, pending email verification",
  },
  {
    id: "usr-011",
    name: "Kelvin Mollel",
    email: "kelvin.mollel@drivers.orbit.tz",
    phone: "+255 788 340 551",
    role: "driver",
    status: "active",
    vehicleIds: ["veh-008"],
    department: "Arusha Regional Transit",
    createdAt: "2026-03-22T09:10:00.000Z",
    lastLogin: "6 hours ago",
  },
  {
    id: "usr-012",
    name: "Neema Lyimo",
    email: "neema.lyimo@orbitfleet.co.tz",
    phone: "+255 753 876 543",
    role: "fleet_manager",
    status: "active",
    vehicleIds: ["veh-007", "veh-009", "veh-010"],
    department: "Maintenance & Workshop",
    createdAt: "2026-03-25T13:20:00.000Z",
    lastLogin: "20 minutes ago",
  },
  {
    id: "usr-013",
    name: "Saidi Omari",
    email: "saidi.omari@drivers.orbit.tz",
    phone: "+255 712 009 887",
    role: "driver",
    status: "suspended",
    vehicleIds: ["veh-007"],
    department: "Express Couriers",
    createdAt: "2026-04-02T11:00:00.000Z",
    lastLogin: "2 weeks ago",
    notes: "Temporary suspension pending telematics speed review",
  },
  {
    id: "usr-014",
    name: "Godfrey Mbwambo",
    email: "godfrey.mbwambo@serengeti-safaris.tz",
    phone: "+255 765 443 219",
    role: "owner",
    status: "active",
    vehicleIds: ["veh-002", "veh-009", "veh-010"],
    department: "Tourism Fleet",
    createdAt: "2026-04-10T15:30:00.000Z",
    lastLogin: "Yesterday",
  },
  {
    id: "usr-015",
    name: "Agnes Mushi",
    email: "agnes.mushi@orbitfleet.co.tz",
    phone: "+255 782 334 110",
    role: "admin",
    status: "active",
    vehicleIds: ["veh-001", "veh-002", "veh-003", "veh-004", "veh-005", "veh-006", "veh-007", "veh-008", "veh-009", "veh-010"],
    department: "Security Operations",
    createdAt: "2026-04-15T09:00:00.000Z",
    lastLogin: "1 day ago",
  },
];

/* =========================================================================
   USER SERVICE REPOSITORY (In-memory state with localStorage sync if in browser)
   ========================================================================= */
const STORAGE_KEY_USERS = "orbit_fleet_users_v2";
const STORAGE_KEY_ROLES = "orbit_fleet_roles_v2";

class UserService {
  private users: User[] = [];
  private roles: RoleDefinition[] = [];
  private isInitialized = false;

  private init() {
    if (this.isInitialized) return;
    if (typeof window !== "undefined") {
      try {
        const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
        const storedRoles = localStorage.getItem(STORAGE_KEY_ROLES);

        this.users = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_USERS];
        this.roles = storedRoles ? JSON.parse(storedRoles) : [...DEFAULT_ROLE_DEFINITIONS];
      } catch (err) {
        console.warn("Failed to load from storage, using initial mock data:", err);
        this.users = [...INITIAL_USERS];
        this.roles = [...DEFAULT_ROLE_DEFINITIONS];
      }
    } else {
      this.users = [...INITIAL_USERS];
      this.roles = [...DEFAULT_ROLE_DEFINITIONS];
    }
    this.isInitialized = true;
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.users));
        localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(this.roles));
      } catch (err) {
        console.warn("Failed to save to localStorage:", err);
      }
    }
  }

  public async getUsers(
    filter?: UserFilterState,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    users: User[];
    stats: UserStats;
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    this.init();

    // Calculate global stats
    const stats: UserStats = {
      totalUsers: this.users.length,
      activeUsers: this.users.filter((u) => u.status === "active").length,
      inactiveUsers: this.users.filter((u) => u.status === "inactive" || u.status === "suspended").length,
      adminManagerCount: this.users.filter(
        (u) => u.role === "admin" || u.role === "owner" || u.role === "fleet_manager"
      ).length,
      driverCount: this.users.filter((u) => u.role === "driver").length,
    };

    // Apply filtering
    let filtered = [...this.users];

    if (filter) {
      if (filter.search && filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.phone.toLowerCase().includes(query) ||
            (u.department && u.department.toLowerCase().includes(query))
        );
      }

      if (filter.role && filter.role !== "all") {
        filtered = filtered.filter((u) => u.role.toLowerCase() === filter.role.toLowerCase());
      }

      if (filter.status && filter.status !== "all") {
        filtered = filtered.filter((u) => u.status.toLowerCase() === filter.status.toLowerCase());
      }

      if (filter.vehicleId && filter.vehicleId !== "all") {
        filtered = filtered.filter((u) => u.vehicleIds.includes(filter.vehicleId!));
      }
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const validPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (validPage - 1) * pageSize;
    const paginatedUsers = filtered.slice(startIndex, startIndex + pageSize);

    return {
      users: paginatedUsers,
      stats,
      total,
      totalPages,
      currentPage: validPage,
    };
  }

  public async getUserById(id: string): Promise<User | null> {
    this.init();
    return this.users.find((u) => u.id === id) || null;
  }

  public async createUser(data: UserFormData): Promise<User> {
    this.init();
    const newUser: User = {
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: data.role,
      status: data.status,
      vehicleIds: data.vehicleIds || [],
      department: data.department?.trim() || "Operations",
      notes: data.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
      lastLogin: "Never",
    };

    // Prepend new user
    this.users.unshift(newUser);
    this.persist();
    return newUser;
  }

  public async updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
    this.init();
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const current = this.users[index];
    const updated: User = {
      ...current,
      name: data.name !== undefined ? data.name.trim() : current.name,
      email: data.email !== undefined ? data.email.trim().toLowerCase() : current.email,
      phone: data.phone !== undefined ? data.phone.trim() : current.phone,
      role: data.role !== undefined ? data.role : current.role,
      status: data.status !== undefined ? data.status : current.status,
      vehicleIds: data.vehicleIds !== undefined ? data.vehicleIds : current.vehicleIds,
      department: data.department !== undefined ? data.department.trim() : current.department,
      notes: data.notes !== undefined ? data.notes.trim() : current.notes,
    };

    this.users[index] = updated;
    this.persist();
    return updated;
  }

  public async updateRole(id: string, newRole: UserRole): Promise<User> {
    return this.updateUser(id, { role: newRole });
  }

  public async updateStatus(id: string, newStatus: User["status"]): Promise<User> {
    return this.updateUser(id, { status: newStatus });
  }

  public async assignVehicles(id: string, vehicleIds: string[]): Promise<User> {
    return this.updateUser(id, { vehicleIds });
  }

  public async deleteUser(id: string): Promise<boolean> {
    this.init();
    const prevLen = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    if (this.users.length < prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public async getRoles(): Promise<RoleDefinition[]> {
    this.init();
    return [...this.roles];
  }

  public async saveRole(role: RoleDefinition): Promise<RoleDefinition> {
    this.init();
    const existingIndex = this.roles.findIndex((r) => r.id === role.id);
    if (existingIndex >= 0) {
      this.roles[existingIndex] = { ...role };
    } else {
      this.roles.push({
        ...role,
        isCustom: true,
      });
    }
    this.persist();
    return role;
  }

  public async getVehicles(): Promise<VehicleOption[]> {
    return [...INITIAL_VEHICLES];
  }
}

export const userService = new UserService();
