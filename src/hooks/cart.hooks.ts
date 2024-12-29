import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createCart,
  fetchCart,
  updateCart,
  updateCartItem,
  deleteCartItem,
} from '../services/CartService';

export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      return createCart(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_CART'] });
      toast.success('Item added to the cart successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add item to the cart.');
    },
  });
};

export const useFetchCart = (id: string) => {
  return useQuery({
    queryKey: ["GET_CART"],
    // queryFn: fetchCart(id),
    queryFn: () => {
      const data = fetchCart(id);
      
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Hook for updating a cart
export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      return updateCart(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_CART'] });
      toast.success('Cart updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update the cart.');
    },
  });
};

// Hook for updating a specific cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      return updateCartItem(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_CART'] });
      toast.success('Cart item updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update the cart item.');
    },
  });
};

// Hook for deleting a specific cart item
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return deleteCartItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_CART'] });
      toast.success('Cart item deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete the cart item.');
    },
  });
};
