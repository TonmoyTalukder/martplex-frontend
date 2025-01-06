"use server";

import { cookies } from "next/headers";

import { getAccessToken } from "../AuthService";

import axiosInstance from "@/src/lib/AxiosInstance";

export const getAllReviews = async () => {
  try {
    const { data } = await axiosInstance.get(`/review`);

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch reviews");
  }
};

export const createReview = async (reviewData: any) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const { data } = await axiosInstance.post("/review/create", reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create review");
  }
};

export const updateReview = async (id: string, reviewData: any) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const { data } = await axiosInstance.patch(
      `/review/${id}/update`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update review");
  }
};

export const deleteReview = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/review/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.log("error: ", error);
    throw new Error(error);
  }
};

// Reply

export const createReply = async (replyData: any) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const { data } = await axiosInstance.post(
      "/review/reply/create",
      replyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create reply");
  }
};

export const updateReply = async (id: string, replyData: any) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please log in again.");
  }

  try {
    const { data } = await axiosInstance.patch(
      `/review/reply/${id}/update`,
      replyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update reply");
  }
};

export const deleteReply = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/review/reply/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.log("error: ", error);
    throw new Error(error);
  }
};
