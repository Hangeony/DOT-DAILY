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
      // 게스트 모드인지 확인
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage);
          if (authData.state?.isGuest) {
            // 게스트 모드일 때는 요청을 중단
            console.log("🚫 게스트 모드: API 요청 중단");
            return Promise.reject(
              new Error("Guest mode - API request blocked")
            );
          }
        } catch (e) {
          console.warn("Auth storage 파싱 실패:", e);
        }
      }

      const token = localStorage.getItem("accessToken");
      if (token) {
        if (token.startsWith("Bearer ")) {
          config.headers["Authorization"] = token;
          console.log(
            "🔑 API 요청에 토큰 추가됨 (Bearer 포함):",
            token.substring(0, 20) + "..."
          );
        } else {
          config.headers["Authorization"] = `Bearer ${token}`;
          console.log(
            "🔑 API 요청에 토큰 추가됨 (Bearer 추가):",
            token.substring(0, 20) + "..."
          );
        }
      } else {
        console.log("⚠️ API 요청에 토큰이 없음");
      }
    }

    return config;
  },
  (error) => {
    console.log("[Axios][Request Error]", error);
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
      console.log("❌ 401 Unauthorized 오류 발생:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("auth-storage");

      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    }
    console.log("[Axios][Response Error]", error);
    return Promise.reject(error);
  }
);
