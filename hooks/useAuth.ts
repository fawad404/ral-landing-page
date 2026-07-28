'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, RegisterRequest } from '@/types/auth.types';
import { APP_ROUTES } from '@/api/endpoints';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: ({ token, user }) => {
      setAuth(token, user);
      toast.success('Welcome back!');
      switch (user.role) {
        case 'admin':   router.push(APP_ROUTES.ADMIN); break;
        case 'vendor':  router.push(APP_ROUTES.VENDOR); break;
        default:        router.push(APP_ROUTES.DASHBOARD); break;
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Invalid email or password');
    },
  });
}

export function useRegister(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      toast.success('Account created! Your account is pending admin approval. You will receive access once approved.');
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return () => {
    clearAuth();
    router.push(APP_ROUTES.HOME);
    toast.success('Signed out');
  };
}
