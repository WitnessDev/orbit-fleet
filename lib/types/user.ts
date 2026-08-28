export type UserRole =
  | "owner"
  | "admin"
  | "fleet_manager"
  | "dispatcher"
  | "driver";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  department?: string;
  createdAt: string;
  updatedAt?: string;
}
