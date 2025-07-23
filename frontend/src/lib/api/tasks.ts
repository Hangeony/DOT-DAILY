import { httpClient } from "@/lib/api/http";

export type TaskPriority = "must" | "should" | "remind";
export type TaskStatus = "pending" | "success" | "retry" | "archive";

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  date: string;
  status: TaskStatus;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await httpClient.get("/todos");
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 전체 할 일 조회 실패:", error);
    throw new Error("할 일 목록을 불러오는데 실패했습니다.");
  }
};

export const getTasksByDate = async (date: Date | string): Promise<Task[]> => {
  try {
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];
    const response = await httpClient.get(`/todos?date=${dateStr}`);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 날짜별 할 일 조회 실패:", error);
    throw new Error("해당 날짜의 할 일을 불러오는데 실패했습니다.");
  }
};

export const createTask = async (taskData: {
  title: string;
  priority: TaskPriority;
  date: string;
}): Promise<Task> => {
  try {
    const response = await httpClient.post("/todos", taskData);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 할 일 생성 실패:", error);
    throw new Error("할 일을 생성하는데 실패했습니다.");
  }
};

export const updateTask = async (
  id: number,
  taskData: Partial<Task>
): Promise<Task> => {
  try {
    const response = await httpClient.put(`/todos/${id}`, taskData);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 할 일 수정 실패:", error);
    throw new Error("할 일을 수정하는데 실패했습니다.");
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(`/todos/${id}`);
  } catch (error: unknown) {
    console.error("❌ 할 일 삭제 실패:", error);
    throw new Error("할 일을 삭제하는데 실패했습니다.");
  }
};

export const updateTaskStatus = async (
  id: number,
  status: TaskStatus
): Promise<Task> => {
  try {
    const response = await httpClient.put(`/todos/${id}/status`, { status });
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 할 일 상태 변경 실패:", error);
    throw new Error("할 일 상태를 변경하는데 실패했습니다.");
  }
};

export const moveToRetry = async (id: number): Promise<Task> => {
  try {
    const response = await httpClient.put(`/todos/${id}/retry`);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 재시도로 이동 실패:", error);
    throw new Error("재시도로 이동하는데 실패했습니다.");
  }
};

export const moveToArchive = async (id: number): Promise<Task> => {
  try {
    const response = await httpClient.put(`/todos/${id}/archive`);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 보관함으로 이동 실패:", error);
    throw new Error("보관함으로 이동하는데 실패했습니다.");
  }
};

export const moveToToday = async (id: number): Promise<Task> => {
  try {
    const response = await httpClient.put(`/todos/${id}/today`);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 오늘로 이동 실패:", error);
    throw new Error("오늘로 이동하는데 실패했습니다.");
  }
};

// 보관함 관련 함수들
export const getArchiveTasks = async (): Promise<Task[]> => {
  try {
    const response = await httpClient.get("/archive");
    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error("❌ 보관함 목록 조회 실패:", error);
    throw new Error("보관함 목록을 불러오는데 실패했습니다.");
  }
};

export const updateArchiveTask = async (
  id: number,
  taskData: Partial<Task>
): Promise<Task> => {
  try {
    const response = await httpClient.put(`/archive/${id}`, taskData);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 보관함 할 일 수정 실패:", error);
    throw new Error("보관함 할 일을 수정하는데 실패했습니다.");
  }
};

export const deleteArchiveTask = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(`/archive/${id}`);
  } catch (error: unknown) {
    console.error("❌ 보관함 할 일 삭제 실패:", error);
    throw new Error("보관함 할 일을 삭제하는데 실패했습니다.");
  }
};

export const moveToTodayFromArchive = async (id: number): Promise<Task> => {
  try {
    const response = await httpClient.put(`/archive/${id}/restore`);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ 보관함에서 오늘로 이동 실패:", error);
    throw new Error("보관함에서 오늘로 이동하는데 실패했습니다.");
  }
};

// 상태 토글 함수 (기존 코드 호환성)
export const toggleTaskStatus = async (
  id: number,
  currentStatus: TaskStatus
): Promise<Task> => {
  const newStatus = currentStatus === "success" ? "pending" : "success";
  return await updateTaskStatus(id, newStatus);
};
