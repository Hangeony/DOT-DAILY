"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { DateHeader, TaskListSkeleton } from "@/features/myday/components";
import GuestTaskFormModal from "@/features/myday/components/GuestTaskFormModal";
import GuestTaskGroup from "@/features/myday/components/GuestTaskGroup";
import { Plus } from "lucide-react";
import Fab from "@/components/ui/Fab/Fab";
import { useDateStore } from "@/store/useDateStore";
import { GuestTask, getGuestTasks, saveGuestTasks } from "@/lib/api/guestTasks";
import { TaskPriority } from "@/lib/api/tasks";
import FullScreenModal from "@/components/ui/Modal/components/FullScreenModal";
import { useTaskCompletion } from "@/hooks/useTaskCompletion";
import dynamic from "next/dynamic";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import useAuthStore from "../../store/useAuthStore";
import { Button } from "@/components/ui/Button/Button";

// 클라이언트 사이드에서만 로드
const CelebrationEffect = dynamic(
  () => import("@/components/ui/CelebrationEffect/CelebrationEffect"),
  { ssr: false }
);

export default function GuestMyDayPage() {
  const { selectedDate } = useDateStore();
  const { clearGuestMode } = useAuthStore();
  const [editTask, setEditTask] = useState<GuestTask | null>(null);
  const [open, setOpen] = useState(false);
  const [defaultPriority, setDefaultPriority] = useState<
    "must" | "should" | "remind"
  >("must");
  const [isLoading, setIsLoading] = useState(true);

  // 게스트 태스크 상태
  const [guestTasks, setGuestTasks] = useState<GuestTask[]>([]);

  // 선택된 날짜의 태스크만 필터링
  const tasks = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return guestTasks.filter((task) => task.date === dateStr);
  }, [guestTasks, selectedDate]);

  // 초기 로딩
  useEffect(() => {
    const storedTasks = getGuestTasks();
    setGuestTasks(storedTasks);
    setIsLoading(false);
  }, []);

  // DnD를 위한 그룹별 상태 관리
  const [mustTasks, setMustTasks] = useState<GuestTask[]>([]);
  const [shouldTasks, setShouldTasks] = useState<GuestTask[]>([]);
  const [remindTasks, setRemindTasks] = useState<GuestTask[]>([]);

  // tasks가 변경될 때마다 그룹별 상태 동기화
  useEffect(() => {
    if (Array.isArray(tasks)) {
      setMustTasks(tasks.filter((t) => t.priority === "must"));
      setShouldTasks(tasks.filter((t) => t.priority === "should"));
      setRemindTasks(tasks.filter((t) => t.priority === "remind"));
    }
  }, [tasks]);

  // 완료 축하 효과 훅
  const { showCelebration, hideCelebration } = useTaskCompletion({
    tasks: tasks || [],
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

  const handleEdit = useCallback((task: GuestTask) => {
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
        newPriority = "must" as TaskPriority;
      } else if (destination.droppableId === "should") {
        destTasks = shouldTasks;
        setDestTasks = setShouldTasks;
        newPriority = "should" as TaskPriority;
      } else {
        destTasks = remindTasks;
        setDestTasks = setRemindTasks;
        newPriority = "remind" as TaskPriority;
      }
      const sourceArr = Array.from(sourceTasks);
      const destArr = Array.from(destTasks);
      const [removed] = sourceArr.splice(source.index, 1);
      // priority 필드도 변경
      const updated = { ...removed, priority: newPriority };
      destArr.splice(destination.index, 0, updated);
      setSourceTasks(sourceArr);
      setDestTasks(destArr);

      // 로컬 스토리지 업데이트
      const updatedTasks = guestTasks.map((task) =>
        task.id === updated.id ? updated : task
      );
      setGuestTasks(updatedTasks);
      saveGuestTasks(updatedTasks);
    }
  };

  const handleLogout = () => {
    clearGuestMode();
    localStorage.removeItem("guest_tasks");
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <MobileLayout headerTitle="나의 하루 (게스트)" showFab={false}>
        <div className="px-4 py-6">
          <DateHeader />
          <TaskListSkeleton />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle="나의 하루 (게스트)">
      <div className="sticky top-0 z-10 bg-surface-base">
        <DateHeader />
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-yellow-800">
              게스트 모드 - 데이터가 저장되지 않습니다
            </p>
            <Button
              label="로그인"
              onClick={handleLogout}
              className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
            />
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="px-4 py-10 space-y-8">
          <GuestTaskGroup
            priority="must"
            title="오늘 무조건"
            tasks={mustTasks}
            droppableId="must"
            onEmptyClick={() => handleEmptyClick("must")}
            isLoading={false}
            onEdit={handleEdit}
            onUpdate={() => {
              const storedTasks = getGuestTasks();
              setGuestTasks(storedTasks);
            }}
          />
          <GuestTaskGroup
            priority="should"
            title="오늘이면 굿"
            tasks={shouldTasks}
            droppableId="should"
            onEmptyClick={() => handleEmptyClick("should")}
            isLoading={false}
            onEdit={handleEdit}
            onUpdate={() => {
              const storedTasks = getGuestTasks();
              setGuestTasks(storedTasks);
            }}
          />
          <GuestTaskGroup
            priority="remind"
            title="잊지말자"
            tasks={remindTasks}
            droppableId="remind"
            onEmptyClick={() => handleEmptyClick("remind")}
            isLoading={false}
            onEdit={handleEdit}
            onUpdate={() => {
              const storedTasks = getGuestTasks();
              setGuestTasks(storedTasks);
            }}
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
        <GuestTaskFormModal
          onClose={handleClose}
          defaultDate={selectedDate.toISOString().split("T")[0]}
          task={editTask || undefined}
          defaultPriority={defaultPriority}
          onUpdate={() => {
            const storedTasks = getGuestTasks();
            setGuestTasks(storedTasks);
          }}
        />
      </FullScreenModal>

      {/* 모든 할 일 완료 축하 효과 */}
      <CelebrationEffect show={showCelebration} onComplete={hideCelebration} />
    </MobileLayout>
  );
}
