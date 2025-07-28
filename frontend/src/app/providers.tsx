"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { FullScreenModalProvider } from "@/components/ui/Modal/providers/FullScreenModalProvider";
import { ModalProvider } from "@/components/ui/Modal/providers/ModalProvider";
import { ToastProvider } from "@/components/ui/Toast/ToastProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // 기본 설정 사용 (최적화 제거)
        defaultOptions: {},
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <FullScreenModalProvider>
          <ModalProvider>{children}</ModalProvider>
        </FullScreenModalProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
