"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getDailyEmotionMemos } from "@/lib/api/retrospect";
import { calculateConsecutiveDays } from "@/lib/utils";
import { useRetrospectStore } from "@/store/useRestrospectStore";
import { useFullScreenModal } from "@/components/ui/Modal/providers/FullScreenModalProvider";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/Button/Button";
import useAuthStore from "@/store/useAuthStore";

import dynamic from "next/dynamic";
import { Lock } from "lucide-react";

// 무거운 컴포넌트들을 dynamic import로 지연 로딩
const Calendar = dynamic(
  () => import("@/features/retrospect/components/Calendar"),
  {
    loading: () => (
      <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500 text-sm">캘린더 로딩 중...</div>
      </div>
    ),
    ssr: false,
  }
);

const RetrospectContent = dynamic(
  () => import("@/features/retrospect/components/RetrospectContent"),
  {
    loading: () => (
      <div className="h-32 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500 text-sm">회고 내용 로딩 중...</div>
      </div>
    ),
    ssr: false,
  }
);

export default function RetrospectPage() {
  const { emotionMemoList, setEmotionMemoList } = useRetrospectStore();
  const router = useRouter();
  const { openModal } = useFullScreenModal();
  const { isGuest, isAuthenticated } = useAuthStore();

  // 회고 데이터 초기 로딩
  useEffect(() => {
    const loadRetrospectData = async () => {
      if (isAuthenticated && !isGuest && emotionMemoList.length === 0) {
        try {
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1;

          const data = await getDailyEmotionMemos(year, month);
          setEmotionMemoList(data);
        } catch {
          // 회고 데이터 로딩 실패
        }
      }
    };

    loadRetrospectData();
  }, [isAuthenticated, isGuest, emotionMemoList.length, setEmotionMemoList]); // emotionMemoList.length 다시 추가

  const consecutiveDays = useMemo(() => {
    return calculateConsecutiveDays(emotionMemoList);
  }, [emotionMemoList]);

  const onTodayRetrospect = () => {
    openModal("retrospectForm");
  };

  const onDateNavigation = () => {
    openModal("dateNavigationForm");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // 게스트 모드일 때 로그인 필요 메시지 표시
  if (isGuest) {
    return (
      <MobileLayout headerTitle="오늘 회고">
        <div className="px-4 py-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  회고 기능
                </h1>
                <p className="text-gray-500 text-sm">
                  로그인하면 회고 기능을 사용할 수 있어요
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              회고 기능이란?
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">
                  하루를 돌아보며 느꼈던 감정을 솔직하게 기록
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">
                  작은 성취나 배움도 소중한 경험으로 기록
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">
                  매일매일의 기록이 모여 성장의 발자취
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">
                  감정에 솔직해지는 것이 회고의 첫 번째 단계
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="font-kkonghae text-lg text-blue-800">
              💡 회고 작성 팁
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>하루를 돌아보며 느꼈던 감정을 솔직하게 기록해보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>작은 성취나 배움도 소중한 경험이에요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>매일매일의 기록이 모여 성장의 발자취가 됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>감정에 솔직해지는 것이 회고의 첫 번째 단계입니다</span>
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleLogin}
            className="rounded-full py-3 text-lg font-bold"
          >
            로그인하고 회고 시작하기
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle="오늘 회고">
      <div className="px-4 py-4 pb-32">
        <div className="space-y-4">
          <Calendar onDateModalOpen={onDateNavigation} />
          <RetrospectContent />

          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="font-kkonghae text-lg text-blue-800">
              💡 회고 작성 팁
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>하루를 돌아보며 느꼈던 감정을 솔직하게 기록해보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>작은 성취나 배움도 소중한 경험이에요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>매일매일의 기록이 모여 성장의 발자취가 됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>감정에 솔직해지는 것이 회고의 첫 번째 단계입니다</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600 mb-1">
                {emotionMemoList.length}
              </div>
              <div className="text-xs text-green-700 font-kkonghae">
                이번 달
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-purple-600 mb-1">
                {consecutiveDays}
              </div>
              <div className="text-xs text-purple-700 font-kkonghae">
                연속 기록
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-4 z-10">
        <nav
          aria-label="날짜 이동 및 회고 작성"
          className="flex justify-center gap-2"
        >
          <Button
            label="선택한 날짜로 이동"
            variant="outline"
            className="flex-1 max-w-[160px] text-sm py-2 shadow-lg"
            onClick={() => router.push("/")}
          />
          <Button
            label="오늘 회고 작성하기"
            variant="solid"
            className="flex-[1.5] max-w-[280px] text-sm py-2 shadow-lg"
            onClick={onTodayRetrospect}
          />
        </nav>
      </div>
    </MobileLayout>
  );
}
