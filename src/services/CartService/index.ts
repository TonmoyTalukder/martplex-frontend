'use server';

import { cookies } from 'next/headers';
import axiosInstance from '@/src/lib/AxiosInstance';

// Create a new cart
export const createCart = async (payload: any) => {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.post('/cart/create-cart', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error creating cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to create cart.');
  }
};

// Fetch cart by ID
export const fetchCart = async (id: string) => {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.get(`/cart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cart.');
  }
};

// Update cart by ID
export const updateCart = async (id: string, payload: any) => {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.post(
      `/cart/${id}/update-cart`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to update cart.');
  }
};

// Update a specific cart item by ID
export const updateCartItem = async (id: string, payload: any) => {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.put(
      `/cart/cart-item/${id}/update`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to update cart item.',
    );
  }
};

// Delete a specific cart item by ID
export const deleteCartItem = async (id: string) => {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const response = await axiosInstance.patch(`/cart/cart-item/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error deleting cart item:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to delete cart item.',
    );
  }
};
