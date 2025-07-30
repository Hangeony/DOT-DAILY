import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { config } from "@/lib/config";

const BASE_URL = config.api.baseURL;
const DEFAULT_TIMEOUT = config.api.timeout;

const isBrowser = () => typeof window !== "undefined";

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isBrowser()) {
      // 인증 관련 API는 게스트 모드 체크를 건너뛰기
      const isAuthEndpoint = config.url?.includes("/auth/");

      if (!isAuthEndpoint) {
        // 게스트 모드인지 확인 - 더 강력한 체크
        const authStorage = localStorage.getItem("auth-storage");

        // auth-storage가 없으면 게스트 모드로 간주하고 요청 중단
        if (!authStorage) {
          return Promise.reject(new Error("Guest mode - API request blocked"));
        }

        try {
          const authData = JSON.parse(authStorage);

          // 게스트 모드이거나 초기화되지 않은 상태에서는 요청을 중단
          if (
            authData.state?.isGuest ||
            authData.state?.isInitialized === false
          ) {
            return Promise.reject(
              new Error("Guest mode - API request blocked")
            );
          }
        } catch {
          // 파싱 실패 시에도 요청 중단 (안전을 위해)
          return Promise.reject(new Error("Guest mode - API request blocked"));
        }

        const token = localStorage.getItem("accessToken");
        if (token) {
          if (token.startsWith("Bearer ")) {
            config.headers["Authorization"] = token;
          } else {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        } else {
          // 토큰이 없으면 요청 중단 (게스트 모드이거나 인증되지 않은 상태)
          return Promise.reject(new Error("No access token"));
        }
      } else {
        // 인증 API의 경우 토큰이 있으면 추가
        const token = localStorage.getItem("accessToken");
        if (token) {
          if (token.startsWith("Bearer ")) {
            config.headers["Authorization"] = token;
          } else {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      console.warn("⏰ 서버 응답 시간 초과 - Render.com 콜드 스타트일 가능성");
      if (isBrowser()) {
        alert(
          "서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.\n(첫 접속 시 서버 시작에 시간이 걸릴 수 있습니다)"
        );
      }
    }

    if (error.response?.status === 401 && isBrowser()) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("auth-storage");

      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
