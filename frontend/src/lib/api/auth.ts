import { httpClient } from "./http";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  token: string;
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await httpClient.post("/auth/login", credentials);

  // 백엔드 응답 구조에 따라 토큰 경로 확인
  const accessToken =
    response.data.data?.accessToken || response.data.accessToken;
  if (accessToken) {
    // Bearer 접두사가 있는지 확인하고 순수 토큰만 저장
    const cleanToken = accessToken.startsWith("Bearer ")
      ? accessToken.substring(7)
      : accessToken;
    localStorage.setItem("accessToken", cleanToken);
  }

  return response.data.data || response.data;
};

// 로그아웃 함수
export const logout = async () => {
  try {
    await httpClient.post("/auth/logout");
  } catch (error) {
    console.error("로그아웃 API 호출 실패:", error);
    // API 실패해도 로컬 토큰은 제거
  } finally {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("accessToken");
  }
};

// 회원가입 함수
export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await httpClient.post("/auth/register", userData);
  return response.data;
};

// 현재 토큰이 유효한지 확인
export const checkAuth = () => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

// Google 로그인 후 사용자 데이터 생성
export const createGoogleUserData = async (userData: {
  id: number;
  email: string;
  username: string;
  image?: string;
}) => {
  try {
    console.log("🔄 Google 사용자 데이터 생성 시도:", userData);

    const response = await httpClient.post("/auth/google/user", {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      image: userData.image,
    });

    console.log("✅ Google 사용자 데이터 생성 성공:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.log("⚠️ Google 사용자 데이터 생성 실패 (무시됨):", error);
    return null;
  }
};
