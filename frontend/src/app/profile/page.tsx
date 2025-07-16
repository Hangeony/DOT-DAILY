"use client";

import MobileLayout from "@/components/layout/MobileLayout";
import { StatCard } from "@/components/ui/StatCard";
import { EmotionStatList, EmotionStat } from "@/components/ui/EmotionStatList";
import { Button } from "@/components/ui/Button/Button";
import { LogOut, User, Mail, Lock } from "lucide-react";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUserProfileStats } from "@/lib/api/profile";
import { useAuthStore } from "@/store/useAuthStore";
import { useConfirm } from "@/components/ui/Modal/providers/ModalProvider";

interface UserProfile {
  email: string;
  username: string;
}

interface StickerData {
  stickerId: number;
  label: string;
  emoji: string;
  count: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [total, setTotal] = useState(0);
  const [success, setSuccess] = useState(0);
  const [pending, setPending] = useState(0);
  const [archive, setArchive] = useState(0);
  const [userStats, setUserStats] = useState<StickerData[]>([]);
  const router = useRouter();
  const { isGuest, clearGuestMode } = useAuthStore();
  const confirm = useConfirm();

  const stats = [
    { value: total, label: "전체" },
    { value: success, label: "성공", color: "text-green-600" },
    { value: pending, label: "다시", color: "text-orange-500" },
    { value: archive, label: "보류", color: "text-blue-500" },
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
      const userStat = userStats.find((stat) => stat.label === emotion.label);
      return {
        ...emotion,
        count: userStat?.count || 0,
      };
    });
  }, [userStats]);

  const onLogout = async () => {
    if (isGuest) {
      const confirmed = await confirm("게스트 모드를 종료하시겠습니까?");
      if (confirmed) {
        // 게스트 모드 완전 초기화
        clearGuestMode();
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("accessToken");
        // 모든 게스트 관련 데이터 제거
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('guest-')) {
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
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('guest-')) {
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

  useEffect(() => {
    if (isGuest) {
      // 게스트 모드일 때는 API 호출하지 않음
      return;
    }

    const userProfile = async () => {
      try {
        const response = await getUserProfileStats();
        setUser(response.user);
        setUserStats(response.stickers);

        const pending = response.todos.pending || 0;
        const success = response.todos.success || 0;
        const archive = response.todos.archive || 0;

        const total = pending + success + archive;

        setTotal(total);
        setPending(pending);
        setSuccess(success);
        setArchive(archive);
      } catch (error) {
        console.error("프로필 정보 로드 실패:", error);
      }
    };
    userProfile();
  }, [isGuest]);

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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">로그인하면 사용할 수 있는 기능</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">모든 기기에서 데이터 동기화</span>
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
      <div className="px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {user?.username} 님
              </h1>
              <div className="flex items-center text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            할 일 통계
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <StatCard
                  value={stat.value}
                  label={stat.label}
                  color={stat.color}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            감정 기록 통계
          </h2>
          <EmotionStatList stats={emotionStats} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <Button
            variant="ghost"
            fullWidth
            onClick={onLogout}
            className="flex items-center justify-start px-6 py-4 text-left text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            <span>로그아웃</span>
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
