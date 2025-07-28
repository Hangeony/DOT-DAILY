import React, { ReactNode, useEffect } from "react";
import { modalVariants } from "@/lib/styles/modalVariants";
import { AnimatePresence, motion } from "framer-motion";

interface BottomSheetModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheetModal({
  open,
  onClose,
  children,
}: BottomSheetModalProps) {
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="w-full max-w-md mx-auto min-h-screen shadow-lg absolute inset-0 z-[9999] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* 상단에만 딤드(overlay): 카드 상단까지 정확히 */}
          <div
            className="absolute top-0 left-0 right-0 bg-black/40"
            style={{ height: "calc(100vh)", zIndex: 0 }}
          />
          {/* 바텀시트 카드 */}
          <motion.div
            className={
              modalVariants({ variant: "bottomSheet", size: "full" }) +
              " relative w-full max-w-md mx-auto left-0 right-0 rounded-t-2xl"
            }
            style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 드래그 바: absolute로 맨 위에 고정 */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            {/* 내용 스크롤 영역: 드래그 바와 겹치지 않게 pt-8 */}
            <div className="max-h-[80vh] w-full overflow-y-auto px-4 pb-4 pt-8 relative z-10">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
