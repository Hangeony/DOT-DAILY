// Task 관련 공통 타입 정의

// 공통 Task 인터페이스 (Task와 GuestTask를 모두 포함)
export interface CommonTask {
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

// Task Priority 타입
export type TaskPriority = "must" | "should" | "remind";

// Task Status 타입
export type TaskStatus = "pending" | "success" | "retry" | "archive";

// 아카이브 Task 타입
export interface ArchiveTask {
  id: string;
  title: string;
  priority: 1 | 2 | 3;
  retryCount: number;
  dueDate: string; // 'YY.MM.DD'
  archivedDate?: string;
}
