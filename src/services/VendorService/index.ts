'use server';

import axiosInstance from '@/src/lib/AxiosInstance';

export const getAllVendorStands = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/vendor-stand?ownerId=${id}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSingleVendorStand = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/vendor-stand/${id}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getProductsByVendorStand = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/product?vendorStandId=${id}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createVendorStand = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      '/vendor-stand/create-vendor-stand',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw new Error(error);
  }
};

export const deleteVendorStand = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      `/vendor-stand/${id}/soft-delete`,
    );

    return response.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw new Error(error);
  }
};
