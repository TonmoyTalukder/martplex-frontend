import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createRecentProduct,
  getAllRecentProducts,
} from "../services/ProductService";

// Fetch all products
export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["GET_ALL_PRODUCTS"],
    queryFn: () => {
      try {
        return getAllProducts();
      } catch (error) {
        toast.error("Failed to fetch products");
        throw error;
      }
    },
  });
};

// Fetch a single product by ID
export const useGetSingleProduct = (id: string) => {
  return useQuery({
    queryKey: ["GET_SINGLE_PRODUCT", id],
    queryFn: () => {
      try {
        return getSingleProduct(id);
      } catch (error) {
        toast.error("Failed to fetch product details");
        throw error;
      }
    },
    enabled: !!id,
  });
};

// Create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createProduct(formData), // Call the API
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_PRODUCTS"] });
      toast.success("Product created successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create product.";

      toast.error(errorMessage);
    },
  });
};

// Update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateProduct(id, formData),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_PRODUCTS"] });
    },
    onError: (error: any) => {
      console.error("Update failed:", error);
      toast.error("Failed to update product");
    },
  });
};

// Delete (soft delete) a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return deleteProduct(id);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_PRODUCTS"] });
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });
};

// Create a new recent product
export const useCreateRecentProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn: (data: any) => createRecentProduct(data), // Call the API
    mutationFn: (data: any) => {
      console.log("Recent Data Creating: ", data);

      return createRecentProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_RECENT_PRODUCTS"] });
      // toast.success('Product created successfully!');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create product.";

      // toast.error(errorMessage);
    },
  });
};

export const useGetAllRecentProducts = () => {
  return useQuery({
    queryKey: ["GET_ALL_RECENT_PRODUCTS"],
    queryFn: () => {
      try {
        return getAllRecentProducts();
      } catch (error) {
        // toast.error('Failed to fetch recent products');
        throw error;
      }
    },
  });
};
