"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import {
  DateHeader,
  TaskListSkeleton,
  TaskFormModal,
} from "@/features/myday/components";
import { Plus } from "@/components/ui/Icon";
import Fab from "@/components/ui/Fab/Fab";
import { useDateStore } from "@/store/useDateStore";
import { GuestTask, getGuestTasks, saveGuestTasks } from "@/lib/api/guestTasks";
import FullScreenModal from "@/components/ui/Modal/components/FullScreenModal";
import { useTaskCompletion } from "@/hooks/useTaskCompletion";

import { DropResult } from "@hello-pangea/dnd";
import DragDropWrapper from "@/components/ui/DragDrop/DragDropWrapper";
import { GuestTaskGroup } from "@/features/myday/components";
import useAuthStore from "../../store/useAuthStore";
import { Button } from "@/components/ui/Button/Button";
import CelebrationEffect from "@/components/ui/CelebrationEffect/CelebrationEffect";

export default function GuestMyDayPage() {
  const { selectedDate } = useDateStore();
  const { clearGuestMode } = useAuthStore();
  const [editTask, setEditTask] = useState<GuestTask | null>(null);
  const [open, setOpen] = useState(false);
  const [defaultPriority, setDefaultPriority] = useState<
    "must" | "should" | "remind"
  >("must");
  const [isLoading, setIsLoading] = useState(false);

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
        <div className="px-4 py-6 bg-gradient-to-b from-white to-gray-50">
          <DateHeader />
          <div className="px-4 py-3 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-b border-amber-200 shadow-sm mb-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-amber-800">
                  게스트 모드
                </p>
                <p className="text-xs text-amber-600">
                  데이터가 저장되지 않습니다
                </p>
              </div>
            </div>
          </div>
          <TaskListSkeleton />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle="나의 하루 (게스트)">
      <div className="sticky top-0 z-10 bg-surface-base">
        <DateHeader />
        <div className="px-4 py-3 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-b border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-amber-800">
                  게스트 모드
                </p>
                <p className="text-xs text-amber-600">
                  데이터가 저장되지 않습니다
                </p>
              </div>
            </div>
            <Button
              label="로그인하기"
              onClick={handleLogout}
              size="sm"
              variant="primary"
              rounded="full"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-medium shadow-lg"
            />
          </div>
        </div>
      </div>
      <DragDropWrapper onDragEnd={handleDragEnd}>
        <div className="px-4 py-16 space-y-6 bg-gradient-to-b from-white to-gray-50 min-h-screen">
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
      </DragDropWrapper>

      <div className="fixed bottom-[5.5rem] z-20 w-full max-w-md left-1/2 -translate-x-1/2 flex justify-end pr-4 pointer-events-none">
        <Fab
          aria-label="새로운 할 일 추가"
          className="pointer-events-auto shadow-2xl"
          onClick={handleFabClick}
        >
          <Plus className="w-6 h-6" />
        </Fab>
      </div>

      <FullScreenModal open={open} onClose={handleClose}>
        <TaskFormModal
          onClose={handleClose}
          defaultDate={selectedDate.toISOString().split("T")[0]}
          task={editTask || undefined}
          defaultPriority={defaultPriority}
          isGuest={true}
          onSuccess={() => {
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
