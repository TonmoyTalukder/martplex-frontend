"use server";

import { getAccessToken } from "../AuthService";

import axiosInstance from "@/src/lib/AxiosInstance";
import { IOrder, IOrderResponse, UpdatePaymentPayload } from "@/src/types";

// Create a new order
export const createOrder = async (payload: any): Promise<{ data: IOrder }> => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const response = await axiosInstance.post("/order/create-order", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(error.response?.data?.message || "Failed to create order.");
  }
};

// Fetch Orders
export const getAllOrders = async (): Promise<IOrderResponse[]> => {
  try {
    const { data } = await axiosInstance.get(`/order/`);

    return data.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Update Order Status
export const updateOrderStatus = async (payload: any) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const response = await axiosInstance.patch(
      "/order/update-order-status",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating order status:", error);

    throw new Error(
      error.response?.data?.message || "Failed to update order status.",
    );
  }
};

// Delete Order
export const deleteOrder = async (id: string) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const response = await axiosInstance.patch(`/order/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error deleting order: ", error);
    throw new Error(error.response?.data?.message || "Failed to delete order.");
  }
};

// Update Payment
export const updatePayment = async (payload: UpdatePaymentPayload) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const response = await axiosInstance.patch(
      "/payment/update/payment-method",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating payment:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update payment.",
    );
  }
};
