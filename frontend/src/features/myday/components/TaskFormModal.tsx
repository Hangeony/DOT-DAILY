"use client";

import { Input } from "@/components/ui/Input/Input";
import type { Size } from "@/components/ui/Input/Input";
import { DatePicker } from "@/components/ui/Input/DatePicker";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { motion } from "framer-motion";
import RadioButton from "@/components/ui/Radio/RadioButton";
import { createTask, updateTask, Task } from "@/lib/api/tasks";
import { useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useToast } from "@/components/ui/Toast/ToastProvider";

// 공통 Task 인터페이스 (Task와 GuestTask를 모두 포함)
interface CommonTask {
  id: string | number;
  title: string;
  priority: "must" | "should" | "remind";
  date: string;
  createdAt: string;
  updatedAt?: string;
  // Task의 경우
  status?: "pending" | "success" | "retry" | "archive";
  retryCount?: number;
  // GuestTask의 경우
  completed?: boolean;
}

interface TaskFormModalProps {
  onClose: () => void;
  defaultDate?: string;
  task?: CommonTask;
  defaultPriority?: "must" | "should" | "remind";
  isGuest?: boolean;
  onSuccess?: () => void; // 게스트 모드에서 성공 시 호출할 콜백
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

// 한국 시간대 기준으로 오늘 날짜를 가져오는 함수
const getTodayInKorea = (): Date => {
  const now = new Date();
  const koreaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  return koreaTime;
};

export default function TaskFormModal({
  onClose,
  defaultDate,
  task,
  defaultPriority = "must",
  isGuest = false,
  onSuccess,
}: TaskFormModalProps) {
  const [label, setLabel] = useState(task ? task.title : "");
  const [priority, setPriority] = useState<"must" | "should" | "remind">(
    task ? task.priority : defaultPriority
  );
  const [date, setDate] = useState<Date | null>(
    task
      ? new Date(task.date)
      : defaultDate
      ? parseDate(defaultDate)
      : getTodayInKorea()
  );
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // 게스트 모드용 로컬 스토리지 함수들
  const saveGuestTask = (taskData: {
    title: string;
    priority: "must" | "should" | "remind";
    date: string;
  }) => {
    const dateStr = taskData.date;
    const stored = localStorage.getItem(`guest-tasks-${dateStr}`);
    const existingTasks = stored ? JSON.parse(stored) : [];

    const newTask = {
      id: task
        ? task.id
        : `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: taskData.title,
      priority: taskData.priority,
      completed: false,
      date: taskData.date,
      createdAt: task ? task.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedTasks;
    if (task) {
      // 수정 모드
      updatedTasks = existingTasks.map((t: CommonTask) =>
        t.id === task.id ? { ...t, ...newTask } : t
      );
    } else {
      // 새로 생성
      updatedTasks = [...existingTasks, newTask];
    }

    localStorage.setItem(
      `guest-tasks-${dateStr}`,
      JSON.stringify(updatedTasks)
    );
    return true;
  };

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

      console.log("📝 할 일 저장 시도:", taskData);

      if (isGuest) {
        // 게스트 모드: 로컬 스토리지에 저장
        if (saveGuestTask(taskData)) {
          showToast(
            task
              ? "할 일이 수정되었습니다! ✏️"
              : "새로운 할 일이 등록되었습니다! ✅"
          );
          // 성공 콜백 호출로 상태 업데이트 (페이지 새로고침 대신)
          if (onSuccess) {
            onSuccess();
          }
        } else {
          showToast("할 일 저장에 실패했습니다 😭");
        }
        onClose();
        return;
      }

      // 인증된 사용자: 서버 API 사용
      let newOrUpdatedTask: Task;
      if (task) {
        // 수정 모드
        console.log("✏️ 수정 모드:", task.id);
        newOrUpdatedTask = await updateTask(task.id as number, taskData);
        showToast("할 일이 수정되었습니다! ✏️");
      } else {
        // 등록 모드
        console.log("➕ 등록 모드");
        newOrUpdatedTask = await createTask(taskData);
        showToast("새로운 할 일이 등록되었습니다! ✅");
      }

      console.log("✅ 할 일 저장 성공:", newOrUpdatedTask);

      // React Query 캐시 무효화 (특정 날짜의 tasks 쿼리만 새로고침)
      const dateKey = format(date, "yyyy-MM-dd");
      queryClient.invalidateQueries({ queryKey: ["tasks", dateKey] });

      onClose();
    } catch (error) {
      console.error("❌ 할 일 저장 실패:", error);
      showToast("할 일 저장에 실패했습니다 😭");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="h-full max-h-screen flex flex-col bg-white"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      {/* 헤더 - 고정 */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
        >
          <img src="/back.svg" alt="뒤로 가기" width={24} height={24} />
        </button>
        <h2 className="text-lg font-semibold">
          {task ? "할 일 수정" : "할 일 등록"}
        </h2>
        <div className="w-6 h-6" /> {/* 우측 여백 */}
      </div>

      {/* 내용 - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-6 py-4 space-y-6 pb-32">
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
            <DatePicker value={date} onChange={setDate} size="md" />
          </div>

          {isGuest && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                💡 게스트 모드에서는 데이터가 로컬에만 저장됩니다. 로그인하면
                모든 기기에서 데이터를 동기화할 수 있어요!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 푸터 - 고정 */}
      <div className="flex-shrink-0 px-4 py-4 bg-white border-t border-gray-100 shadow-lg safe-area-inset-bottom">
        <Button
          size="lg"
          variant="primary"
          className="w-full rounded-full"
          onClick={handleSubmit}
          disabled={isLoading || !label.trim()}
        >
          {isLoading
            ? task
              ? "수정 중..."
              : "등록 중..."
            : task
            ? "수정하기"
            : "할 일 등록하기"}
        </Button>
      </div>
    </motion.div>
  );
}
