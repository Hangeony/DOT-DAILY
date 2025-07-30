"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import ToastItem from "./ToastItem";

// 토스트 타입 정의
interface Toast {
  id: string;
  message: string;
}

// Context 타입 정의
interface ToastContextType {
  showToast: (message: string) => void;
}

// Context 생성
const ToastContext = createContext<ToastContextType | null>(null);

/**
 * 토스트 알림을 관리하는 Provider
 *
 * 전역에서 토스트 알림을 표시할 수 있도록 Context를 제공합니다.
 * 토스트는 자동으로 3초 후 사라집니다.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 토스트 표시 함수
  const showToast = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message };

    setToasts((prev) => [...prev, newToast]);

    // 3초 후 자동 제거
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // 토스트가 있을 때 body overflow 숨김
  useEffect(() => {
    if (toasts.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [toasts.length]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* 토스트 렌더링 */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} message={toast.message} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * 토스트 Context를 사용하는 커스텀 훅
 *
 * @returns 토스트 관련 함수들
 * @throws Error - ToastProvider 외부에서 사용할 경우
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
