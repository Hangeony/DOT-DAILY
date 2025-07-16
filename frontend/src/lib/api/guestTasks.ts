import { TaskPriority } from './tasks';

// 게스트 모드용 Task 타입 (id는 string으로 사용)
export interface GuestTask {
  id: string;
  title: string;
  priority: TaskPriority;
  date: string; // YYYY-MM-DD
  status: "pending" | "success" | "retry" | "archive";
  retryCount?: number;
  createdAt: string;
  updatedAt?: string;
  description?: string;
  completed?: boolean;
}

// 로컬 스토리지 키
const GUEST_TASKS_KEY = "guest_tasks";

// 로컬 스토리지에서 게스트 태스크 가져오기
export const getGuestTasks = (): GuestTask[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(GUEST_TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// 로컬 스토리지에 게스트 태스크 저장
export const saveGuestTasks = (tasks: GuestTask[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save guest tasks:", error);
  }
};

// 게스트 태스크 생성
export const createGuestTask = (taskData: {
  title: string;
  description?: string;
  date: string;
  priority: TaskPriority;
  completed?: boolean;
}): GuestTask => {
  const newTask: GuestTask = {
    id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: taskData.title,
    description: taskData.description || "",
    date: taskData.date,
    priority: taskData.priority,
    status: "pending",
    completed: taskData.completed || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const currentTasks = getGuestTasks();
  const updatedTasks = [...currentTasks, newTask];
  saveGuestTasks(updatedTasks);

  return newTask;
};

// 게스트 태스크 업데이트
export const updateGuestTask = (taskId: string, updates: Partial<GuestTask>): GuestTask | null => {
  const currentTasks = getGuestTasks();
  const taskIndex = currentTasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) return null;

  const updatedTask = {
    ...currentTasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  currentTasks[taskIndex] = updatedTask;
  saveGuestTasks(currentTasks);

  return updatedTask;
};

// 게스트 태스크 삭제
export const deleteGuestTask = (taskId: string): boolean => {
  const currentTasks = getGuestTasks();
  const filteredTasks = currentTasks.filter(task => task.id !== taskId);
  
  if (filteredTasks.length === currentTasks.length) {
    return false; // 태스크를 찾지 못함
  }

  saveGuestTasks(filteredTasks);
  return true;
};

// 특정 날짜의 게스트 태스크 가져오기
export const getGuestTasksByDate = (date: Date): GuestTask[] => {
  const dateStr = date.toISOString().split("T")[0];
  const allTasks = getGuestTasks();
  return allTasks.filter(task => task.date === dateStr);
}; 