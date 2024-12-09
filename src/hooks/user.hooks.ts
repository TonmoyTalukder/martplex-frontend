import { useQuery } from '@tanstack/react-query';
import { getSingleUser } from '../services/UserService';
import { toast } from 'sonner';

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
