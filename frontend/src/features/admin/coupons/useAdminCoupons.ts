import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

export const ADMIN_COUPONS_KEY = ['admin', 'coupons'];

export const useAdminCoupons = () => {
  return useQuery({
    queryKey: ADMIN_COUPONS_KEY,
    queryFn: async () => {
      const response = await api.get('/admin/coupons');
      return response.data.data.coupons;
    }
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/admin/coupons', data);
      return response.data.data.coupon;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_KEY });
      toast.success('Coupon created!');
    }
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await api.patch(`/admin/coupons/${id}`, data);
      return response.data.data.coupon;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_KEY });
      toast.success('Coupon updated!');
    }
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_KEY });
      toast.success('Coupon deleted!');
    }
  });
};
