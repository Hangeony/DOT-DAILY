"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import useAuthStore from "@/store/useAuthStore";

export default function GuestModePage() {
  const { setGuestMode } = useAuthStore();
  const handleGuestMode = () => {
    setGuestMode();
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo-vertical.svg"
            alt="DOT.DAILY 로고"
            width={80}
            height={80}
            priority
            className="w-20 h-20"
          />
          <div className="text-center">
            <p className="text-gray-600 text-sm">투두 + 회고 기록 앱</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            label="로그인하기"
            onClick={() => (window.location.href = "/login")}
            aria-label="로그인 페이지로 이동"
            className="w-full rounded-full py-3 text-lg font-bold shadow-md bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <Button
            label="게스트로 시작하기"
            onClick={handleGuestMode}
            className="w-full rounded-full py-3 text-lg font-bold shadow-md bg-gradient-to-r from-gray-500 to-gray-400 hover:from-gray-600 hover:to-gray-500 transition text-white"
          />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-4">
            게스트 모드에서는 데이터가 저장되지 않습니다
          </p>
          <a
            href="/signup"
            className="text-blue-500 font-semibold hover:underline text-sm"
          >
            회원가입
          </a>
        </div>
      </div>
    </main>
  );
}
