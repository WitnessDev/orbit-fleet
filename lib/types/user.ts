export type UserRole = "super_admin" | "manager" | "driver";

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
