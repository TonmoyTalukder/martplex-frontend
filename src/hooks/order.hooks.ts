import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createOrder } from '../services/OrderService';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      return createOrder(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_ORDERS'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to place order.');
    },
  });
};
