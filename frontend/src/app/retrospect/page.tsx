'use client';

import MobileLayout from '@/components/layout/MobileLayout';
import Calendar from '@/features/retrospect/components/Calendar';
import RetrospectContent from '@/features/retrospect/components/RetrospectContent';
import { Button } from '@/components/ui/Button/Button';
import { useFullScreenModal } from '@/components/ui/Modal/providers/FullScreenModalProvider';
import { useRouter } from 'next/navigation';
import { useRetrospectStore } from '@/store/useRestrospectStore';
import { calculateConsecutiveDays } from '@/utils/retrospectUtils';
import { useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Lock } from 'lucide-react';

export default function RetrospectPage() {
  const { emotionMemoList } = useRetrospectStore();
  const router = useRouter();
  const { openModal } = useFullScreenModal();
  const { isGuest } = useAuthStore();

  const consecutiveDays = useMemo(() => {
    return calculateConsecutiveDays(emotionMemoList);
  }, [emotionMemoList]);

  const onTodayRetrospect = () => {
    openModal('retrospectForm');
  };

  const onDateNavigation = () => {
    openModal('dateNavigationForm');
  };

  const handleLogin = () => {
    router.push('/login');
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">회고 기능이란?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">하루를 돌아보며 느꼈던 감정을 솔직하게 기록</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">작은 성취나 배움도 소중한 경험으로 기록</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">매일매일의 기록이 모여 성장의 발자취</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">감정에 솔직해지는 것이 회고의 첫 번째 단계</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="font-kkonghae text-lg text-blue-800">💡 회고 작성 팁</h3>
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
            <h3 className="font-kkonghae text-lg text-blue-800">💡 회고 작성 팁</h3>
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
              <div className="text-xl font-bold text-green-600 mb-1">{emotionMemoList.length}</div>
              <div className="text-xs text-green-700 font-kkonghae">이번 달</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-purple-600 mb-1">{consecutiveDays}</div>
              <div className="text-xs text-purple-700 font-kkonghae">연속 기록</div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-4 z-10"
      >
        <nav
          aria-label="날짜 이동 및 회고 작성"
          className="flex justify-center gap-2"
        >
          <Button
            label="선택한 날짜로 이동"
            variant="outline"
            className="flex-1 max-w-[160px] text-sm py-2 shadow-lg"
            onClick={() => router.push('/')}
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