"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AnimatePresence } from "framer-motion";
import { TaskFormModal } from "@/features/myday/components";
import RetrospectModal from "@/features/retrospect/components/RetrospectModal";
import FullScreenModal from "@/components/ui/Modal/components/FullScreenModal";
import BottomSheetModal from "@/components/ui/Modal/components/BottomSheetModal";
import DateNavigationModal from "@/features/retrospect/components/DateNavigationModal";
import { useRetrospectModal } from "@/hooks/useRestrospectModal";

export type ModalName =
  | "taskForm"
  | "retrospectForm"
  | "dateNavigationForm"
  | null;

export interface TaskFormModalProps {
  defaultDate?: string;
}

export type RetrospectModalProps = Record<string, never>;

export type DateNavigationModalProps = Record<string, never>;

type ModalProps =
  | TaskFormModalProps
  | RetrospectModalProps
  | DateNavigationModalProps
  | null;

interface ModalContextType {
  modalName: ModalName;
  modalProps: ModalProps;
  openModal: (name: ModalName, props?: ModalProps) => void;
  closeModal: () => void;
}

const FullScreenModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const FullScreenModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [modalName, setModalName] = useState<ModalName>(null);
  const [modalProps, setModalProps] = useState<ModalProps>(null);

  // 모달 상태에 따라 body overflow 관리
  useEffect(() => {
    if (modalName) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalName]);

  const openModal = useCallback((name: ModalName, props?: ModalProps) => {
    setModalName(name);
    setModalProps(props || null);
  }, []);

  const closeModal = useCallback(() => {
    setModalName(null);
    setModalProps(null);
  }, []);

  return (
    <FullScreenModalContext.Provider
      value={{ modalName, modalProps, openModal, closeModal }}
    >
      {children}
      <FullScreenModalRenderer
        modalName={modalName}
        modalProps={modalProps}
        closeModal={closeModal}
      />
    </FullScreenModalContext.Provider>
  );
};

export const useFullScreenModal = () => {
  const context = useContext(FullScreenModalContext);
  if (!context) {
    throw new Error(
      "useFullScreenModal must be used within a FullScreenModalProvider"
    );
  }
  return context;
};

const FullScreenModalRenderer = ({
  modalName,
  modalProps,
  closeModal,
}: {
  modalName: ModalName;
  modalProps: ModalProps;
  closeModal: () => void;
}) => {
  // 회고 모달용 훅
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
