"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FullScreenModalProvider } from "@/components/ui/Modal/providers/FullScreenModalProvider";
import { ModalProvider } from "@/components/ui/Modal/providers/ModalProvider";
import { ToastProvider } from "@/components/ui/Toast/ToastProvider";
import useAuthStore from "@/store/useAuthStore";

function AuthInitializer() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      console.log("🚀 앱 초기화 - 인증 상태 복원 시도");
      initialize();
    }
  }, [initialize]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <FullScreenModalProvider>
          <ModalProvider>
            <AuthInitializer />
            {children}
          </ModalProvider>
        </FullScreenModalProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
