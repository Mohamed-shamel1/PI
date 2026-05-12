import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './authStore';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore(state => state.setUser);

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.patch(
        '/auth/updateMe', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      return data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Profile updated successfully');
      // Update local state and authStore
      if (res.data?.user) {
        setUser(res.data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};
