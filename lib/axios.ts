'use client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_KEY } from '@/api/endpoints';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get(TOKEN_COOKIE_KEY);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global 401 handler — redirect to home only for authenticated requests, not auth endpoints
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error.config?.url ?? '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthEndpoint && typeof window !== 'undefined') {
      Cookies.remove(TOKEN_COOKIE_KEY);
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
