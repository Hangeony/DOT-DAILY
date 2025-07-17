"use client";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { httpClient } from "@/lib/api/http";
import { validateEmail, validatePassword } from "@/utils/validation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useAuthStore } from "../../store/useAuthStore";

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginPage() {
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
    // 로컬 스토리지에서도 게스트 모드 관련 데이터 정리
    localStorage.removeItem("auth-storage");
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
    if (!validateForm()) return;
    
    setIsLoading(true);
    console.log("🔐 로그인 시도:", { email });
    
    try {
      console.log("📡 API 요청 전송...");
      showToast("서버에 연결 중입니다... 잠시만 기다려주세요.");
      
      const response = await httpClient.post("/auth/login", {
        email,
        password,
      });
      
      console.log("✅ API 응답:", response.data);
      
      const accessToken =
        response.data.data?.accessToken || response.data.accessToken;
      let userData = response.data.data?.user || response.data.user;
      
      console.log("🔑 토큰 확인:", { accessToken: !!accessToken, userData: !!userData });
      
      // JWT 토큰에서 사용자 정보 추출 (userData가 없는 경우)
      if (accessToken && !userData) {
        try {
          const cleanToken = accessToken.startsWith("Bearer ")
            ? accessToken.substring(7)
            : accessToken;
          
          // JWT 토큰의 payload 부분을 디코드
          const payload = cleanToken.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          
          console.log("🔍 JWT 페이로드:", decodedPayload);
          
          userData = {
            id: decodedPayload.id?.toString() || decodedPayload.userId?.toString(),
            email: decodedPayload.email,
            name: decodedPayload.username || decodedPayload.name,
          };
          
          console.log("👤 추출된 사용자 데이터:", userData);
        } catch (jwtError) {
          console.error("❌ JWT 디코딩 실패:", jwtError);
        }
      }
      
      if (accessToken && userData) {
        const cleanToken = accessToken.startsWith("Bearer ")
          ? accessToken.substring(7)
          : accessToken;
        
        console.log("💾 토큰 저장 및 로그인 처리...");
        localStorage.setItem("accessToken", cleanToken);
        login(userData, cleanToken);
        
        console.log("✅ 로그인 성공, 홈으로 이동");
        showToast("로그인되었습니다! 🎉");
        router.push("/");
      } else {
        console.error("❌ 토큰 또는 사용자 데이터 없음:", { accessToken, userData });
        showToast("로그인 처리 중 오류가 발생했습니다.");
      }
    } catch (error: unknown) {
      console.error("❌ 로그인 실패:", error);
      
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: unknown }).response === "object"
      ) {
        const err = error as {
          response?: {
            data?: { 
              errors?: { email?: string };
              message?: string;
            };
            status?: number;
          };
        };
        
        console.log("📊 오류 상세 정보:", {
          status: err.response?.status,
          data: err.response?.data
        });
        
        if (err.response?.data?.errors?.email) {
          showToast(err.response.data.errors.email);
          return;
        }
        
        if (err.response?.data?.message) {
          showToast(err.response.data.message);
          return;
        }
        
        if (err.response?.status === 401) {
          showToast("이메일 또는 비밀번호가 올바르지 않습니다.");
          return;
        }
        
        if (err.response?.status === 500) {
          showToast("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          return;
        }
      }
      
      showToast("로그인 실패했습니다. 네트워크 연결을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

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
            className="flex items-center justify-center gap-2 bg-white border hover:bg-gray-100 rounded-full py-3 font-bold text-gray-700 shadow transition"
          >
            <Image src="/google.svg" alt="구글 로그인" width={24} height={24} />
            구글로 로그인
          </button>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
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

export default LoginPage;
