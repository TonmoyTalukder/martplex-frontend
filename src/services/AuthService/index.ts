"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

import axiosInstance from "@/src/lib/AxiosInstance";
import ApiError from "@/src/utils/error";

export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    console.log("error: ", error);
    throw new Error(error);
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      // cookies().set('refreshToken', data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const forgetPassword = async (email: string) => {
  try {
    const { data } = await axiosInstance.post("/auth/forgot-password", {
      email,
    });

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        "An error occurred during password recovery.",
    );
  }
};

export const resetPassword = async (
  token: string,
  id: string,
  newPassword: string,
) => {
  try {
    const { data } = await axiosInstance.post(`/auth/reset-password/${token}`, {
      id,
      password: newPassword,
    });

    return data;
  } catch (error: any) {
    const status = error.response?.status || 500; // Default to 500 if no status
    const message =
      error.response?.data?.message || "An unexpected error occurred.";

    // Throwing an ApiError instance
    throw new ApiError(status, message);
  }
};

export const verify = async (email: string, code: string) => {
  try {
    const { data } = await axiosInstance.post(`/auth/verify`, {
      email,
      code,
    });

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      // cookies().set('refreshToken', data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status || 500; // Default to 500 if no status
    const message =
      error.response?.data?.message || "An unexpected error occurred.";

    // Throwing an ApiError instance
    throw new ApiError(status, message);
  }
};

export const changePassword = async (passwordData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(
      "/auth/change-password",
      {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
        },
        withCredentials: true,
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to change password.",
    );
  }
};

export const logout = () => {
  const allCookies = cookies(); // Get all cookies

  if (!allCookies) return; // Ensure cookies are available

  // Delete specific tokens
  cookies().delete("accessToken");
  cookies().delete("refreshToken");

  // Delete all other cookies
  Object.keys(allCookies).forEach((cookieName) => {
    cookies().delete(cookieName);
  });
};

// export const getCurrentUser = async () => {
//   let accessToken = cookies().get('accessToken')?.value;

//   try {
//     if (!accessToken) {
//       const response = await axiosInstance.post('/refresh-token');

//       accessToken = response.data?.data?.accessToken;

//       if (accessToken) {
//         cookies().set('accessToken', accessToken);
//       } else {
//         return null;
//       }
//     }

//     // Decode the access token to extract user details
//     const decodedToken = await jwtDecode<IUser>(accessToken);
//     const userData = {
//       id: decodedToken.id,
//       email: decodedToken.email,
//       role: decodedToken.role,
//       isVerified: decodedToken.isVerified,
//     };

//     return userData;
//   } catch (error) {
//     console.error('Failed to get current user:', error);

//     return null;
//   }
// };

interface ICurrentUser {
  id: string;
  email: string;
  role: string;
  profilePhoto: string | null;
  isVerified: boolean;
  exp: number;
}

export const getCurrentUser: () => Promise<ICurrentUser | null> = async () => {
  let accessToken = cookies().get("accessToken")?.value;

  try {
    if (!accessToken) {
      const response = await axiosInstance.post("/auth/refresh-token");

      accessToken = response.data?.data?.accessToken;

      if (accessToken) {
        cookies().set("accessToken", accessToken);
      } else {
        return null;
      }
    }

    // Decode the access token to extract user details
    const decodedToken = jwtDecode<ICurrentUser>(accessToken);

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeToExpire = decodedToken.exp - currentTime;

    // Check if the token is expired or will expire in 5 minutes
    if (timeToExpire <= 300) {
      // 5 minutes = 300 seconds
      const response = await axiosInstance.post("/auth/refresh-token");

      accessToken = response.data?.data?.accessToken;

      if (accessToken) {
        cookies().set("accessToken", accessToken);

        return getCurrentUser(); // Recursively fetch the user with the new token
      } else {
        return null;
      }
    }

    let avatarUrl = "";

    if (decodedToken.profilePhoto === null) {
      avatarUrl = "https://i.ibb.co/wcv1QBQ/5951752.png";
    } else {
      avatarUrl = decodedToken.profilePhoto;
    }

    const userData: ICurrentUser = {
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role,
      profilePhoto: avatarUrl,
      isVerified: decodedToken.isVerified,
      exp: decodedToken.exp, // Include `exp` if you want it available in the return value
    };

    return userData;
  } catch (error) {
    console.error("Failed to get current user:", error);

    return null;
  }
};

export const getAccessToken: () => Promise<string | null> = async () => {
  let accessToken = cookies().get("accessToken")?.value;

  try {
    if (accessToken) {
      // Decode the token to check its expiration
      const decodedToken = jwtDecode<ICurrentUser>(accessToken);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const timeToExpire = decodedToken.exp - currentTime;

      // If the token is valid for more than 5 minutes, return it
      if (timeToExpire > 300) {
        return accessToken;
      }
    }

    // If no token or the token is expiring within 5 minutes, refresh it
    const response = await axiosInstance.post("/auth/refresh-token");

    accessToken = response.data?.data?.accessToken;

    if (accessToken) {
      cookies().set("accessToken", accessToken);

      return accessToken;
    }

    return null;
  } catch (error) {
    console.error("Failed to get access token:", error);

    return null;
  }
};
