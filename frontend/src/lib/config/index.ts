// 중앙화된 설정 관리
export const config = {
  // API 설정
  api: {
    baseURL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001/api/v1" // 개발 환경
        : "https://dot-daily.onrender.com/api/v1", // 프로덕션 API 사용
    timeout: 30000, // 30초
  },

  // OAuth 설정
  oauth: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      isEnabled: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    },
  },

  // 환경 설정
  env: {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  },

  // 앱 설정
  app: {
    name: "dot.daily",
    version: "1.0.0",
    maxRetries: 3,
    retryDelay: 1000,
  },

  // 스토리지 키
  storage: {
    authToken: "accessToken",
    authStorage: "auth-storage",
    guestTasks: "guest_tasks",
  },
} as const;

// 타입 정의
export type Config = typeof config;
export type ApiConfig = Config["api"];
export type OAuthConfig = Config["oauth"];
export type EnvConfig = Config["env"];
export type AppConfig = Config["app"];
export type StorageConfig = Config["storage"];

// 유틸리티 함수들
export const getApiBaseURL = () => config.api.baseURL;
export const getGoogleClientId = () => config.oauth.google.clientId;
export const isGoogleOAuthEnabled = () => config.oauth.google.isEnabled;
export const isDevelopment = () => config.env.isDevelopment;
export const isProduction = () => config.env.isProduction;
