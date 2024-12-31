'use server';

import { cookies } from 'next/headers';

import { getAccessToken } from '../AuthService';

import axiosInstance from '@/src/lib/AxiosInstance';

export const getAllProducts = async () =>
  // search: string,
  // category: string,
  {
    try {
      const { data } = await axiosInstance.get(
        `/product`, // ?searchTerm=${search}&category=${category}
      );

      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch products',
      );
    }
  };

export const getSingleProduct = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/product/${id}`);

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch product details',
    );
  }
};

export const createProduct = async (productData: FormData) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const { data } = await axiosInstance.post(
      '/product/create-product',
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to create product',
    );
  }
};

export const updateProduct = async (id: string, productData: FormData) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('Access token is missing. Please log in again.');
  }

  try {
    const { data } = await axiosInstance.patch(
      `/product/${id}/update-product`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update product',
    );
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/product/${id}/soft-delete`, {
      headers: {
        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw new Error(error);
  }
};
