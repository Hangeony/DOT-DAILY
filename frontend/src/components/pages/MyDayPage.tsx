"use client";

import { useQuery } from "@tanstack/react-query";
import MobileLayout from "@/components/layout/MobileLayout";
import {
  TaskGroup,
  DateHeader,
  TaskListSkeleton,
  TaskFormModal,
} from "@/features/myday/components";
import { Plus } from "lucide-react";
import Fab from "@/components/ui/Fab/Fab";
import { useDateStore } from "@/store/useDateStore";
import { getTasksByDate, Task, updateTask } from "@/lib/api/tasks";
import FullScreenModal from "@/components/ui/Modal/components/FullScreenModal";
import { useTaskCompletion } from "@/hooks/useTaskCompletion";
import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useAuthStore } from "@/store/useAuthStore";

// 클라이언트 사이드에서만 로드
const CelebrationEffect = dynamic(
  () => import("@/components/ui/CelebrationEffect/CelebrationEffect"),
  { ssr: false }
);

// 게스트 모드용 로컬 스토리지 타입
interface GuestTask {
  id: string;
  title: string;
  priority: "must" | "should" | "remind";
  completed: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

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

export default function MyDayPage() {
  const { selectedDate } = useDateStore();
  const { isGuest } = useAuthStore();
  const [editTask, setEditTask] = useState<CommonTask | null>(null);
  const [open, setOpen] = useState(false);
  const [defaultPriority, setDefaultPriority] = useState<
    "must" | "should" | "remind"
  >("must");

  const queryKey = useMemo(
    () => ["tasks", selectedDate.toISOString().split("T")[0]],
    [selectedDate]
  );

  // 게스트 모드용 로컬 스토리지 훅
  const useGuestTasks = (date: Date) => {
    const [guestTasks, setGuestTasks] = useState<GuestTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const dateStr = date.toISOString().split("T")[0];
      const stored = localStorage.getItem(`guest-tasks-${dateStr}`);
      if (stored) {
        try {
          setGuestTasks(JSON.parse(stored));
        } catch {
          setGuestTasks([]);
        }
      } else {
        setGuestTasks([]);
      }
      setIsLoading(false);
    }, [date]);

    const updateGuestTasks = useCallback((newTasks: GuestTask[]) => {
      const dateStr = date.toISOString().split("T")[0];
      setGuestTasks(newTasks);
      localStorage.setItem(`guest-tasks-${dateStr}`, JSON.stringify(newTasks));
    }, [date]);

