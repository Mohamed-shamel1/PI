import { create } from 'zustand';
import { User } from '../../types/index';
import axios from 'axios';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  setInitializing: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
  setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: !!accessToken }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setInitializing: (isInitializing) => set({ isInitializing }),

  logout: async () => {
    try {
      // Call backend to clear httpOnly cookie
      await axios.post('http://localhost:5000/api/v1/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
}));
