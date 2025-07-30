"use client";

import React from "react";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { httpClient } from "@/lib/api/http";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const { showToast } = useToast();
  const { clearGuestMode } = useAuthStore();

  // 회원가입 페이지 로드 시 게스트 모드 해제
  useEffect(() => {
    clearGuestMode();
    // 로컬 스토리지에서도 게스트 모드 관련 데이터 정리
    localStorage.removeItem("auth-storage");
  }, [clearGuestMode]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await httpClient.post("/auth/signup", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });
      showToast("회원가입에 성공했습니다.");
      router.push("/login");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { errors?: Record<string, string[]>; message?: string };
          };
        };
        if (axiosError.response?.data?.errors) {
          const errors = axiosError.response.data.errors;
          let errorMessage = "회원가입 실패:\n";
          Object.keys(errors).forEach((key) => {
            if (errors[key] && errors[key].length > 0) {
              errorMessage += `${key}: ${errors[key][0]}\n`;
            }
          });
          alert(errorMessage);
        } else if (axiosError.response?.data?.message) {
          alert(`회원가입 실패: ${axiosError.response.data.message}`);
        } else {
          alert("회원가입에 실패했습니다. 네트워크 연결을 확인해주세요.");
        }
      } else {
        alert("회원가입에 실패했습니다. 네트워크 연결을 확인해주세요.");
      }
      showToast("회원가입에 실패했습니다.");
    }
  };

  const onInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white px-2">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo-vertical.svg"
            alt="dot_daily logo"
            width={80}
            height={80}
            priority
            style={{ width: "80px", height: "80px" }}
          />
        </div>
        <h2 className="text-xl font-bold text-center mb-2">회원가입</h2>
        <form onSubmit={onSignup} className="flex flex-col gap-6">
          <Input
            type="text"
            label="이름"
            placeholder="이름을 입력해주세요"
            value={formData.name}
            onChange={onInputChange("name")}
            error={errors.name}
            state={errors.name ? "error" : "default"}
            autoComplete="name"
            className="rounded-full shadow-sm"
          />
          <Input
            type="email"
            label="이메일"
            placeholder="dotdaily@email.com"
            value={formData.email}
            onChange={onInputChange("email")}
            error={errors.email}
            state={errors.email ? "error" : "default"}
            autoComplete="email"
            className="rounded-full shadow-sm"
          />
          <Input
            type="password"
            label="비밀번호"
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            value={formData.password}
            onChange={onInputChange("password")}
            error={errors.password}
            state={errors.password ? "error" : "default"}
            autoComplete="new-password"
            className="rounded-full shadow-sm"
          />
          <Input
            type="password"
            label="비밀번호 확인"
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            value={formData.confirmPassword}
            onChange={onInputChange("confirmPassword")}
            error={errors.confirmPassword}
            state={errors.confirmPassword ? "error" : "default"}
            autoComplete="new-password"
            className="rounded-full shadow-sm"
          />
          <Button
            type="submit"
            label="가입하기"
            className="w-full rounded-full py-3 text-lg font-bold shadow-md bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition mt-4"
          />
        </form>
        <div className="flex justify-center pt-2 text-sm">
          <span className="text-gray-500">이미 계정이 있으신가요?</span>
          <Link
            href="/login"
            className="ml-1 text-blue-500 font-semibold hover:underline focus:underline transition"
          >
            로그인
          </Link>
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
