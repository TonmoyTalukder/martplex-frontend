'use server';

import { cookies } from 'next/headers';

import axiosInstance from '@/src/lib/AxiosInstance';
import { IOrder, IOrderResponse, UpdatePaymentPayload } from '@/src/types';

// Create a new order
export const createOrder = async (payload: any): Promise<{ data: IOrder }> => {
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

// Fetch Orders by User
export const getAllOrdersByUser = async (
  id: string,
): Promise<IOrderResponse[]> => {
  try {
    const { data } = await axiosInstance.get(`/order?userId=${id}`);

    return data.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Delete Order
export const deleteOrder = async (id: string) => {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.patch(`/order/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error deleting order: ', error);
    throw new Error(error.response?.data?.message || 'Failed to delete order.');
  }
};

// Update Payment
export const updatePayment = async (payload: UpdatePaymentPayload) => {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.patch(
      '/payment/update/payment-method',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating payment:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to update payment.',
    );
  }
};