    return { guestTasks, setGuestTasks: updateGuestTasks, isLoading };
  };

  // 게스트 모드일 때 로컬 스토리지 사용
  const { guestTasks, setGuestTasks, isLoading: guestLoading } = useGuestTasks(selectedDate);

  // 인증된 사용자일 때 서버 API 사용
  const {
    data: tasks,
    isLoading: serverLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getTasksByDate(selectedDate),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isGuest && !!localStorage.getItem("accessToken"), // 게스트 모드가 아니고 토큰이 있을 때만 실행
  });

  // Task를 CommonTask로 변환하는 함수
  const convertTaskToCommon = useCallback((task: Task): CommonTask => ({
    id: task.id,
    title: task.title,
    priority: task.priority,
    date: task.date,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    status: task.status,
    retryCount: task.retryCount,
  }), []);

  // GuestTask를 CommonTask로 변환하는 함수
  const convertGuestTaskToCommon = useCallback((task: GuestTask): CommonTask => ({
    id: task.id,
    title: task.title,
    priority: task.priority,
    date: task.date,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    completed: task.completed,
  }), []);

  // 현재 사용할 데이터 결정
  const currentTasks: CommonTask[] = useMemo(() => {
    if (isGuest) {
      return guestTasks.map(convertGuestTaskToCommon);
    } else {
      return (tasks || []).map(convertTaskToCommon);
    }
  }, [isGuest, guestTasks, tasks, convertGuestTaskToCommon, convertTaskToCommon]);

  const isLoading = isGuest ? guestLoading : serverLoading;

  // DnD를 위한 그룹별 상태 관리
  const [mustTasks, setMustTasks] = useState<CommonTask[]>([]);
  const [shouldTasks, setShouldTasks] = useState<CommonTask[]>([]);
  const [remindTasks, setRemindTasks] = useState<CommonTask[]>([]);

  // tasks가 변경될 때마다 그룹별 상태 동기화
  useEffect(() => {
    if (Array.isArray(currentTasks)) {
      setMustTasks(currentTasks.filter((t) => t.priority === "must"));
      setShouldTasks(currentTasks.filter((t) => t.priority === "should"));
      setRemindTasks(currentTasks.filter((t) => t.priority === "remind"));
    }
  }, [currentTasks]);

  // 완료 축하 효과 훅
  const { showCelebration, hideCelebration } = useTaskCompletion({
    tasks: currentTasks || [],
  });

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
        setMustTasks(reordered);
      } else if (source.droppableId === "should") {
        const reordered = Array.from(shouldTasks);
        const [removed] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, removed);
        setShouldTasks(reordered);
      } else if (source.droppableId === "remind") {
        const reordered = Array.from(remindTasks);
        const [removed] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, removed);
        setRemindTasks(reordered);
      }
    } else {
      // 그룹 간 이동
      let sourceTasks, setSourceTasks, destTasks, setDestTasks, newPriority;
      if (source.droppableId === "must") {
        sourceTasks = mustTasks;
        setSourceTasks = setMustTasks;
      } else if (source.droppableId === "should") {
        sourceTasks = shouldTasks;
        setSourceTasks = setShouldTasks;
      } else {
        sourceTasks = remindTasks;
        setSourceTasks = setRemindTasks;
      }
      if (destination.droppableId === "must") {
        destTasks = mustTasks;
        setDestTasks = setMustTasks;
        newPriority = "must" as "must" | "should" | "remind";
      } else if (destination.droppableId === "should") {
        destTasks = shouldTasks;
        setDestTasks = setShouldTasks;
        newPriority = "should" as "must" | "should" | "remind";
      } else {
        destTasks = remindTasks;
        setDestTasks = setRemindTasks;
        newPriority = "remind" as "must" | "should" | "remind";
      }
      const sourceArr = Array.from(sourceTasks);
      const destArr = Array.from(destTasks);
      const [removed] = sourceArr.splice(source.index, 1);
      // priority 필드도 변경
      const updated = { ...removed, priority: newPriority };
      destArr.splice(destination.index, 0, updated);
      setSourceTasks(sourceArr);
      setDestTasks(destArr);
      
      // 게스트 모드일 때는 로컬 스토리지 업데이트
      if (isGuest) {
        const allTasks = [...sourceArr, ...destArr];
        const guestTasksToSave = allTasks.map(task => ({
          id: task.id as string,
          title: task.title,
          priority: task.priority,
          completed: task.completed || false,
          date: task.date,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt || new Date().toISOString(),
        }));
        setGuestTasks(guestTasksToSave);
      } else {
        // 서버에 priority 변경 동기화
        if (typeof updated.id === 'number') {
          await updateTask(updated.id, { priority: newPriority });
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

  // 에러 발생 시 (게스트 모드가 아닐 때만)
  if (isError && !isGuest) {
    const isTimeoutError = errorMessage === "timeout";

    return (
      <MobileLayout headerTitle="나의 하루" showFab={false}>
        <div className="px-4 py-6">
          <DateHeader />
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isTimeoutError
                ? "서버 연결 중..."
                : "데이터를 불러올 수 없습니다"}
            </h3>
            <p className="text-gray-500 mb-4 text-sm leading-relaxed whitespace-pre-line">
              {isTimeoutError
                ? "서버가 시작되고 있습니다.\n첫 접속 시 1-2분 정도 걸릴 수 있어요."
                : "네트워크 연결을 확인하고\n다시 시도해주세요."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle="나의 하루">
      <div className="sticky top-0 z-10 bg-surface-base">
        <DateHeader />
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="px-4 py-10 space-y-8">
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
      </DragDropContext>

      <div className="fixed bottom-[5.5rem] z-20 w-full max-w-md left-1/2 -translate-x-1/2 flex justify-end pr-4 pointer-events-none">
        <Fab
          aria-label="새로운 할 일 추가"
          className="pointer-events-auto"
          onClick={handleFabClick}
        >
          <Plus className="w-6 h-6" />
        </Fab>
      </div>

      <FullScreenModal open={open} onClose={handleClose}>
        <TaskFormModal
          onClose={handleClose}
          defaultDate={selectedDate.toLocaleDateString('en-CA')} // YYYY-MM-DD 형식으로 한국 시간대 사용
          task={editTask || undefined}
          defaultPriority={defaultPriority}
          isGuest={isGuest}
        />
      </FullScreenModal>

      {/* 모든 할 일 완료 축하 효과 */}
      <CelebrationEffect show={showCelebration} onComplete={hideCelebration} />
    </MobileLayout>
  );
} 