import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCategory, getAllCategories } from "../services/CategoryService";

// Hook to fetch all categories
export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["GET_ALL_CATEGORIES"],
    queryFn: () => {
      try {
        const data = getAllCategories();

        return data;
      } catch (error: any) {
        toast.error("Failed to fetch categories");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Hook to create a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCategory: { name: string; description: string }) =>
      createCategory(newCategory),
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_CATEGORIES"] }); // Refresh category list
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });
};
