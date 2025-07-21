import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name?: string;
}
interface AuthState {
  user: User | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  initialize: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setGuestMode: () => void;
  clearGuestMode: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isGuest: false,
      isAuthenticated: false,
      accessToken: null,

      // 초기화 시 토큰이 있으면 인증 상태 복원
      initialize: () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken");
          const authStorage = localStorage.getItem("auth-storage");

          if (token && authStorage) {
            try {
              const authData = JSON.parse(authStorage);
              if (authData.state?.isAuthenticated && authData.state?.user) {
                console.log("🔄 인증 상태 복원:", authData.state);
                set({
                  user: authData.state.user,
                  isAuthenticated: true,
                  isGuest: false,
                  accessToken: token,
                });
              }
            } catch (error) {
              console.error("인증 상태 복원 실패:", error);
            }
          }
        }
      },

      login: (user: User, token: string) =>
        set({
          user,
          isAuthenticated: true,
          isGuest: false,
          accessToken: token,
        }),

      logout: () => {
        // 로컬 스토리지에서 모든 인증 관련 데이터 제거
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("auth-storage");
        }

        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
          accessToken: null,
        });
      },

      setGuestMode: () =>
        set({
          user: null,
          isAuthenticated: false,
          isGuest: true,
          accessToken: null,
        }),

      clearGuestMode: () =>
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
          accessToken: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: false, // hydration 활성화
      partialize: (state) => ({
        user: state.user,
        isGuest: state.isGuest,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);

export { useAuthStore };
export type { User, AuthState };
