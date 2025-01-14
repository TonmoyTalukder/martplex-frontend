'use server';

import { cookies } from 'next/headers';

import axiosInstance from '@/src/lib/AxiosInstance';

export const getAllUser = async () => {
  try {
    const { data } = await axiosInstance.get(`/user/`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
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
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update profile.',
    );
  }
};

export const becomeVendor = async (id: string) => {
  try {
    const { data } = await axiosInstance.patch(`/user/${id}/become-vendor`, {
      headers: {
        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
      },
      withCredentials: true,
    });

    if (data.success) {
      cookies().set('accessToken', data?.result?.accessToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update role.');
  }
};

export const blockUser = async (id: string, payload: boolean) => {
  try {
    const { data } = await axiosInstance.patch(`/user/${id}/block`, payload, {
      headers: {
        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
      },
      withCredentials: true,
    });

    if (data.success) {
      cookies().set('accessToken', data?.result?.accessToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to block user.');
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { data } = await axiosInstance.patch(`/user/${id}/soft-delete`, {
      headers: {
        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
      },
      withCredentials: true,
    });

    if (data.success) {
      cookies().set('accessToken', data?.result?.accessToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete user.');
  }
};

export const createAdmin = async (payload: any) => {
  try {
    const { data } = await axiosInstance.post(`/user/create-admin`, payload, {
      headers: {
        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
      },
      withCredentials: true,
    });

    if (data.success) {
      cookies().set('accessToken', data?.result?.accessToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create admin.');
  }
};
