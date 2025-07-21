"use client";

import React from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { httpClient } from "@/lib/api/http";
import { validateEmail, validatePassword } from "@/utils/validation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { config } from "@/lib/config";

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { login, clearGuestMode } = useAuthStore();

  // 로그인 페이지 로드 시 게스트 모드 해제
  useEffect(() => {
    console.log("🔓 로그인 페이지 로드 - 게스트 모드 해제");
    clearGuestMode();
    localStorage.removeItem("auth-storage"); // 게스트 데이터 초기화
  }, [clearGuestMode]);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await httpClient.post("/auth/login", {
        email,
        password,
      });

      console.log("로그인 성공:", response.data);

      // 백엔드 응답 구조에 따라 토큰과 사용자 정보 추출
      const responseData = response.data.data || response.data;
      const accessToken = responseData.accessToken;
      const user = {
        id: responseData.id?.toString() || responseData.user?.id?.toString(),
        email: responseData.email || responseData.user?.email,
        name: responseData.username || responseData.user?.name,
      };

      if (accessToken && user.id) {
        // Zustand store 업데이트
        login(user, accessToken);

        // localStorage에도 토큰 저장 (이중 안전장치)
        localStorage.setItem("accessToken", accessToken);

        console.log("✅ 인증 상태 업데이트 완료:", {
          user,
          token: accessToken,
        });
        router.push("/");
      } else {
        console.error(
          "토큰 또는 사용자 정보를 찾을 수 없습니다:",
          responseData
        );
        alert("로그인 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 로그인 로직
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("✅ 구글 응답:", tokenResponse);

        // access_token만 추출
        const accessToken = tokenResponse.access_token;

        // 백엔드로 전달
        const response = await axios.post(
          `${config.api.baseURL}/auth/google/login`,
          { accessToken } // credential 아님
        );

        console.log("✅ 백엔드 응답:", response.data);

        const jwt = response.data.accessToken;
        const user = response.data.user;

        localStorage.setItem("accessToken", jwt);
        login(user, jwt);
        showToast("Google 로그인 성공 🎉");
        router.push("/");
      } catch (error) {
        console.error("❌ Google 로그인 실패", error);
        showToast("Google 로그인 실패");
      }
    },
    onError: () => {
      console.error("❌ Google SDK 로그인 실패");
      showToast("Google 로그인 실패");
    },
  });

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white px-2">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo-vertical.svg"
            alt="dot_daily logo"
            width={60}
            height={60}
            priority
          />
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">dot<span className="text-blue-400">.</span>daily</h1> */}
        </div>
        <form onSubmit={onLogin} className="flex flex-col gap-6">
          <Input
            type="email"
            label="이메일"
            placeholder="dotdaly@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            state={errors.email ? "error" : "default"}
            required
            className="rounded-full shadow-sm"
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="비밀번호"
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              state={errors.password ? "error" : "default"}
              required
              className="rounded-full shadow-sm"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          <Button
            label={isLoading ? "로그인 중..." : "로그인"}
            className="mt-4 w-full rounded-full py-3 text-lg font-bold shadow-md bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
        </form>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 rounded-full py-3 font-bold text-gray-800 shadow transition"
          >
            <Image
              src="/kakao.svg"
              alt="카카오 로그인"
              width={24}
              height={24}
            />
            카카오로 로그인
          </button>
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={!config.oauth.google.isEnabled}
            className="flex items-center justify-center gap-2 bg-white border hover:bg-gray-100 rounded-full py-3 font-bold text-gray-700 shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image src="/google.svg" alt="구글 로그인" width={24} height={24} />
            {config.oauth.google.isEnabled
              ? "구글로 로그인"
              : "구글 로그인 (설정 필요)"}
          </button>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            게스트 모드로 돌아가기
          </Link>
          <Link
            href="/signup"
            className="text-blue-500 font-semibold hover:underline text-sm"
          >
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}

// ✅ GoogleOAuthProvider로 감싸기 (환경변수가 없으면 조건부 렌더링)
export default function LoginPage() {
  const googleClientId = config.oauth.google.clientId;

  if (!googleClientId) {
    console.warn(
      "⚠️ Google OAuth 클라이언트 ID가 설정되지 않았습니다. Google 로그인이 비활성화됩니다."
    );
    return <LoginPageContent />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LoginPageContent />
    </GoogleOAuthProvider>
  );
}
