"use server";

import { cookies } from "next/headers";

import axiosInstance from "@/src/lib/AxiosInstance";

export const getAllVendorStands = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/vendor-stand?ownerId=${id}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getVendorStands = async () => {
  try {
    const { data } = await axiosInstance.get(`/vendor-stand`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSingleVendorStand = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/vendor-stand/${id}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getProductsByVendorStand = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/product?vendorStandId=${id}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createVendorStand = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      "/vendor-stand/create-vendor-stand",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.log("error: ", error);
    throw new Error(error);
  }
};

export const updateVendorStand = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.patch(
      `/vendor-stand/${id}/update-vendor-stand`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating vendor stand:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update vendor stand.",
    );
  }
};

export const deleteVendorStand = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      `/vendor-stand/${id}/soft-delete`,
    );

    return response.data;
  } catch (error: any) {
    console.log("error: ", error);
    throw new Error(error);
  }
};
