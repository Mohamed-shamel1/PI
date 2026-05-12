import { useMutation } from '@tanstack/react-query';
import api from '../../api/axios';
import { useCartStore } from '../cart/cartStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useCheckout = () => {
  const { clearCart, items } = useCartStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const payload = {
        ...orderData,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };
      console.log('Sending Order Payload:', payload);
      const response = await api.post('/orders', payload);
      return response.data.data;
    },
    onSuccess: (data) => {
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Checkout failed');
    },
  });
};
