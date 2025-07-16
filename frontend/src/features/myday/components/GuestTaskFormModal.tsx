"use client";

import { Input } from "@/components/ui/Input/Input";
import type { Size } from "@/components/ui/Input/Input";
import { DatePicker } from "@/components/ui/Input/DatePicker";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import Image from "next/image";
import { motion } from "framer-motion";
import RadioButton from "@/components/ui/Radio/RadioButton";
import { createGuestTask, updateGuestTask, GuestTask } from "@/lib/api/guestTasks";
import { format, parseISO } from "date-fns";
import { useToast } from "@/components/ui/Toast/ToastProvider";

interface GuestTaskFormModalProps {
  onClose: () => void;
  defaultDate?: string;
  task?: GuestTask;
  defaultPriority?: "must" | "should" | "remind";
  onUpdate?: () => void; // 부모 컴포넌트에서 상태 업데이트를 위한 콜백
}

const inputSize: Size = "md";

// 날짜 파싱 헬퍼 함수
const parseDate = (dateString: string): Date => {
  try {
    return parseISO(dateString);
  } catch {
    return new Date();
  }
};

export default function GuestTaskFormModal({
  onClose,
  defaultDate,
  task,
  defaultPriority = "must",
  onUpdate,
}: GuestTaskFormModalProps) {
  const [label, setLabel] = useState(task ? task.title : "");
  const [priority, setPriority] = useState<"must" | "should" | "remind">(
    task ? task.priority : defaultPriority
  );
  const [date, setDate] = useState<Date | null>(
    task
      ? new Date(task.date)
      : defaultDate
      ? parseDate(defaultDate)
      : new Date()
  );
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!label.trim() || !date) {
      alert("할 일과 날짜를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        title: label.trim(),
        priority,
        date: format(date, "yyyy-MM-dd"),
      };

      console.log("📝 게스트 할 일 저장 시도:", taskData);

      let newOrUpdatedTask: GuestTask | null;
      if (task) {
        // 수정 모드
        console.log("✏️ 수정 모드:", task.id);
        newOrUpdatedTask = updateGuestTask(task.id, taskData);
        if (newOrUpdatedTask) {
          showToast("할 일이 수정되었습니다! ✏️");
        } else {
          throw new Error("할 일 수정에 실패했습니다.");
        }
      } else {
        // 등록 모드
        console.log("➕ 등록 모드");
        newOrUpdatedTask = createGuestTask(taskData);
        showToast("새로운 할 일이 등록되었습니다! ✅");
      }

      console.log("✅ 게스트 할 일 저장 성공:", newOrUpdatedTask);

      // 부모 컴포넌트에서 상태 업데이트
      if (onUpdate) {
        onUpdate();
      }

      onClose();
    } catch (error) {
      console.error("❌ 게스트 할 일 저장 실패:", error);
      showToast("할 일 저장에 실패했습니다 😭");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="guest-task-form-modal"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        ease: "easeOut",
      }}
      className="flex flex-col w-full flex-1"
    >
      <motion.div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 cursor-grab"
        drag="y"
        dragElastic={0.1}
        dragConstraints={{ top: 0, bottom: 150 }}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80) {
            onClose();
          }
        }}
      >
        <button onClick={onClose} aria-label="뒤로가기">
          <Image
            src="/back.svg"
            alt="back"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          />
        </button>
        <h2 className="text-sm text-gray-400">오늘 할 일 (게스트)</h2>
        <div className="w-6" />
      </motion.div>

      <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <label className="font-semibold">오늘 할 일을 적어주세요</label>
          <Input
            variant="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="뭘 할 건가요?"
            size={inputSize}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">우선순위를 선택해주세요</label>
          <div className="space-y-3 mt-2">
            <RadioButton
              name="priority"
              value="must"
              variant="must"
              checked={priority === "must"}
              onChange={() => setPriority("must")}
              label={
                <>
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 mr-1 rounded-full bg-priority-must text-white text-xs font-bold text-center"
                    style={{ lineHeight: "1.3rem" }}
                  >
                    1
                  </span>
                  <span className="text-red-500">오늘 무조건</span>
                </>
              }
            />
            <RadioButton
              name="priority"
              value="should"
              variant="should"
              checked={priority === "should"}
              onChange={() => setPriority("should")}
              label={
                <>
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 mr-1 rounded-full bg-priority-should text-white text-xs font-bold text-center"
                    style={{ lineHeight: "1.3rem" }}
                  >
                    2
                  </span>
                  <span className="text-emerald-500">오늘이면 굿</span>
                </>
              }
            />
            <RadioButton
              name="priority"
              value="remind"
              variant="remind"
              checked={priority === "remind"}
              onChange={() => setPriority("remind")}
              label={
                <>
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 mr-1 rounded-full bg-priority-remind text-white text-xs font-bold text-center"
                    style={{ lineHeight: "1.3rem" }}
                  >
                    3
                  </span>
                  <span className="text-blue-500">잊지말자</span>
                </>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">날짜를 선택해주세요</label>
          <DatePicker
            value={date}
            onChange={setDate}
          />
        </div>
      </div>

      <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-gray-200">
        <Button
          label={isLoading ? "저장 중..." : task ? "수정하기" : "등록하기"}
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full"
        />
      </div>
    </motion.div>
  );
} 