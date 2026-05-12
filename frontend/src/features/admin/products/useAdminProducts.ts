import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axios';
import { Product } from '../../../types/index';
import toast from 'react-hot-toast';

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const response = await api.get('/admin/products');
      return response.data.data.products as Product[];
    },
  });
};

export const useUpsertProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: any }) => {
      if (id) {
        const response = await api.put(`/admin/products/${id}`, data);
        return response.data.data.product;
      } else {
        const response = await api.post('/admin/products', data);
        return response.data.data.product;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Also invalidate customer cache
      toast.success('Product saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Save failed');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  });
};
export const useToggleProductAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      const response = await api.put(`/admin/products/${product.id}`, {
        isAvailable: !product.isAvailable
      });
      return response.data.data.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Toggle failed');
    }
  });
};
