import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useZones = () => {
  return useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const response = await api.get('/logistics');
      return response.data.data.zones;
    }
  });
};
