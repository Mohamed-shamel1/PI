import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore.js';
import api from '../../api/axios';

export const AuthWrapper = () => {
  const { setAuth, setInitializing, isInitializing } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        const { user } = response.data.data;
        
        try {
          const refreshRes = await api.post('/auth/refresh');
          const { accessToken } = refreshRes.data.data;
          setAuth(user, accessToken);
        } catch {
          setAuth(user, ''); 
        }
      } catch (error) {
        console.log('No active session found');
      } finally {
        setInitializing(false);
      }
    };

    initAuth();
  }, [setAuth, setInitializing]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">Initializing Session...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
