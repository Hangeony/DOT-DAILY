"use client";

import { MyDayPageSkeleton } from "@/components/ui/Skeleton/Skeleton";
import GuestModePage from "@/components/auth/GuestModePage";
import MyDayPage from "@/features/myday/MyDayPage";
import GuestMyDayPage from "@/features/myday/GuestMyDayPage";
import useAuthStore from "@/store/useAuthStore";

export default function HomePage() {
  const { isGuest, isInitialized, isAuthenticated } = useAuthStore();

  // 서버 사이드 렌더링 중에는 스켈레톤만 표시
  if (typeof window === "undefined") {
    return <MyDayPageSkeleton />;
  }

  if (!isInitialized) return <MyDayPageSkeleton />;
  if (isGuest) return <GuestMyDayPage />;
  if (!isAuthenticated) return <GuestModePage />;

  return <MyDayPage />;
}
