"use client";

import React, { useState, useMemo } from "react";
import { Menu } from "@headlessui/react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarClock,
  RefreshCw,
} from "@/components/ui/Icon";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import {
  deleteTask,
  Task,
  toggleTaskStatus,
  moveToArchive,
  moveToRetry,
} from "@/lib/api/tasks";

import { useDateStore } from "@/store/useDateStore";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useConfirm } from "@/components/ui/Modal/providers/ModalProvider";
import useAuthStore from "@/store/useAuthStore";

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

interface TaskItemProps {
  task: CommonTask;
  onEdit?: (task: CommonTask) => void;
}

// 완료 시 파티클 효과 컴포넌트 - 메모이제이션 적용
const CompletionParticles = React.memo(({ show }: { show: boolean }) => {
  const particles = useMemo(() => Array.from({ length: 4 }, (_, i) => i), []);

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((index) => {
            const randomX = (Math.random() - 0.5) * 100;
            const randomY = (Math.random() - 0.5) * 100;
            const randomRotate = Math.random() * 360;
            const emojis = ["✨", "🎉", "⭐"];
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];

            return (
              <motion.div
                key={index}
                className="absolute text-sm"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: randomX,
                  y: randomY,
                  opacity: 0,
                  scale: 1,
                  rotate: randomRotate,
                }}
                transition={{
                  type: "tween",
                  duration: 0.8,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                {emoji}
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
});

CompletionParticles.displayName = "CompletionParticles";

const TaskItem = React.memo(function TaskItem({
  task,
  onEdit = () => {},
}: TaskItemProps) {
  const queryClient = useQueryClient();
  const { selectedDate } = useDateStore();
  const { showToast } = useToast();
  const [showParticles, setShowParticles] = useState(false);
  const confirm = useConfirm();
  const { isGuest } = useAuthStore();

  // 게스트 모드용 로컬 스토리지 함수들
  const updateGuestTaskStatus = (taskId: string, completed: boolean) => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const stored = localStorage.getItem(`guest-tasks-${dateStr}`);
    if (stored) {
      try {
        const tasks = JSON.parse(stored);
        const updatedTasks = tasks.map((t: Record<string, unknown>) =>
          t.id === taskId ? { ...t, completed } : t
        );
        localStorage.setItem(
          `guest-tasks-${dateStr}`,
          JSON.stringify(updatedTasks)
        );
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const deleteGuestTask = (taskId: string) => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const stored = localStorage.getItem(`guest-tasks-${dateStr}`);
    if (stored) {
      try {
        const tasks = JSON.parse(stored);
        const updatedTasks = tasks.filter(
          (t: Record<string, unknown>) => t.id !== taskId
        );
        localStorage.setItem(
          `guest-tasks-${dateStr}`,
          JSON.stringify(updatedTasks)
        );
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const handleToggleStatus = async () => {
    if (isGuest) {
      // 게스트 모드: 로컬 스토리지 업데이트
      const taskId = task.id as string;
      const currentCompleted = task.completed || false;
      const newCompleted = !currentCompleted;

      if (updateGuestTaskStatus(taskId, newCompleted)) {
        // 페이지 새로고침으로 상태 업데이트
        window.location.reload();

        if (newCompleted) {
          setShowParticles(true);
          setTimeout(() => setShowParticles(false), 1000);
          showToast("할 일을 완료했습니다! 🎉");
        } else {
          showToast("할 일 완료가 취소되었습니다.");
        }
      } else {
        showToast("상태 변경에 실패했습니다 😞");
      }
      return;
    }

    // 인증된 사용자: 서버 API 사용
    const originalStatus = task.status;

    try {
      console.log("🔄 체크박스 클릭:", {
        taskId: task.id,
        currentStatus: originalStatus,
        title: task.title,
      });

      const updatedTask = await toggleTaskStatus(
        task.id as number,
        originalStatus!
      );

      console.log("✅ 서버 응답:", {
        id: updatedTask.id,
        title: updatedTask.title,
        newStatus: updatedTask.status,
        type: typeof updatedTask.status,
        eqSuccess: updatedTask.status === "success",
      });

      const dateKey = selectedDate.toISOString().split("T")[0];
      queryClient.invalidateQueries({ queryKey: ["tasks", dateKey] });

      if (originalStatus !== updatedTask.status) {
        console.log("토스트 분기 체크:", {
          originalStatus,
          updatedStatus: updatedTask.status,
          eq: updatedTask.status === "success",
          trimmed: updatedTask.status && updatedTask.status.trim(),
        });
        if (
          typeof updatedTask.status === "string" &&
          updatedTask.status.trim().toLowerCase() === "success"
        ) {
          setShowParticles(true);
          setTimeout(() => setShowParticles(false), 1000);
          showToast("할 일을 완료했습니다! 🎉");
        } else {
          showToast("할 일 완료가 취소되었습니다.");
        }
      }
    } catch (error) {
      console.error("상태 변경 실패:", error);
      showToast("상태 변경에 실패했습니다 😞");
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm("정말로 이 할 일을 삭제하시겠습니까?");
    if (!confirmed) return;

    if (isGuest) {
      // 게스트 모드: 로컬 스토리지에서 삭제
      const taskId = task.id as string;
      if (deleteGuestTask(taskId)) {
        window.location.reload();
        showToast("할 일이 삭제되었습니다 🗑️");
      } else {
        showToast("할 일 삭제에 실패했습니다 😞");
      }
      return;
    }

    // 인증된 사용자: 서버 API 사용
    try {
      await deleteTask(task.id as number);

      const dateKey = selectedDate.toISOString().split("T")[0];
      queryClient.setQueryData(["tasks", dateKey], (old: Task[]) => {
        return old?.filter((t) => t.id !== task.id) || [];
      });

      showToast("할 일이 삭제되었습니다 🗑️");
    } catch (error) {
      console.error("삭제 실패:", error);
      showToast("할 일 삭제에 실패했습니다 😞");
    }
  };

  const handleRetry = async () => {
    if (isGuest) {
      showToast(
        "게스트 모드에서는 재시도 기능을 사용할 수 없습니다. 로그인해주세요."
      );
      return;
    }

    const confirmed = await confirm(
      "이 할 일을 다음날로 재시도 이동하시겠습니까?"
    );
    if (!confirmed) return;

    try {
      const result = await moveToRetry(task.id as number);

      // 할 일의 원래 날짜를 기준으로 캐시 처리
      const taskDateKey = task.date; // 할 일의 실제 날짜
      const currentDateKey = selectedDate.toISOString().split("T")[0];

      // 현재 보고 있는 날짜에서 할 일 제거
      queryClient.setQueryData(["tasks", currentDateKey], (old: Task[] = []) =>
        old.filter((t) => t.id !== task.id)
      );

      // 할 일의 원래 날짜와 현재 날짜가 다르면 원래 날짜 캐시도 무효화
      if (taskDateKey !== currentDateKey) {
        queryClient.invalidateQueries({ queryKey: ["tasks", taskDateKey] });
      }

      // 여러 날짜의 캐시를 무효화 (백엔드 날짜 계산 불확실성 대응)
      const today = new Date(selectedDate);
      const tomorrow = new Date(selectedDate);
      const dayAfterTomorrow = new Date(selectedDate);

      tomorrow.setDate(tomorrow.getDate() + 1);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      const todayKey = today.toISOString().split("T")[0];
      const tomorrowKey = tomorrow.toISOString().split("T")[0];
      const dayAfterTomorrowKey = dayAfterTomorrow.toISOString().split("T")[0];

      // 오늘, 내일, 모레 캐시 모두 무효화
      queryClient.invalidateQueries({ queryKey: ["tasks", todayKey] });
      queryClient.invalidateQueries({ queryKey: ["tasks", tomorrowKey] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", dayAfterTomorrowKey],
      });

      showToast("할 일이 다음날로 재시도 이동되었습니다! 🔄✨");
    } catch (error) {
      console.error("재시도 이동 실패:", error);
      showToast("재시도 이동에 실패했습니다 😞");
    }
  };

  const handlePostpone = async () => {
    if (isGuest) {
      showToast(
        "게스트 모드에서는 보류 기능을 사용할 수 없습니다. 로그인해주세요."
      );
      return;
    }

    const confirmed = await confirm("이 할 일을 보류함으로 이동하시겠습니까?");
    if (!confirmed) return;

    try {
      await moveToArchive(task.id as number);

      const dateKey = selectedDate.toISOString().split("T")[0];
      // 1. MyDay 캐시에서 즉시 제거 (optimistic)
      queryClient.setQueryData(["tasks", dateKey], (old: Task[] = []) =>
        old.filter((t) => t.id !== task.id)
      );

      // 2. 보류함만 invalidate (MyDay는 setQueryData로 이미 반영됨)
      await queryClient.invalidateQueries({ queryKey: ["archiveTasks"] });

      showToast("할 일이 보류함으로 이동되었습니다 📦");
    } catch {
      showToast("할 일 보류에 실패했습니다 😞");
    }
  };

  // 완료 상태 확인 (게스트 모드와 인증 모드 모두 지원)
  const isCompleted = isGuest
    ? task.completed || false
    : task.status === "success";

  const titleClassName = useMemo(
    () =>
      clsx(
        "text-sm font-medium transition-colors duration-200",
        isCompleted ? "line-through text-gray-500" : "text-gray-900"
      ),
    [isCompleted]
  );

  return (
    <div
      className={clsx(
        "relative flex items-center gap-3 p-3 rounded-lg border shadow-sm will-change-auto",
        {
          "bg-orange-50 border-orange-200": !isGuest && task.status === "retry",
          "bg-white border-gray-200": isGuest || task.status !== "retry",
        }
      )}
    >
      <CompletionParticles show={showParticles} />

      <div className="flex-shrink-0">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggleStatus}
          variant={task.priority}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={titleClassName}>{task.title}</h3>
          {!isGuest && task.status === "retry" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold whitespace-nowrap">
              <RefreshCw className="w-3 h-3" />
              {task.retryCount ? `${task.retryCount}회 재시도` : "재시도"}
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <Menu as="div" className="relative">
          <Menu.Button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="할 일 옵션 메뉴"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-[100] mt-2 min-w-[120px] w-32 max-w-[90vw] origin-top-right bg-surface-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-48 overflow-y-auto">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onEdit(task)}
                    className={clsx(
                      "flex items-center w-full px-4 py-2 text-sm text-text-default transition-colors",
                      active && "bg-surface-hover"
                    )}
                  >
                    <Pencil className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">수정</span>
                  </button>
                )}
              </Menu.Item>
              {!isGuest && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleRetry}
                      className={clsx(
                        "flex items-center w-full px-4 py-2 text-sm text-text-default transition-colors",
                        active && "bg-surface-hover"
                      )}
                    >
                      <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="whitespace-nowrap">재시도로 이동</span>
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleDelete}
                    className={clsx(
                      "flex items-center w-full px-4 py-2 text-sm text-text-default transition-colors",
                      active && "bg-surface-hover"
                    )}
                  >
                    <Trash2 className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">삭제</span>
                  </button>
                )}
              </Menu.Item>
              {!isGuest && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handlePostpone}
                      className={clsx(
                        "flex items-center w-full px-4 py-2 text-sm text-text-default transition-colors",
                        active && "bg-surface-hover"
                      )}
                    >
                      <CalendarClock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="whitespace-nowrap">보류</span>
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
});

export default React.memo(TaskItem);
