import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { Order } from '../../types/index';
import toast from 'react-hot-toast';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      const response = await api.get('/orders/my-orders');
      return response.data.data.orders as Order[];
    },
  });
};

export const useOrderDetails = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`);
      return response.data.data.order as Order;
    },
    enabled: !!id,
  });
};

export const usePayOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/orders/${id}/pay`);
      return response.data.data.order;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders', order.id] });
      toast.success('Payment successful!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Payment failed');
    },
  });
};
