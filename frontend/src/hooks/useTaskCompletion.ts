import { useEffect, useState, useMemo, useCallback } from "react";

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

// 타입 가드 함수들
const isGuestTask = (
  task: CommonTask
): task is CommonTask & { completed: boolean } => {
  return task.completed !== undefined;
};

const isAuthenticatedTask = (
  task: CommonTask
): task is CommonTask & { status: string } => {
  return task.status !== undefined;
};

interface UseTaskCompletionProps {
  tasks: CommonTask[];
}

export const useTaskCompletion = ({ tasks }: UseTaskCompletionProps) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);

  // 완료 상태 확인 함수 (메모이제이션)
  const isTaskCompleted = useCallback((task: CommonTask): boolean => {
    if (isGuestTask(task)) {
      return task.completed;
    }
    if (isAuthenticatedTask(task)) {
      return task.status === "success";
    }
    return false;
  }, []);

  // 완료 통계 계산 (메모이제이션)
  const completionStats = useMemo(() => {
    const completed = tasks.filter(isTaskCompleted).length;
    const total = tasks.length;

    // 인증 모드 태스크만 필터링하여 통계 계산
    const authenticatedTasks = tasks.filter(isAuthenticatedTask);
    const pending = authenticatedTasks.filter(
      (task) => task.status === "pending"
    ).length;
    const retry = authenticatedTasks.filter(
      (task) => task.status === "retry"
    ).length;

    return {
      completed,
      total,
      pending,
      retry,
    };
  }, [tasks, isTaskCompleted]);

  // 축하 효과 로직 (메모이제이션)
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const { completed, total } = completionStats;

    // 모든 할 일이 완료되었고, 이전보다 완료된 할 일이 증가했을 때
    const allCompleted = completed === total && total > 0;
    const justCompleted = completed > previousCompletedCount;

    if (allCompleted && justCompleted) {
      setShowCelebration(true);
    }

    setPreviousCompletedCount(completed);
  }, [tasks, completionStats, previousCompletedCount]);

  const hideCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return {
    showCelebration,
    hideCelebration,
    completionStats,
    isTaskCompleted, // 외부에서도 사용할 수 있도록 노출
  };
};
