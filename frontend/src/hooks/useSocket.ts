import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../features/auth/authStore';

export const useSocket = () => {
  const { accessToken, user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!accessToken || !user) return;

    const newSocket = io('http://localhost:5000', {
      query: { userId: user.id },
      // Optional: auth: { token: accessToken }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken, user]);

  return socket;
};
