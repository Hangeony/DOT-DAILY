"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import ModalItem from "../components/ModalItem";

// Context 타입 정의
interface ModalContextType {
  showModal: (content: ReactNode) => void;
  closeModal: () => void;
  showConfirm: (message: string) => Promise<boolean>;
}

// 확인 다이얼로그 상태 타입
interface ConfirmState {
  open: boolean;
  message: string;
  resolve: (value: boolean) => void;
}

// Context 생성
const ModalContext = createContext<ModalContextType | null>(null);

/**
 * 일반 모달과 확인 다이얼로그를 관리하는 Provider
 *
 * 전역에서 모달과 확인 다이얼로그를 표시할 수 있도록 Context를 제공합니다.
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  // 모달이 열려있을 때 body overflow 숨김
  useEffect(() => {
    if (modalContent || confirmState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalContent, confirmState]);

  // 모달 표시 함수
  const showModal = (content: ReactNode) => {
    setModalContent(content);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalContent(null);
  };

  // 확인 다이얼로그 표시 함수
  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        message,
        resolve,
      });
    });
  };

  // 확인 다이얼로그 닫기 함수
  const handleConfirmClose = (result: boolean) => {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal, showConfirm }}>
      {children}

      {/* 일반 모달 렌더링 */}
      <ModalItem open={!!modalContent} onClose={closeModal}>
        {modalContent}
      </ModalItem>

      {/* 확인 다이얼로그 렌더링 */}
      {confirmState && (
        <ModalItem
          open={confirmState.open}
          onClose={() => handleConfirmClose(false)}
        >
          <div className="p-6">
            <div className="mb-4 text-lg font-semibold">
              {confirmState.message}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => handleConfirmClose(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={() => handleConfirmClose(true)}
              >
                확인
              </button>
            </div>
          </div>
        </ModalItem>
      )}
    </ModalContext.Provider>
  );
}

/**
 * 모달 Context를 사용하는 커스텀 훅
 *
 * @returns 모달 관련 함수들
 * @throws Error - ModalProvider 외부에서 사용할 경우
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};
