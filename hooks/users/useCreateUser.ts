import { useState } from "react";
import type { User } from "@/types/user";
import { userService } from "@/lib/users/userService";
import { validateUserForm, type UserFormData, type ValidationErrors } from "@/lib/users/userValidation";

interface UseCreateUserReturn {
  createUser: (data: UserFormData) => Promise<User | null>;
  loading: boolean;
  errors: ValidationErrors;
  clearErrors: () => void;
}

export function useCreateUser(onSuccess?: (user: User) => void): UseCreateUserReturn {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const clearErrors = () => setErrors({});

  const createUser = async (data: UserFormData): Promise<User | null> => {
    const { isValid, errors: validationErrors } = validateUserForm(data);
    if (!isValid) {
      setErrors(validationErrors);
      return null;
    }

    try {
      setLoading(true);
      setErrors({});
      const created = await userService.createUser(data);
      if (onSuccess) {
        onSuccess(created);
      }
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create user account.";
      setErrors({ general: msg });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    loading,
    errors,
    clearErrors,
  };
}
