"use client";

import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import GuestModePage from "../components/auth/GuestModePage";
import MyDayPage from "../components/pages/MyDayPage";

export default function HomePage() {
  const { isAuthenticated, isGuest } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 스토리지와 Zustand 상태를 모두 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedToken = localStorage.getItem("accessToken");
      const authStorage = localStorage.getItem("auth-storage");
      
      console.log("🔍 인증 상태 확인:", {
        storedToken: !!storedToken,
        authStorage: !!authStorage,
        isAuthenticated,
        isGuest
      });

      // 토큰이 없거나 auth-storage가 없으면 게스트 모드 선택 페이지로
      if (!storedToken && !authStorage) {
        console.log("🚫 인증 데이터 없음 - 게스트 모드 선택 페이지로");
        return;
      }

      // auth-storage가 있으면 파싱 시도
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage);
          console.log("📊 auth-storage 데이터:", authData.state);
          
          if (authData.state?.isGuest) {
            console.log("🎮 게스트 모드 감지 - MyDayPage로");
            return;
          }
          
          if (authData.state?.isAuthenticated) {
            console.log("✅ 인증된 사용자 감지 - MyDayPage로");
            return;
          }
          
          console.log("🚫 인증되지 않은 상태 - 게스트 모드 선택 페이지로");
        } catch {
          console.log("🚫 auth-storage 파싱 실패 - 게스트 모드 선택 페이지로");
        }
      }
      console.log("✅ 인증 상태 정상");
    };

    checkAuthStatus();
    setIsLoading(false);
  }, [isAuthenticated, isGuest]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 로컬 스토리지에서 토큰 확인
  const storedToken = localStorage.getItem("accessToken");
  const authStorage = localStorage.getItem("auth-storage");
  
  console.log("🔍 홈 페이지 렌더링 - 인증 상태 확인:", {
    storedToken: !!storedToken,
    authStorage: !!authStorage,
    isAuthenticated,
    isGuest
  });

  // auth-storage가 없으면 게스트 모드 선택 페이지
  if (!authStorage) {
    console.log("🚫 auth-storage 없음 - 게스트 모드 선택 페이지");
    return <GuestModePage />;
  }

  // auth-storage 파싱 시도
  let authData;
  try {
    authData = JSON.parse(authStorage);
    console.log("📊 렌더링 시 auth-storage 데이터:", authData.state);
  } catch {
    console.log("🚫 auth-storage 파싱 실패 - 게스트 모드 선택 페이지");
    return <GuestModePage />;
  }

  // 게스트 모드인 경우 MyDayPage
  if (authData.state?.isGuest) {
    console.log("🎮 게스트 모드 렌더링 - MyDayPage");
    return <MyDayPage />;
  }

  // 인증된 사용자인 경우 - 토큰도 있어야 함
  if (authData.state?.isAuthenticated && storedToken) {
    console.log("✅ 인증된 사용자 렌더링 - MyDayPage");
    return <MyDayPage />;
  }

  // 인증 상태가 불완전한 경우 - 모든 데이터 제거 후 게스트 모드 선택 페이지
  if (authData.state?.isAuthenticated && !storedToken) {
    console.log("⚠️ 토큰 없이 인증 상태 - 데이터 초기화 후 게스트 모드 선택 페이지");
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("accessToken");
    return <GuestModePage />;
  }

  // 그 외의 경우 게스트 모드 선택 페이지
  console.log("🚫 인증되지 않은 상태 렌더링 - 게스트 모드 선택 페이지");
  return <GuestModePage />;
}
