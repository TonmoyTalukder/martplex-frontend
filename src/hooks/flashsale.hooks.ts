import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createFlashSale,
  deleteFlashSale,
  getAllFlashSales,
  updateFlashSale,
} from '../services/FlashSaleService';

export const useCreateFlashSale = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      const result = await createFlashSale(data);

      console.log('Created Flash Sale:', result.data);

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_FLASH_SALES'] });
      toast.success('Flash sale created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create flash sale.');
    },
  });
};

// Hook to fetch all flash sales
export const useGetAllFlashSales = () => {
  return useQuery<any[], Error>({
    queryKey: ['GET_FLASH_SALES'],
    queryFn: async () => {
      try {
        const result = await getAllFlashSales();

        return result;
      } catch (error: any) {
        toast.error('Failed to fetch flash sales.');
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useUpdateFlashSale = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      console.log('Sending update flash sale: ');

      const res = await updateFlashSale(data);

      console.log('Updated Flash Sale: ', res);

      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['GET_FLASH_SALES'] });
      toast.success('Flash Sale updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update flash sale.');
    },
  });
};

// Hook to delete a flash sale
export const useDeleteFlashSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return deleteFlashSale(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_FLASH_SALES'] });
      toast.success('Flash sale deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete the flash sale.');
    },
  });
};
