'use server';

import { getAccessToken } from '../AuthService';

import axiosInstance from '@/src/lib/AxiosInstance';

// Create a new FlashSale
export const createFlashSale = async (payload: any): Promise<{ data: any }> => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.post('/flash-sale/create', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error creating flash sale:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to create flash sale.',
    );
  }
};

// Fetch FlashSales
export const getAllFlashSales = async (): Promise<any> => {
  try {
    const { data } = await axiosInstance.get(`/flash-sale/`);

    return data.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Update FlashSale
export const updateFlashSale = async (payload: any) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.put('/flash-sale/update', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error updating flash sale:', error);

    throw new Error(
      error.response?.data?.message || 'Failed to update flash sale.',
    );
  }
};

// Delete FlashSale
export const deleteFlashSale = async (id: string) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.patch(`/flash-sale/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error deleting flash sale: ', error);
    throw new Error(
      error.response?.data?.message || 'Failed to delete flash sale.',
    );
  }
};
