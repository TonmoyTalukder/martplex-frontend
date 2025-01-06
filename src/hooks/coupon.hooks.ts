import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "../services/CouponService";

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      const result = await createCoupon(data);

      console.log("Created Coupon:", result.data);

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_COUPONS"] });
      toast.success("Coupon placed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to place coupon.");
    },
  });
};

// Hook to fetch all coupons by user
export const useGetAllCoupons = () => {
  return useQuery<any[], Error>({
    queryKey: ["GET_COUPONS"],
    queryFn: async () => {
      try {
        const result = await getAllCoupons();

        return result;
      } catch (error: any) {
        toast.error("Failed to fetch coupons.");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      console.log("Sending update coupon: ");

      const res = await updateCoupon(data);

      console.log("Updated Coupon: ", res);

      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_COUPONS"] });
      toast.success("Coupon updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update coupon.");
    },
  });
};

// Hook to delete an coupon
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return deleteCoupon(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_COUPONS"] });
      toast.success("Coupon deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete the coupon.");
    },
  });
};
