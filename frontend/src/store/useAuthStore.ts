import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  email: string;
  username?: string;
  name?: string;
  image?: string;
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

          console.log("🔄 인증 상태 초기화 시작:", {
            token: !!token,
            authStorage: !!authStorage,
          });

          if (token && authStorage) {
            try {
              const authData = JSON.parse(authStorage);

              // 파싱 성공 시에만 로그 출력
              if (authData.state) {
                console.log("📊 auth-storage 파싱 성공:", authData.state);
              }

              if (authData.state?.isAuthenticated && authData.state?.user) {
                console.log("✅ 인증 상태 복원:", authData.state);
                set({
                  user: authData.state.user,
                  isAuthenticated: true,
                  isGuest: false,
                  accessToken: token,
                });
                return;
              }

              if (authData.state?.isGuest) {
                console.log("🎮 게스트 모드 복원");
                set({
                  user: null,
                  isAuthenticated: false,
                  isGuest: true,
                  accessToken: null,
                });
                return;
              }
            } catch (error) {
              console.warn("⚠️ auth-storage 파싱 실패, 기본값 사용:", error);
              // 파싱 실패 시 기본값으로 초기화
              set({
                user: null,
                isAuthenticated: false,
                isGuest: false,
                accessToken: null,
              });
            }
          }

          console.log("🚫 인증 데이터 없음 - 초기 상태 유지");
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
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
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
          isGuest: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
