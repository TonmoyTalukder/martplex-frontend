"use server";

import { getAccessToken } from "../AuthService";

import axiosInstance from "@/src/lib/AxiosInstance";

// Create a new Coupon
export const createCoupon = async (payload: any): Promise<{ data: any }> => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const response = await axiosInstance.post(
      "/coupon/create-coupon",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create coupon.",
    );
  }
};

// Fetch Coupons
export const getAllCoupons = async (): Promise<any> => {
  try {
    const { data } = await axiosInstance.get(`/coupon/`);

    return data.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Update Coupon
export const updateCoupon = async (payload: any) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const response = await axiosInstance.patch(
      "/coupon/update-coupon",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating coupon:", error);

    throw new Error(
      error.response?.data?.message || "Failed to update coupon.",
    );
  }
};

// Delete Coupon
export const deleteCoupon = async (id: string) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const response = await axiosInstance.patch(`/coupon/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error deleting coupon: ", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete coupon.",
    );
  }
};
