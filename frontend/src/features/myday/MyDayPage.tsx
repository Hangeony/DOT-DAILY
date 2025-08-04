"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import MobileLayout from "@/components/layout/MobileLayout";
import {
  DateHeader,
  TaskListSkeleton,
  TaskFormModal,
} from "@/features/myday/components";
import { useDateStore } from "@/store/useDateStore";
import { getTasksByDate, updateTask } from "@/lib/api/tasks";
import { getGuestTasksByDate, updateGuestTask } from "@/lib/api/guestTasks";
import FullScreenModal from "@/components/ui/Modal/components/FullScreenModal";
import { useTaskCompletion } from "@/hooks/useTaskCompletion";
import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { DropResult } from "@hello-pangea/dnd";
import useAuthStore from "@/store/useAuthStore";
import { CommonTask } from "@/types";
// ⚡ 성능 최적화: Dynamic imports 개선
const DragDropWrapper = dynamic(
  () => import("@/components/ui/DragDrop/DragDropWrapper"),
  {
    ssr: false,
    loading: () => <div className="min-h-screen" />,
  }
);

const TaskGroup = dynamic(
  () =>
    import("@/components/ui/DragDrop/DragDropWrapper").then((mod) => ({
      default: mod.TaskGroup,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

// 클라이언트 사이드에서만 로드 (성능 최적화)
const CelebrationEffect = dynamic(
  () => import("@/components/ui/CelebrationEffect/CelebrationEffect"),
  {
    ssr: false,
    loading: () => <div />,
  }
);

// 게스트 모드용 통합 API 커스텀 훅
function useGuestTasks(date: Date) {
  const [guestTasks, setGuestTasks] = useState<CommonTask[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // guestTasks.ts API 사용하여 해당 날짜의 태스크만 가져오기
    const tasksForDate = getGuestTasksByDate(date);
    setGuestTasks(tasksForDate);

    // 게스트 태스크 업데이트 이벤트 리스너 추가
    const handleGuestTaskUpdate = () => {
      const updatedTasks = getGuestTasksByDate(date);
      setGuestTasks(updatedTasks);
    };

    window.addEventListener("guestTaskUpdated", handleGuestTaskUpdate);

    return () => {
      window.removeEventListener("guestTaskUpdated", handleGuestTaskUpdate);
    };
  }, [date]);

  const refreshGuestTasks = useCallback(() => {
    if (typeof window === "undefined") return;

    const tasksForDate = getGuestTasksByDate(date);
    setGuestTasks(tasksForDate);
  }, [date]);

  return { guestTasks, refreshGuestTasks };
}

export default function MyDayPage() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const { isGuest, isInitialized } = useAuthStore();
  const queryClient = useQueryClient();

  // URL 파라미터에서 날짜 확인 및 설정
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get("date");

    if (dateParam) {
      try {
        // 한국 시간 기준으로 날짜 파싱
        const [year, month, day] = dateParam.split("-").map(Number);
        const newDate = new Date(year, month - 1, day); // month는 0-based
        if (!isNaN(newDate.getTime())) {
          setSelectedDate(newDate);
          // URL에서 파라미터 제거
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
        }
      } catch (error) {
        console.error("Invalid date parameter:", error);
      }
    }
  }, [setSelectedDate]);

  // 현재 날짜 데이터 로드
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks", selectedDate.toISOString().split("T")[0]],
    queryFn: () => getTasksByDate(selectedDate),
    enabled: isInitialized && !isGuest && typeof window !== "undefined",
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });

  // 🚀 성능 최적화: 프리페칭 변수 제거 (사용하지 않음)
  // const nextDate = useMemo(() => {
  //   const next = new Date(selectedDate);
  //   next.setDate(next.getDate() + 1);
  //   return next;
  // }, [selectedDate]);

  // const prevDate = useMemo(() => {
  //   const prev = new Date(selectedDate);
  //   prev.setDate(prev.getDate() - 1);
  //   return prev;
  // }, [selectedDate]);

  // 🚀 성능 최적화: 프리페칭 비활성화 (필요시에만 로드)
  // useQuery({
  //   queryKey: ["tasks", nextDate.toISOString().split("T")[0]],
  //   queryFn: () => getTasksByDate(nextDate),
  //   enabled: isInitialized && !isGuest && typeof window !== "undefined",
  //   staleTime: 1000 * 60 * 10,
  // });

  // useQuery({
  //   queryKey: ["tasks", prevDate.toISOString().split("T")[0]],
  //   queryFn: () => getTasksByDate(prevDate),
  //   enabled: isInitialized && !isGuest && typeof window !== "undefined",
  //   staleTime: 1000 * 60 * 10,
  // });

  // 게스트 모드용 상태
  const { guestTasks, refreshGuestTasks } = useGuestTasks(selectedDate);

  // 모달 상태
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<CommonTask | null>(null);
  const [defaultPriority, setDefaultPriority] = useState<
    "must" | "should" | "remind"
  >("must");

  // 완료 축하 효과 훅
  const { showCelebration, hideCelebration } = useTaskCompletion({
    tasks: isGuest ? guestTasks : tasks,
  });

  // 게스트 모드 성공 콜백
  const handleGuestTaskSuccess = useCallback(() => {
    // guestTasks.ts API를 사용하여 최신 데이터 새로고침
    refreshGuestTasks();
  }, [refreshGuestTasks]);

  // 태스크 그룹별 분류
  const { mustTasks, shouldTasks, remindTasks } = useMemo(() => {
    const currentTasks = isGuest ? guestTasks : tasks;
    return {
      mustTasks: currentTasks.filter((t) => t.priority === "must"),
      shouldTasks: currentTasks.filter((t) => t.priority === "should"),
      remindTasks: currentTasks.filter((t) => t.priority === "remind"),
    };
  }, [isGuest, guestTasks, tasks]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditTask(null);
  }, []);

  const handleFabClick = useCallback(() => setOpen(true), []);

  const handleEmptyClick = useCallback(
    (priority: "must" | "should" | "remind") => {
      setEditTask(null);
      setDefaultPriority(priority);
      setOpen(true);
    },
    []
  );

  const handleEdit = useCallback((task: CommonTask) => {
    setEditTask(task);
    setOpen(true);
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    // 같은 그룹 내 이동
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "must") {
        const reordered = Array.from(mustTasks);
        const [removed] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, removed);
        // 여기서 순서 업데이트 로직 추가 가능
      } else if (source.droppableId === "should") {
        const reordered = Array.from(shouldTasks);
        const [removed] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, removed);
      } else if (source.droppableId === "remind") {
        const reordered = Array.from(remindTasks);
        const [removed] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, removed);
      }
    } else {
      // 그룹 간 이동
      let sourceArr, destArr, newPriority;
      if (source.droppableId === "must") {
        sourceArr = Array.from(mustTasks);
      } else if (source.droppableId === "should") {
        sourceArr = Array.from(shouldTasks);
      } else {
        sourceArr = Array.from(remindTasks);
      }

      if (destination.droppableId === "must") {
        destArr = Array.from(mustTasks);
        newPriority = "must";
      } else if (destination.droppableId === "should") {
        destArr = Array.from(shouldTasks);
        newPriority = "should";
      } else {
        destArr = Array.from(remindTasks);
        newPriority = "remind";
      }

      const [removed] = sourceArr.splice(source.index, 1);
      const updated = {
        ...removed,
        priority: newPriority as "must" | "should" | "remind",
      };
      destArr.splice(destination.index, 0, updated);

      // 게스트 모드일 때는 guestTasks API 사용
      if (isGuest) {
        // 우선순위가 변경된 태스크를 updateGuestTask API로 업데이트
        const updatedTask = updateGuestTask(updated.id as string, {
          priority: newPriority as "must" | "should" | "remind",
        });

        if (updatedTask) {
          // 성공적으로 업데이트되면 UI 새로고침
          refreshGuestTasks();
        }
      } else {
        // 서버에 priority 변경 동기화
        if (typeof updated.id === "number") {
          await updateTask(updated.id, {
            priority: newPriority as "must" | "should" | "remind",
          });
          // 특정 날짜의 캐시만 무효화
          const dateKey = selectedDate.toISOString().split("T")[0];
          queryClient.invalidateQueries({ queryKey: ["tasks", dateKey] });
        }
      }
    }
  };

  // 에러 메시지 메모이제이션
  const errorMessage = useMemo(() => {
    if (!isError) return null;
    const message = error instanceof Error ? error.message : String(error);
    return message.includes("timeout") || message.includes("ECONNABORTED")
      ? "timeout"
      : "error";
  }, [isError, error]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <MobileLayout headerTitle="나의 하루" showFab={false}>
        <div className="px-4 py-6">
          <DateHeader />
          <TaskListSkeleton />
        </div>
      </MobileLayout>
    );
  }

  // 에러 발생 시
  if (isError) {
    return (
      <MobileLayout headerTitle="나의 하루" showFab={false}>
        <div className="px-4 py-6">
          <DateHeader />
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              데이터를 불러올 수 없습니다
            </h2>
            <p className="text-gray-600 mb-6">
              {errorMessage === "timeout"
                ? "네트워크 연결을 확인해주세요."
                : "잠시 후 다시 시도해주세요."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      headerTitle="나의 하루"
      showFab={true}
      onFabClick={handleFabClick}
    >
      <div className="sticky top-0 z-10 bg-surface-base">
        <DateHeader />
      </div>
      <DragDropWrapper onDragEnd={handleDragEnd}>
        <div className="px-4 py-16 space-y-8 min-h-screen">
          <TaskGroup
            priority="must"
            title="오늘 무조건"
            tasks={mustTasks}
            droppableId="must"
            onEmptyClick={() => handleEmptyClick("must")}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
          <TaskGroup
            priority="should"
            title="오늘이면 굿"
            tasks={shouldTasks}
            droppableId="should"
            onEmptyClick={() => handleEmptyClick("should")}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
          <TaskGroup
            priority="remind"
            title="잊지말자"
            tasks={remindTasks}
            droppableId="remind"
            onEmptyClick={() => handleEmptyClick("remind")}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
        </div>
      </DragDropWrapper>

      <FullScreenModal open={open} onClose={handleClose} variant="full">
        <TaskFormModal
          onClose={handleClose}
          defaultDate={selectedDate.toLocaleDateString("en-CA")} // YYYY-MM-DD 형식으로 한국 시간대 사용
          task={editTask || undefined}
          defaultPriority={defaultPriority}
          isGuest={isGuest}
          onSuccess={handleGuestTaskSuccess}
        />
      </FullScreenModal>

      {/* 모든 할 일 완료 축하 효과 */}
      <CelebrationEffect show={showCelebration} onComplete={hideCelebration} />
    </MobileLayout>
  );
}
