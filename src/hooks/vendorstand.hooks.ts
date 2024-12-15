import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createVendorStand,
  deleteVendorStand,
  getAllVendorStands,
  getProductsByVendorStand,
} from '../services/VendorService';

import { getSingleVendorStand } from './../services/VendorService/index';

export const useGetAllVendorStands = (id: string) => {
  return useQuery({
    queryKey: ['GET_ALL_VENDOR_STANDS', id],
    queryFn: () => {
      try {
        console.log('Sending id... ', id);

        const data = getAllVendorStands(id);

        console.log('Vendor Stands data from hooks =>', data);

        return data;
      } catch (error) {
        toast.error('Failed to fetch Vendor Stands data.');
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useGetSingleVendorStand = (id: string) => {
  return useQuery({
    queryKey: ['GET_SINGLE_VENDOR_STANDS', id],
    queryFn: () => {
      try {
        console.log('Sending id... ', id);

        const data = getSingleVendorStand(id);

        console.log('Vendor Stand data from hooks =>', data);

        return data;
      } catch (error) {
        toast.error('Failed to fetch Vendor Stands data.');
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useGetProductsByVendorStand = (id: string) => {
  return useQuery({
    queryKey: ['GET_SINGLE_VENDOR_STANDS', id],
    queryFn: () => {
      try {
        console.log('Sending id... ', id);

        const data = getProductsByVendorStand(id);

        console.log('Products by Vendor Stand data from hooks =>', data);

        return data;
      } catch (error) {
        toast.error('Failed to fetch Products by Vendor Stands data.');
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useCreateVendorStand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      console.log(data.get('data'));

      return createVendorStand(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_ALL_VENDOR_STANDS'] });
      toast.success('Vendor Stand created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create vendor stand.');
    },
  });
};

export const useDeleteVendorStand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return deleteVendorStand(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_ALL_VENDOR_STANDS'] });
      toast.success('Vendor Stand deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vendor stand.');
    },
  });
};
