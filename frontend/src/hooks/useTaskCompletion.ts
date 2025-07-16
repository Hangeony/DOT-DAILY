import { useEffect, useState } from 'react';

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

interface UseTaskCompletionProps {
  tasks: CommonTask[];
}

export const useTaskCompletion = ({ tasks }: UseTaskCompletionProps) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    // 게스트 모드와 인증 모드 모두 지원
    const completedTasks = tasks.filter(task => {
      if (task.completed !== undefined) {
        // 게스트 모드: completed 속성 사용
        return task.completed;
      } else {
        // 인증 모드: status 속성 사용
        return task.status === 'success';
      }
    });
    
    const totalTasks = tasks.length;
    const currentCompletedCount = completedTasks.length;

    // 모든 할 일이 완료되었고, 이전보다 완료된 할 일이 증가했을 때
    const allCompleted = currentCompletedCount === totalTasks && totalTasks > 0;
    const justCompleted = currentCompletedCount > previousCompletedCount;

    if (allCompleted && justCompleted) {
      setShowCelebration(true);
    }

    setPreviousCompletedCount(currentCompletedCount);
  }, [tasks, previousCompletedCount]);

  const hideCelebration = () => {
    setShowCelebration(false);
  };

  // 완료 상태 확인 함수
  const isTaskCompleted = (task: CommonTask) => {
    if (task.completed !== undefined) {
      return task.completed;
    } else {
      return task.status === 'success';
    }
  };

  return {
    showCelebration,
    hideCelebration,
    completionStats: {
      completed: tasks.filter(isTaskCompleted).length,
      total: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      retry: tasks.filter(task => task.status === 'retry').length,
    }
  };
}; 