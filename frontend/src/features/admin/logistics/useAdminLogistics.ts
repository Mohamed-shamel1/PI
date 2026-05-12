import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

export const ADMIN_LOGISTICS_KEY = ['admin', 'logistics'];

export const useAdminLogistics = () => {
  return useQuery({
    queryKey: ADMIN_LOGISTICS_KEY,
    queryFn: async () => {
      const response = await api.get('/admin/logistics');
      return response.data.data.zones;
    }
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/admin/logistics', data);
      return response.data.data.zone;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LOGISTICS_KEY });
      toast.success('Delivery zone created!');
    }
  });
};

export const useUpdateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await api.patch(`/admin/logistics/${id}`, data);
      return response.data.data.zone;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LOGISTICS_KEY });
      toast.success('Delivery zone updated!');
    }
  });
};

export const useDeleteZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/logistics/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LOGISTICS_KEY });
      toast.success('Delivery zone deleted!');
    }
  });
};
