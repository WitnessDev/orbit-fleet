import { useState } from "react";
import type { User, UserRole, UserStatus } from "@/types/user";
import { userService } from "@/lib/users/userService";
import { validateUserForm, type UserFormData, type ValidationErrors } from "@/lib/users/userValidation";

interface UseUpdateUserReturn {
  updateUser: (id: string, data: Partial<UserFormData>) => Promise<User | null>;
  updateRole: (id: string, role: UserRole) => Promise<User | null>;
  updateStatus: (id: string, status: UserStatus) => Promise<User | null>;
  assignVehicles: (id: string, vehicleIds: string[]) => Promise<User | null>;
  loading: boolean;
  errors: ValidationErrors;
  clearErrors: () => void;
}

export function useUpdateUser(onSuccess?: (user: User) => void): UseUpdateUserReturn {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const clearErrors = () => setErrors({});

  const updateUser = async (id: string, data: Partial<UserFormData>): Promise<User | null> => {
    // If full data is passed, validate fields
    if (data.name !== undefined || data.email !== undefined) {
      const { isValid, errors: validationErrors } = validateUserForm(data);
      if (!isValid) {
        setErrors(validationErrors);
        return null;
      }
    }

    try {
      setLoading(true);
      setErrors({});
      const updated = await userService.updateUser(id, data);
      if (onSuccess) {
        onSuccess(updated);
      }
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update user.";
      setErrors({ general: msg });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: string, role: UserRole): Promise<User | null> => {
    try {
      setLoading(true);
      setErrors({});
      const updated = await userService.updateRole(id, role);
      if (onSuccess) onSuccess(updated);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change user role.";
      setErrors({ general: msg });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: UserStatus): Promise<User | null> => {
    try {
      setLoading(true);
      setErrors({});
      const updated = await userService.updateStatus(id, status);
      if (onSuccess) onSuccess(updated);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change status.";
      setErrors({ general: msg });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const assignVehicles = async (id: string, vehicleIds: string[]): Promise<User | null> => {
    try {
      setLoading(true);
      setErrors({});
      const updated = await userService.assignVehicles(id, vehicleIds);
      if (onSuccess) onSuccess(updated);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to assign vehicles.";
      setErrors({ general: msg });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser,
    updateRole,
    updateStatus,
    assignVehicles,
    loading,
    errors,
    clearErrors,
  };
}
