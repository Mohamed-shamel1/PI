import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { Category, Product } from '../../types/index';

export const useMenu = () => {
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data.data.categories as Category[];
    },
  });

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data.data.products as Product[];
    },
  });

  return {
    categories: categoriesQuery.data || [],
    products: productsQuery.data || [],
    isLoading: categoriesQuery.isLoading || productsQuery.isLoading,
    isError: categoriesQuery.isError || productsQuery.isError,
  };
};
