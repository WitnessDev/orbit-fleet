import type { UserRole, UserStatus } from "@/types/user";

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  vehicleIds: string[];
  department?: string;
  notes?: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  vehicleIds?: string;
  general?: string;
}

export const validateUserForm = (
  data: Partial<UserFormData>
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || !data.name.trim()) {
    errors.name = "Full name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !data.email.trim()) {
    errors.email = "Email address is required";
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  // Phone validation (Optional but if provided, validate pattern)
  if (data.phone && data.phone.trim()) {
    const cleanedPhone = data.phone.replace(/[\s\-()]/g, "");
    // Check if reasonable digits length (7 to 15 digits, optionally starting with +)
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      errors.phone = "Enter a valid phone number (e.g. +255 712 345 678)";
    }
  }

  // Role validation
  if (!data.role) {
    errors.role = "User role is required";
  }

  // Status validation
  if (!data.status) {
    errors.status = "User status is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
