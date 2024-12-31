import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createOrder,
  deleteOrder,
  getAllOrdersByUser,
  updatePayment,
} from "../services/OrderService";
import {
  IOrder,
  IOrderResponse,
  UpdatePaymentPayload,
  UpdatePaymentResponse,
} from "../types";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<IOrder, Error, any>({
    mutationFn: async (data: any) => {
      const order = await createOrder(data);

      console.log("Created Order:", order.data);

      return order.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      queryClient.invalidateQueries({ queryKey: ["GET_ORDERS"] });
      toast.success("Order placed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to place order.");
    },
  });
};

// Hook to fetch all orders by user
export const useGetAllOrdersByUser = (userId: string) => {
  return useQuery<IOrderResponse[], Error>({
    queryKey: ["GET_ORDERS", userId],
    queryFn: async () => {
      try {
        const orders = await getAllOrdersByUser(userId);

        return orders;
      } catch (error: any) {
        toast.error("Failed to fetch categories");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Hook to delete an order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return deleteOrder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_ORDERS"] });
      toast.success("Order deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete the order.");
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePaymentResponse, Error, UpdatePaymentPayload>({
    mutationFn: async (data: UpdatePaymentPayload) => {
      const res = await updatePayment(data);

      console.log("Update Payment: ", res);

      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_ORDERS"] });
      toast.success("Payment updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update payment.");
    },
  });
};
