"use client";
import MobileLayout from "@/components/layout/MobileLayout";
import { EmotionStatList, EmotionStat } from "@/components/ui/EmotionStatList";
import { Button } from "@/components/ui/Button/Button";
import {
  LogOut,
  Lock,
  TrendingUp,
  CheckCircle,
  Clock,
  RefreshCw,
  Archive,
} from "lucide-react";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { getUserProfileStats } from "@/lib/api/profile";
import useAuthStore from "@/store/useAuthStore";
import { useConfirm } from "@/components/ui/Modal/providers/ModalProvider";
import { useQuery } from "@tanstack/react-query";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { useState } from "react";

interface StatItem {
  value: number;
  label: string;
  color?: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isGuest, clearGuestMode } = useAuthStore();
  const confirm = useConfirm();
  const [period, setPeriod] = useState<"all" | "month" | "week">("all");

  // React Query로 성능 최적화
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["userProfileStats", period],
    queryFn: () => getUserProfileStats(period),
    enabled: !isGuest, // 게스트 모드가 아닐 때만 실행
    staleTime: 0, // 기간 변경 시 즉시 새로운 데이터 요청
    refetchOnWindowFocus: false,
  });

  // 데이터 추출
  const user = profileData?.user || null;
  const todos = profileData?.todos || {
    pending: 0,
    success: 0,
    retry: 0,
    archive: 0,
  };
  const totalRetryCount = profileData?.totalRetryCount || 0;

  // 통계 계산
  const total = todos.pending + todos.success + todos.retry + todos.archive;

  const stats: StatItem[] = [
    {
      value: total,
      label: "전체",
      icon: <TrendingUp className="w-4 h-4" />,
      bgColor: "bg-gradient-to-br from-slate-500 to-slate-600",
    },
    {
      value: todos.success,
      label: "성공",
      color: "text-green-600",
      icon: <CheckCircle className="w-4 h-4" />,
      bgColor: "bg-gradient-to-br from-emerald-400 to-emerald-500",
    },
    {
      value: todos.pending,
      label: "대기",
      color: "text-yellow-500",
      icon: <Clock className="w-4 h-4" />,
      bgColor: "bg-gradient-to-br from-amber-400 to-amber-500",
    },
    {
      value: todos.retry,
      label: "다시",
      color: "text-red-500",
      icon: <RefreshCw className="w-4 h-4" />,
      bgColor: "bg-gradient-to-br from-rose-400 to-rose-500",
    },
    {
      value: todos.archive,
      label: "보류",
      color: "text-blue-500",
      icon: <Archive className="w-4 h-4" />,
      bgColor: "bg-gradient-to-br from-sky-400 to-sky-500",
    },
  ];

  const emotionStats: EmotionStat[] = useMemo(() => {
    const baseEmotions = [
      { icon: "/good-on.svg", label: "좋음", color: "text-green-500" },
      { icon: "/bad-on.svg", label: "나쁨", color: "text-red-500" },
      { icon: "/meh-on.svg", label: "그냥그럼", color: "text-yellow-500" },
      { icon: "/proud-on.svg", label: "뿌듯함", color: "text-purple-500" },
      { icon: "/grateful-on.svg", label: "감사함", color: "text-pink-500" },
    ];

    return baseEmotions.map((emotion) => {
      const userStat = profileData?.stickers?.find(
        (stat: { label: string; count: number }) => stat.label === emotion.label
      );
      return {
        ...emotion,
        count: userStat?.count || 0,
      };
    });
  }, [profileData?.stickers]);

  const onLogout = async () => {
    if (isGuest) {
      const confirmed = await confirm("게스트 모드를 종료하시겠습니까?");
      if (confirmed) {
        // 게스트 모드 완전 초기화
        clearGuestMode();
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("accessToken");
        // 모든 게스트 관련 데이터 제거
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("guest-")) {
            localStorage.removeItem(key);
          }
        });
        window.location.href = "/"; // 강제 새로고침
      }
    } else {
      const confirmed = await confirm("정말 로그아웃하시겠습니까?");
      if (confirmed) {
        try {
          await logout();
          // 추가로 모든 인증 관련 데이터 제거
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("accessToken");
          // 모든 게스트 관련 데이터 제거
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("guest-")) {
              localStorage.removeItem(key);
            }
          });
          window.location.href = "/"; // 강제 새로고침으로 게스트 모드 선택 페이지로 이동
        } catch (error) {
          console.error("로그아웃 실패:", error);
          alert("로그아웃 중 오류가 발생했습니다.");
        }
      }
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // 게스트 모드일 때 로그인 필요 메시지 표시
  if (isGuest) {
    return (
      <MobileLayout headerTitle="나의 정보">
        <div className="px-4 py-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  게스트 모드
                </h1>
                <p className="text-gray-500 text-sm">
                  로그인하면 더 많은 기능을 사용할 수 있어요
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              로그인하면 사용할 수 있는 기능
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  모든 기기에서 데이터 동기화
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">상세한 통계 및 분석</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">감정 기록 및 회고 기능</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">보류함 및 아카이브 기능</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={handleLogin}
              className="rounded-full py-3 text-lg font-bold"
            >
              로그인하기
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={onLogout}
              className="text-red-600 hover:bg-red-50"
            >
              게스트 모드 종료
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle="나의 정보">
      {isLoading ? (
        <PageSkeleton />
      ) : (
        <div className="px-4 py-6 space-y-6">
          <>
            {/* 프로필 섹션 */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-3xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {user?.username || "사용자"}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {user?.email || "이메일 정보 없음"}
                  </p>
                </div>
              </div>
            </div>

            {/* 할 일 통계 섹션 */}
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />할 일
                  통계
                </h2>

                {/* 기간 필터 */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {[
                    { key: "all", label: "전체" },
                    { key: "month", label: "1개월" },
                    { key: "week", label: "1주일" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setPeriod(key as "all" | "month" | "week")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        period === key
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 통계 카드들 */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                {stats.map((stat: StatItem) => (
                  <div key={stat.label} className="relative">
                    <div
                      className={`${stat.bgColor} rounded-2xl p-3 text-center shadow-md`}
                    >
                      <div className="flex justify-center mb-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs font-medium text-white/90">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Retry 횟수 */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    총 Retry 횟수:{" "}
                    <span className="font-bold text-gray-800 text-lg">
                      {totalRetryCount}
                    </span>{" "}
                    회
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-center mt-2">
                  {period === "all" && "전체 기간"}
                  {period === "month" && "최근 1개월"}
                  {period === "week" && "최근 1주일"}
                </div>
              </div>
            </div>

            {/* 감정 기록 통계 섹션 */}
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-5 h-5 mr-2 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💭</span>
                </div>
                감정 기록 통계
              </h2>
              <EmotionStatList stats={emotionStats} />
            </div>

            {/* 로그아웃 버튼 */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
              <Button
                variant="ghost"
                fullWidth
                onClick={onLogout}
                className="flex items-center justify-start px-6 py-4 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3 text-red-500" />
                <span className="font-medium">로그아웃</span>
              </Button>
            </div>
          </>
        </div>
      )}
    </MobileLayout>
  );
}
