"use client";

import useAuthStore from "../store/useAuthStore";
import { useEffect } from "react";
import GuestModePage from "../components/auth/GuestModePage";
import MyDayPage from "../components/pages/MyDayPage";

export default function HomePage() {
  const { isAuthenticated, isGuest, initialize, isInitialized } =
    useAuthStore();
  // 컴포넌트 마운트 시 인증 상태 초기화 (한 번만)
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // 초기화되지 않은 경우에만 로딩 표시 (더 빠른 렌더링)
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  // 인증된 사용자 또는 게스트 모드인 경우 MyDayPage
  if (isAuthenticated || isGuest) {
    return <MyDayPage />;
  }

  // 그 외의 경우 게스트 모드 선택 페이지
  return <GuestModePage />;
}
