import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axios';
import { Order } from '../../../types/index';
import toast from 'react-hot-toast';

export const ADMIN_ORDERS_KEY = ['admin', 'orders'];

export const useAdminOrders = () => {
  console.log('Fetching Admin Orders with Key:', ADMIN_ORDERS_KEY);
  return useQuery({
    queryKey: ADMIN_ORDERS_KEY,
    queryFn: async () => {
      const response = await api.get('/admin/orders');
      return response.data.data.orders as Order[];
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.put(`/admin/orders/${id}/status`, { status });
      return response.data.data.order;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', order.id] });
      toast.success('Order status updated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Update failed');
    },
  });
};
