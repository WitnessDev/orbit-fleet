import { useState } from "react";
import { userService } from "@/lib/users/userService";

interface UseDeleteUserReturn {
  deleteUser: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteUser(onSuccess?: (deletedId: string) => void): UseDeleteUserReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await userService.deleteUser(id);
      if (success && onSuccess) {
        onSuccess(id);
      }
      return success;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete user account.";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteUser,
    loading,
    error,
  };
}
