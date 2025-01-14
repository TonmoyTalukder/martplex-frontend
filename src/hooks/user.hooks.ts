import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  becomeVendor,
  blockUser,
  createAdmin,
  deleteUser,
  getAllUser,
  getSingleUser,
  updateProfile,
} from '../services/UserService';

// Fetch single user
export const useGetAlleUser = () => {
  return useQuery({
    queryKey: ['GET_ALL_USERS'],
    queryFn: () => {
      try {
        const data = getAllUser();

        console.log('User data from hooks =>', data);

        return data;
      } catch (error) {
        toast.error('Failed to fetch user data.');
        throw error;
      }
    },
  });
};

// Fetch single user
export const useGetSingleUser = (id: string) => {
  return useQuery({
    queryKey: ['GET_SINGLE_USER', id],
    queryFn: () => {
      try {
        console.log('Sending id... ', id);

        const data = getSingleUser(id);

        console.log('User data from hooks =>', data);

        return data;
      } catch (error) {
        toast.error('Failed to fetch user data.');
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; formData: FormData }) =>
      updateProfile(data.id, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_SINGLE_USER'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile.');
    },
  });
};

export const useBecomeVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => becomeVendor(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_SINGLE_USER'] });
      toast.success('Role updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update role.');
    },
  });
};
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; block: boolean }) =>
      blockUser(data.id, data.block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_ALL_USERS'] });
      toast.success('Blocked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to block user.');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => deleteUser(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_ALL_USERS'] });
      toast.success('Deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user.');
    },
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => createAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_ALL_USERS'] });
      toast.success('Created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to block user.');
    },
  });
};
