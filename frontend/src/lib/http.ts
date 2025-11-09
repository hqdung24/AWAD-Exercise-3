import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export const http = axios.create({
  baseURL: 'http://localhost:3000', // hoặc process.env.NEXT_PUBLIC_API_URL
  withCredentials: true,
});

// Gắn accessToken (nếu SPA token-based)
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
