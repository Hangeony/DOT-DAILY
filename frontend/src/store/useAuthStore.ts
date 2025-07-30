import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  isInitialized: boolean;

  initialize: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setGuestMode: () => void;
  clearGuestMode: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isGuest: false,
      isAuthenticated: false,
      accessToken: null,
      isInitialized: false,

      // 초기화 시 토큰이 있으면 인증 상태 복원
      initialize: () => {
        // 이미 초기화되었다면 스킵
        if (get().isInitialized) {
          return;
        }

        // 서버 사이드에서는 초기화하지 않음
        if (typeof window === "undefined") {
          set({
            user: null,
            isAuthenticated: false,
            isGuest: false,
            accessToken: null,
            isInitialized: true,
          });
          return;
        }

        const token = localStorage.getItem("accessToken");
        const authStorage = localStorage.getItem("auth-storage");

        if (token && authStorage) {
          try {
            const authData = JSON.parse(authStorage);

            if (authData.state?.isAuthenticated && authData.state?.user) {
              set({
                user: authData.state.user,
                isAuthenticated: true,
                isGuest: false,
                accessToken: token,
                isInitialized: true,
              });
              return;
            }

            if (authData.state?.isGuest) {
              set({
                user: null,
                isAuthenticated: false,
                isGuest: true,
                accessToken: null,
                isInitialized: true,
              });
              return;
            }
          } catch {
            // 파싱 실패 시 기본값으로 진행
          }
        }

        // 기본값으로 초기화
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
          accessToken: null,
          isInitialized: true,
        });
      },

      login: (user: User, token: string) =>
        set({
          user,
          isAuthenticated: true,
          isGuest: false,
          accessToken: token,
          isInitialized: true,
        }),

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
          accessToken: null,
          isInitialized: true,
        });
      },

      setGuestMode: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        set({
          user: null,
          isAuthenticated: false,
          isGuest: true,
          accessToken: null,
          isInitialized: true,
        });
      },

      clearGuestMode: () =>
        set({
          isGuest: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
