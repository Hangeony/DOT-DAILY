"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { AnimatePresence } from "framer-motion";
import FullScreenModal from "../components/FullScreenModal";
import BottomSheetModal from "../components/BottomSheetModal";
import TaskFormModal from "@/features/myday/components/TaskFormModal";
import RetrospectModal from "@/features/retrospect/components/RetrospectModal";
import DateNavigationModal from "@/features/retrospect/components/DateNavigationModal";
import { useRetrospectModal } from "@/hooks/useRestrospectModal";

// 모달 이름 타입
type ModalName = "taskForm" | "retrospectForm" | "dateNavigationForm" | null;

// 모달 props 타입
type ModalProps = {
  defaultDate?: string;
  taskId?: number;
  [key: string]: unknown;
} | null;

// Context 타입 정의
interface FullScreenModalContextType {
  modalName: ModalName;
  modalProps: ModalProps;
  openModal: (name: ModalName, props?: ModalProps) => void;
  closeModal: () => void;
}

// Context 생성
const FullScreenModalContext = createContext<FullScreenModalContextType | null>(
  null
);

/**
 * 전체화면 모달을 관리하는 Provider
 *
 * 전역에서 전체화면 모달을 표시할 수 있도록 Context를 제공합니다.
 * 다양한 모달 타입(taskForm, retrospectForm, dateNavigationForm)을 지원합니다.
 */
export function FullScreenModalProvider({ children }: { children: ReactNode }) {
  const [modalName, setModalName] = useState<ModalName>(null);
  const [modalProps, setModalProps] = useState<ModalProps>(null);

  // 모달이 열려있을 때 body overflow 숨김
  useEffect(() => {
    if (modalName) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalName]);

  // 모달 열기 함수
  const openModal = useCallback((name: ModalName, props?: ModalProps) => {
    setModalName(name);
    setModalProps(props || null);
  }, []);

  // 모달 닫기 함수
  const closeModal = useCallback(() => {
    setModalName(null);
    setModalProps(null);
  }, []);

  return (
    <FullScreenModalContext.Provider
      value={{ modalName, modalProps, openModal, closeModal }}
    >
      {children}

      {/* 전체화면 모달 렌더링 */}
      <FullScreenModalRenderer
        modalName={modalName}
        modalProps={modalProps}
        closeModal={closeModal}
      />
    </FullScreenModalContext.Provider>
  );
}

// 전체화면 모달 렌더러 컴포넌트
const FullScreenModalRenderer = ({
  modalName,
  modalProps,
  closeModal,
}: {
  modalName: ModalName;
  modalProps: ModalProps;
  closeModal: () => void;
}) => {
  // 회고 모달 훅
  const { onSubmit, onUpdate, onDelete } = useRetrospectModal();

  return (
    <AnimatePresence>
      {modalName === "taskForm" && (
        <FullScreenModal open={true} onClose={closeModal} variant="card">
          <TaskFormModal onClose={closeModal} {...modalProps} />
        </FullScreenModal>
      )}
      {modalName === "retrospectForm" && (
        <FullScreenModal open={true} onClose={closeModal} variant="card">
          <RetrospectModal
            onClose={closeModal}
            onSubmit={onSubmit}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </FullScreenModal>
      )}
      {modalName === "dateNavigationForm" && (
        <BottomSheetModal open={true} onClose={closeModal}>
          <DateNavigationModal onClose={closeModal} />
        </BottomSheetModal>
      )}
    </AnimatePresence>
  );
};

/**
 * 전체화면 모달 Context를 사용하는 커스텀 훅
 *
 * @returns 전체화면 모달 관련 함수들
 * @throws Error - FullScreenModalProvider 외부에서 사용할 경우
 */
export const useFullScreenModal = () => {
  const context = useContext(FullScreenModalContext);
  if (!context) {
    throw new Error(
      "useFullScreenModal must be used within a FullScreenModalProvider"
    );
  }
  return context;
};
