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
import Image from "next/image";
import { Emotion } from "@/constants/emotion";
import { Trash2 } from "lucide-react";

interface RetrospectModalProps {
  onClose: () => void;
  onSubmit: (emotion: Emotion["id"] | "", retrospectText: string) => void;
  onUpdate: (emotion: Emotion["id"] | "", retrospectText: string) => void;
  onDelete: () => void;
}

export default function RetrospectModal({
  onClose,
  onSubmit,
  onUpdate,
  onDelete,
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
      className="flex flex-col flex-1"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={onClose} aria-label="뒤로가기">
          <Image src="/back.svg" alt="back" width={24} height={24} />
        </button>
        <h2 className="text-sm text-gray-400">
          {isEditMode ? "회고 수정" : "오늘 회고"}
        </h2>
        {isEditMode && (
          <button
            onClick={onDelete}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="회고 삭제"
          >
            <Trash2 className="w-5 h-5 text-gray-500" />
          </button>
        )}
        {!isEditMode && <div className="w-6" />}
      </div>

      <div className="flex-1 px-6 py-4">
        <EmotionSelector
          selectedEmotion={selectedEmotion}
          setSelectedEmotion={setSelectedEmotion}
        />
        <section aria-label="회고 작성">
          <label className="font-kkonghae">
            {formatDisplayDate(selectedDate)}
          </label>
          <textarea
            value={retrospectText}
            onChange={onTextChange}
            placeholder="오늘 하루는 어떠셨나요? 자유롭게 작성해보세요."
            maxLength={3000}
            className="font-kkonghae w-full h-40 p-4 mt-2 border border-gray-200 rounded-lg resize-none"
          />
          <div className="text-right text-xs text-gray-400">
            {retrospectText.length}/3000
          </div>
        </section>
      </div>

      <div className="px-4 pb-6">
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
