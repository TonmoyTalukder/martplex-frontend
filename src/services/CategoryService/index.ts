"use server";

import { cookies } from "next/headers";

import axiosInstance from "@/src/lib/AxiosInstance";

export const getAllCategories = async () => {
  try {
    const { data } = await axiosInstance.get("/category");

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createCategory = async (categoryData: {
  name: string;
  description: string;
}) => {
  try {
    const { data } = await axiosInstance.post(
      "/category/create-category",
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
        },
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
