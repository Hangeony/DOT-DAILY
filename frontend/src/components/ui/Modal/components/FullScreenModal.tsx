import { ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FullScreenModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: "full" | "card" | "bottomSheet";
}

export default function FullScreenModal({
  open,
  onClose,
  children,
  variant = "card",
}: FullScreenModalProps) {
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // 스타일 분기
  let modalClass = "";
  let overlay = null;
  let containerClass = "fixed inset-0 z-[9999] flex h-screen";
  if (variant === "bottomSheet") {
    containerClass += " items-end justify-center";
  } else {
    containerClass += " items-center justify-center";
  }

  if (variant === "full") {
    modalClass =
      "relative w-full h-full max-w-md mx-auto flex flex-col bg-white overflow-hidden";
    overlay = null;
  } else if (variant === "card") {
    modalClass =
      "relative w-full h-full max-w-md mx-auto flex flex-col bg-white overflow-hidden";
    overlay = null;
  } else if (variant === "bottomSheet") {
    modalClass =
      "relative w-full max-w-md mx-auto flex flex-col bg-white rounded-t-2xl overflow-hidden h-[60vh]";
    overlay = (
      <motion.div
        className="absolute inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={containerClass}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {variant === "bottomSheet" ? (
            <>
              {/* 상단에만 딤드 */}
              <div
                className="absolute top-0 left-0 right-0 bg-black/40 z-0 pointer-events-none"
                style={{ height: "40vh" }} // 카드 높이가 60vh라면 상단 40vh만 딤드
              />
              {/* 카드(모달) */}
              <motion.div
                className={modalClass + " z-10 pointer-events-auto"}
                initial={{ y: 0 }}
                animate={{ y: 0 }}
                exit={{ y: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                style={{ position: "relative" }}
              >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2 mb-1" />
                {children}
              </motion.div>
            </>
          ) : (
            <>
              {overlay}
              <motion.div
                className={modalClass}
                initial={{ y: 0 }}
                animate={{ y: 0 }}
                exit={{ y: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                style={{ zIndex: 1, position: "relative" }}
              >
                {children}
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
