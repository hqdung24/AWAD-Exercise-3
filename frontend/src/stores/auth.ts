import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

type State = {
  isAuthenticated: boolean;
  accessToken?: string;
};

type Action = {
  setAuthenticated: (ok: boolean) => void;
  setToken: (t?: string) => void;
  logout: () => void;
};

export const useAuthStore = create<State & Action>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        isAuthenticated: false,
        accessToken: undefined,
        setAuthenticated: (ok) => set({ isAuthenticated: ok }),
        setToken: (t) => set({ accessToken: t }),
        logout: () => set({ isAuthenticated: false, accessToken: undefined }),
      }),
      {
        name: 'auth-store',
        // chỉ persist field cần thiết
        partialize: (s) => ({
          isAuthenticated: s.isAuthenticated,
          accessToken: s.accessToken,
        }),
      }
    )
  )
);
