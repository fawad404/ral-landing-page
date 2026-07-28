import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { AuthUser, UserRole } from '@/types/auth.types';
import { TOKEN_COOKIE_KEY } from '@/api/endpoints';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  getRole: () => UserRole | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        Cookies.set(TOKEN_COOKIE_KEY, token, { expires: 7, sameSite: 'lax' });
        set({ token, user, isAuthenticated: true });
      },

      clearAuth: () => {
        Cookies.remove(TOKEN_COOKIE_KEY);
        set({ token: null, user: null, isAuthenticated: false });
      },

      getRole: () => get().user?.role ?? null,
    }),
    {
      name: 'ral_connect_auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
