import axios from "axios";
import { cookies } from "next/headers";

import envConfig from "@/src/config/envConfig";

const axiosInstance = axios.create({
  baseURL: envConfig.baseApi,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies().get("accessToken")?.value; // Adjust based on how you access cookies

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axiosInstance.post("/auth/refresh-token", {
          refreshToken: cookies().get("refreshToken")?.value,
        });

        // Update cookies and retry the original request
        cookies().set("accessToken", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed. Redirecting to login...");

        // Optional: Redirect to login
        return Promise.reject(refreshError);
      }
    }

    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  },
);

export default axiosInstance;
