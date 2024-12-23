'use server';

import axiosInstance from '@/src/lib/AxiosInstance';
import { cookies } from 'next/headers';

// Create a new order
export const createOrder = async (payload: any) => {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.post('/order/create-order', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw new Error(error.response?.data?.message || 'Failed to create order.');
  }
};
