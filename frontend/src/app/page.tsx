"use client";

import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";
import GuestModePage from "../components/auth/GuestModePage";
import MyDayPage from "../components/pages/MyDayPage";

export default function HomePage() {
  const { isAuthenticated, isGuest, initialize } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 인증 상태 초기화
  useEffect(() => {
    console.log("🔄 홈 페이지 마운트 - 인증 상태 초기화");
    initialize();
    setIsLoading(false);
  }, [initialize]);

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
    isGuest,
  });

  // 인증된 사용자인 경우 MyDayPage
  if (isAuthenticated && storedToken) {
    console.log("✅ 인증된 사용자 렌더링 - MyDayPage");
    return <MyDayPage />;
  }

  // 게스트 모드인 경우 MyDayPage
  if (isGuest) {
    console.log("🎮 게스트 모드 렌더링 - MyDayPage");
    return <MyDayPage />;
  }

  // auth-storage가 있지만 Zustand 상태가 업데이트되지 않은 경우
  if (authStorage && !isAuthenticated && !isGuest) {
    try {
      const authData = JSON.parse(authStorage);
      console.log("📊 auth-storage 데이터 확인:", authData.state);

      if (authData.state?.isAuthenticated && storedToken) {
        console.log("🔄 인증 상태 복원 시도");
        initialize();
        return <MyDayPage />;
      }

      if (authData.state?.isGuest) {
        console.log("🔄 게스트 모드 복원 시도");
        initialize();
        return <MyDayPage />;
      }
    } catch (error) {
      console.error("auth-storage 파싱 오류:", error);
    }
  }

  // 그 외의 경우 게스트 모드 선택 페이지
  console.log("🚫 인증되지 않은 상태 렌더링 - 게스트 모드 선택 페이지");
  return <GuestModePage />;
}
