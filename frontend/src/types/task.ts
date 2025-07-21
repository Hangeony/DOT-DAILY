// Task 관련 타입 정의
export type TaskPriority = "must" | "should" | "remind";
export type TaskStatus = "pending" | "success" | "retry" | "archive";

// 기본 Task 인터페이스
export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  date: string; // YYYY-MM-DD
  status: TaskStatus;
  retryCount?: number;
  createdAt: string;
  updatedAt?: string;
}

// 게스트 모드용 Task 타입
export interface GuestTask {
  id: string;
  title: string;
  priority: TaskPriority;
  date: string; // YYYY-MM-DD
  status: TaskStatus;
  retryCount?: number;
  createdAt: string;
  updatedAt?: string;
  description?: string;
  completed?: boolean;
}

// 공통 Task 인터페이스 (Task와 GuestTask를 모두 포함)
export interface CommonTask {
  id: string | number;
  title: string;
  priority: TaskPriority;
  date: string;
  createdAt: string;
  updatedAt?: string;
  // Task의 경우
  status?: TaskStatus;
  retryCount?: number;
  // GuestTask의 경우
  completed?: boolean;
}

// 아카이브 Task 타입
export interface ArchiveTask {
  id: string;
  title: string;
  priority: 1 | 2 | 3;
  retryCount: number;
  dueDate: string; // 'YY.MM.DD'
  archivedDate?: string;
}
