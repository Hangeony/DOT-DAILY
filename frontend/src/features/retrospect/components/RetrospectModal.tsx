"use client";

import { Button } from "@/components/ui/Button/Button";
import EmotionSelector from "./EmotionSelector";
import { motion } from "framer-motion";
import { useDateStore } from "@/store/useDateStore";
import { useRetrospectStore } from "@/store/useRestrospectStore";
import {
  formatDateToString,
  formatDisplayDate,
} from "../../../utils/retrospectUtils";
import { useState, useEffect, useMemo } from "react";

import { Emotion } from "@/constants/emotion";

interface RetrospectModalProps {
  onClose: () => void;
  onSubmit: (emotion: Emotion["id"] | "", retrospectText: string) => void;
  onUpdate: (emotion: Emotion["id"] | "", retrospectText: string) => void;
  onDelete?: () => void;
}

export default function RetrospectModal({
  onClose,
  onSubmit,
  onUpdate,
}: RetrospectModalProps) {
  const { selectedDate } = useDateStore();
  const { emotionMemoList } = useRetrospectStore();

  // 현재 선택된 날짜의 기존 회고 데이터 찾기
  const existingMemo = useMemo(() => {
    return emotionMemoList.find(
      (item) =>
        formatDateToString(item.date) === formatDateToString(selectedDate)
    );
  }, [emotionMemoList, selectedDate]);

  const isEditMode = !!existingMemo;

  const [retrospectText, setRetrospectText] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion["id"] | "">(
    ""
  );

  // 수정 모드일 때 기존 데이터로 초기화
  useEffect(() => {
    if (existingMemo) {
      setRetrospectText(existingMemo.memo);
      setSelectedEmotion(existingMemo.emotion);
    }
  }, [existingMemo]);

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRetrospectText(e.target.value);
  };

  const onRetrospectSubmit = () => {
    // 빈 텍스트 체크
    if (!retrospectText.trim()) {
      return;
    }

    if (isEditMode) {
      onUpdate(selectedEmotion, retrospectText);
    } else {
      onSubmit(selectedEmotion, retrospectText);
    }
  };

  return (
    <motion.div
      key="retrospect-modal"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="h-full max-h-screen flex flex-col bg-white"
    >
      {/* 헤더 - 고정 */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
        <button
          onClick={onClose}
          aria-label="뒤로가기"
          className="text-gray-600 hover:text-gray-800"
        >
          <img src="/back.svg" alt="back" className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">
          {isEditMode ? "회고 수정" : "오늘 회고"}
        </h2>
        <div className="w-6 h-6" />
      </div>

      {/* 내용 - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-6 py-4 space-y-6 pb-32">
          <EmotionSelector
            selectedEmotion={selectedEmotion}
            setSelectedEmotion={setSelectedEmotion}
          />
          <section aria-label="회고 작성">
            <label className="font-kkonghae font-semibold block mb-2">
              {formatDisplayDate(selectedDate)}
            </label>
            <textarea
              value={retrospectText}
              onChange={onTextChange}
              placeholder="오늘 하루는 어떠셨나요? 자유롭게 작성해보세요."
              maxLength={3000}
              className="font-kkonghae w-full h-40 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right text-xs text-gray-600 mt-1">
              {retrospectText.length}/3000
            </div>
          </section>
        </div>
      </div>

      {/* 푸터 - 고정 */}
      <div className="flex-shrink-0 px-4 py-4 bg-white border-t border-gray-100 shadow-lg safe-area-inset-bottom">
        <Button
          label={isEditMode ? "회고 수정하기" : "오늘 회고 등록하기"}
          size="lg"
          variant="primary"
          disabled={!selectedEmotion || !retrospectText.trim()}
          rounded="full"
          fullWidth={true}
          onClick={onRetrospectSubmit}
        />
      </div>
    </motion.div>
  );
}
