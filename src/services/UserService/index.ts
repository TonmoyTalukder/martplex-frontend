import axiosInstance from '@/src/lib/AxiosInstance';

export const getSingleUser = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/user/${id}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
