import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  becomeVendor,
  getSingleUser,
  updateProfile,
} from "../services/UserService";

// Fetch single user
export const useGetSingleUser = (id: string) => {
  return useQuery({
    queryKey: ["GET_SINGLE_USER", id],
    queryFn: () => {
      try {
        console.log("Sending id... ", id);

        const data = getSingleUser(id);

        console.log("User data from hooks =>", data);

        return data;
      } catch (error) {
        toast.error("Failed to fetch user data.");
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; formData: FormData }) =>
      updateProfile(data.id, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_SINGLE_USER"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile.");
    },
  });
};

export const useBecomeVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => becomeVendor(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_SINGLE_USER"] });
      toast.success("Role updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update role.");
    },
  });
};
