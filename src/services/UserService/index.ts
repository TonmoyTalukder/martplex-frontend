"use server";

import { cookies } from "next/headers";

import axiosInstance from "@/src/lib/AxiosInstance";

export const getSingleUser = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/user/${id}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateProfile = async (id: string, formData: FormData) => {
  try {
    const { data } = await axiosInstance.patch(
      `/user/${id}/update-my-profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile.",
    );
  }
};

export const becomeVendor = async (id: string) => {
  try {
    const { data } = await axiosInstance.patch(`/user/${id}/become-vendor`, {
      headers: {
        Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
      },
      withCredentials: true,
    });

    if (data.success) {
      cookies().set("accessToken", data?.result?.accessToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update role.");
  }
};
