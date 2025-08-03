"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ToastProvider } from "@/components/ui/Toast/ToastProvider";
import { ModalProvider } from "@/components/ui/Modal/providers/ModalProvider";
import { FullScreenModalProvider } from "@/components/ui/Modal/providers/FullScreenModalProvider";
import useAuthStore from "@/store/useAuthStore";

/**
 * 앱의 전역 Provider들을 관리하는 컴포넌트
 *
 * 각 기능별로 분리된 Provider들을 사용하여
 * 안정적이고 예측 가능한 상태 관리를 제공합니다.
 *
 * Provider 계층 구조:
 * QueryClientProvider (서버 상태 관리) - API 호출, 캐싱, 백그라운드 업데이트
 *   └── ToastProvider (토스트 알림 관리)
 *       └── ModalProvider (일반 모달 및 확인 다이얼로그 관리)
 *           └── FullScreenModalProvider (전체화면 모달 관리)
 *               └── children (실제 앱 컴포넌트들)
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  /**
   * React Query 클라이언트 생성
   *
   * useState의 초기화 함수를 사용하여 컴포넌트가 처음 렌더링될 때만
   * QueryClient가 생성되도록 최적화합니다.
   *
   * 설정 옵션:
   * - staleTime: 5분 (데이터가 신선하다고 간주되는 시간)
   * - gcTime: 10분 (가비지 컬렉션 시간)
   * - refetchOnWindowFocus: false (윈도우 포커스 시 자동 재요청 비활성화)
   * - retry: 1 (실패 시 재시도 횟수)
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
            refetchInterval: false,
          },
        },
      })
  );

  /**
   * Zustand 인증 스토어에서 초기화 함수 가져오기
   *
   * 선택적 구독 방식을 사용하여 필요한 함수만 가져와서
   * 다른 상태가 변경되어도 이 컴포넌트가 리렌더링되지 않도록 최적화합니다.
   */
  const initialize = useAuthStore((state) => state.initialize);

  /**
   * 앱 시작 시 인증 상태 초기화
   *
   * 컴포넌트가 마운트될 때 실행되어:
   * - localStorage에서 인증 정보 복원
   * - 토큰 유효성 검증
   * - 게스트 모드 상태 확인
   * - 인증 상태 초기화 완료 표시
   */
  useEffect(() => {
    initialize();
  }, [initialize]);

  /**
   * Provider 계층 구조 반환
   *
   * 각 기능별로 분리된 Provider들을 사용하여
   * 안정적이고 예측 가능한 상태 관리를 제공합니다.
   */
  return (
    // 서버 상태 관리 - API 호출, 캐싱, 백그라운드 업데이트
    <QueryClientProvider client={queryClient}>
      {/* 토스트 알림 관리 */}
      <ToastProvider>
        {/* 일반 모달 및 확인 다이얼로그 관리 */}
        <ModalProvider>
          {/* 전체화면 모달 관리 */}
          <FullScreenModalProvider>{children}</FullScreenModalProvider>
        </ModalProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
