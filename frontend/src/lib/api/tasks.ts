import { httpClient } from "./http";

export type TaskPriority = "must" | "should" | "remind";
export type TaskStatus = "pending" | "success" | "retry" | "archive";

// ✅ 백엔드와 호환되는 Task 인터페이스
export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  date: string; // YYYY-MM-DD
  status: TaskStatus; // ✅ 백엔드: status
  retryCount?: number; // ✅ 백엔드: retryCount (옵셔널 - 백엔드 업데이트 대기)
  createdAt: string; // ✅ 백엔드: createdAt
  updatedAt?: string; // ✅ 백엔드: updatedAt (nullable)
}
export interface CreateTaskRequest {
  title: string;
  priority: TaskPriority;
  date: string; // YYYY-MM-DD
}

export interface UpdateTaskRequest {
  title?: string;
  priority?: TaskPriority;
  date?: string;
  status?: TaskStatus; // ✅ done 대신 status 사용
  // done?: boolean;         // ❌ 삭제됨 → status로 대체
}

/**
 * 1. 전체 할 일 목록 조회
 * GET https://dot-daily.onrender.com/api/v1/todos
 */
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    console.log("🔍 전체 할 일 조회 시도...");
    const response = await httpClient.get("/todos");
    console.log("✅ 전체 할 일 조회 성공:", response.data);

    let tasks = response.data;

    // 응답 구조 확인 및 처리
    if (response.data && typeof response.data === "object") {
      // data 속성이 있는 경우
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log("📦 data 속성에서 배열 발견:", response.data.data);
        tasks = response.data.data;
      }
      // tasks 속성이 있는 경우
      else if (response.data.tasks && Array.isArray(response.data.tasks)) {
        console.log("📦 tasks 속성에서 배열 발견:", response.data.tasks);
        tasks = response.data.tasks;
      }
      // result 속성이 있는 경우
      else if (response.data.result && Array.isArray(response.data.result)) {
        console.log("📦 result 속성에서 배열 발견:", response.data.result);
        tasks = response.data.result;
      }
      // 직접 배열인 경우
      else if (Array.isArray(response.data)) {
        console.log("📦 직접 배열:", response.data);
        tasks = response.data;
      }
    }

    console.log(
      "전체 할 일 개수:",
      Array.isArray(tasks) ? tasks.length : "배열 아님"
    );
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error("❌ 전체 할 일 조회 실패:", error);
    throw new Error("전체 할 일을 불러오는데 실패했습니다.");
  }
};

/**
 * 2. 특정 날짜의 할 일 목록 조회
 * GET https://dot-daily.onrender.com/api/v1/todos/by-date?date=YYYY-MM-DD
 */
export const getTasksByDate = async (date: Date): Promise<Task[]> => {
  const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD 형식

  // 여러 가능한 엔드포인트 시도
  const endpoints = [
    `/todos/by-date?date=${dateString}`,
    `/todos?date=${dateString}`,
    `/todo/by-date?date=${dateString}`,
    `/todo?date=${dateString}`,
    `/todos/date/${dateString}`,
    `/todo/date/${dateString}`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log("API 요청 URL:", endpoint);
      const response = await httpClient.get(endpoint);

      console.log("✅ API 응답 성공:", endpoint, response.data);
      console.log("응답 데이터 타입:", typeof response.data);
      console.log("배열인가?", Array.isArray(response.data));

      let tasks = response.data;

      // 응답 구조 확인 및 처리
      if (response.data && typeof response.data === "object") {
        // data 속성이 있는 경우 (예: { message: "...", data: [...] })
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log("📦 data 속성에서 배열 발견:", response.data.data);
          tasks = response.data.data;
        }
        // tasks 속성이 있는 경우 (예: { message: "...", tasks: [...] })
        else if (response.data.tasks && Array.isArray(response.data.tasks)) {
          console.log("📦 tasks 속성에서 배열 발견:", response.data.tasks);
          tasks = response.data.tasks;
        }
        // result 속성이 있는 경우 (예: { message: "...", result: [...] })
        else if (response.data.result && Array.isArray(response.data.result)) {
          console.log("📦 result 속성에서 배열 발견:", response.data.result);
          tasks = response.data.result;
        }
        // 직접 배열인 경우
        else if (Array.isArray(response.data)) {
          console.log("📦 직접 배열:", response.data);
          tasks = response.data;
        } else {
          console.warn("⚠️ 알 수 없는 응답 구조:", response.data);
          return [];
        }
      }

      // 최종 검증
      if (!Array.isArray(tasks)) {
        console.warn("⚠️ 최종 데이터가 배열이 아닙니다:", tasks);
        return [];
      }

      console.log("✅ 최종 반환 데이터:", tasks);
      return tasks;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      console.log(`❌ 실패: ${endpoint}`, axiosError.response?.status);
      continue; // 다음 엔드포인트 시도
    }
  }

  // 모든 엔드포인트 실패 시 전체 목록에서 필터링
  console.log("🔄 모든 날짜별 API 실패, 전체 목록에서 필터링 시도...");
  try {
    const allTasks = await getAllTasks();
    const filteredTasks = allTasks.filter((task) => task.date === dateString);
    console.log("📅 필터링된 할 일:", filteredTasks);
    return filteredTasks;
  } catch (error) {
    console.error("❌ 전체 목록 조회도 실패:", error);
    return [];
  }
};

/**
 * 3. 새로운 할 일 생성
 * POST https://dot-daily.onrender.com/api/v1/todos
 */
export const createTask = async (
  taskData: CreateTaskRequest
): Promise<Task> => {
  try {
    console.log("🚀 createTask 요청 데이터:", taskData);
    const response = await httpClient.post("/todos", taskData);
    console.log("✅ createTask 응답:", response.data);
    console.log("응답 상태:", response.status);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ 할 일 생성 실패:", error);

    const axiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    console.error("에러 응답:", axiosError.response?.data);
    console.error("에러 상태:", axiosError.response?.status);
    throw new Error(
      `할 일 생성에 실패했습니다: ${
        axiosError.response?.data?.message ||
        axiosError.message ||
        "알 수 없는 오류"
      }`
    );
  }
};

/**
 * 4. 할 일 수정
 * PUT https://dot-daily.onrender.com/api/v1/todos/:id
 */
export const updateTask = async (
  id: number,
  taskData: UpdateTaskRequest
): Promise<Task> => {
  try {
    const response = await httpClient.put(`/todos/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error("할 일 수정 실패:", error);
    throw new Error("할 일 수정에 실패했습니다.");
  }
};

/**
 * 5. 할 일 삭제
 * DELETE https://dot-daily.onrender.com/api/v1/todos/:id
 */
export const deleteTask = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(`/todos/${id}`);
  } catch (error) {
    console.error("할 일 삭제 실패:", error);
    throw new Error("할 일 삭제에 실패했습니다.");
  }
};

/**
 * 할 일 완료 상태 토글 (pending ↔ success)
 */
export const toggleTaskStatus = async (
  id: number,
  currentStatus: TaskStatus
): Promise<Task> => {
  try {
    const newStatus = currentStatus === "success" ? "pending" : "success";
    await httpClient.put(`/todos/${id}`, {
      status: newStatus,
    });

    // 서버 응답에 status가 없으므로, 프론트에서 직접 newStatus를 반환
    // 최소한의 Task 정보만 반환 (id, status)
    return {
      id,
      title: "", // 필요하다면 handleToggleStatus에서 task.title을 넘겨서 채울 수 있음
      priority: "must", // 기본값, 실제로는 사용하지 않음
      date: "", // 필요하다면 넘겨서 채울 수 있음
      status: newStatus,
      createdAt: "",
    } as Task;
  } catch (error) {
    console.error("할 일 상태 변경 실패:", error);
    throw new Error("할 일 상태 변경에 실패했습니다.");
  }
};

/**
 * 할 일을 보류(미루기)하여 retryCount를 1 증가시키고, 날짜를 다음날로 이동하는 함수
 */
export const increaseRetryAndMoveToTomorrow = async (
  id: number
): Promise<Task> => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // ✅ retry 상태로 변경하고 내일로 이동
  return await updateTask(id, {
    date: tomorrowStr,
    status: "retry", // ✅ retry 상태로 변경
    // retryCount는 백엔드에서 처리하거나 별도 API 필요
  });
};

/**
 * 할 일을 보류함으로 이동시키는 함수 (status를 'archive'로 변경)
 */
export const moveToArchive = async (id: number): Promise<Task> => {
  try {
    console.log("📦 할 일을 보류함으로 이동 시도:", id);

    // 할 일의 상태를 'archive'로 변경
    const archivedTask = await updateTask(id, {
      status: "archive",
    });

    console.log("✅ 할 일 보류 처리 완료:", archivedTask);
    return archivedTask;
  } catch (error) {
    console.error("❌ 보류 처리 실패:", error);
    throw new Error("보류 처리에 실패했습니다.");
  }
};

/**
 * 보관함에서 오늘 할 일로 이동시키는 함수
 * PUT /api/v1/archive/:id/restore
 */
export const moveToTodayFromArchive = async (
  taskId: number | string
): Promise<Task> => {
  try {
    console.log("📅 보관함에서 오늘 할 일로 이동 시도 (Archive API):", taskId);
    const response = await httpClient.put(`/archive/${taskId}/restore`);
    console.log("✅ 보관함에서 오늘 할 일로 이동 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 보관함에서 오늘 할 일로 이동 실패:", error);
    throw new Error("보관함에서 오늘 할 일로 이동에 실패했습니다.");
  }
};

/**
 * 보관함에서 할 일을 삭제하는 함수
 * DELETE /api/v1/archive/:id
 */
export const deleteArchiveTask = async (taskId: number): Promise<void> => {
  try {
    console.log("🗑️ 보관함 할 일 삭제 시도:", taskId);
    await httpClient.delete(`/archive/${taskId}`);
    console.log("✅ 보관함 할 일 삭제 성공");
  } catch (error) {
    console.error("❌ 보관함 할 일 삭제 실패:", error);
    throw new Error("보관함 할 일 삭제에 실패했습니다.");
  }
};

/**
 * 보관함에서 할 일을 수정하는 함수
 * PUT /api/v1/archive/:id
 */
export const updateArchiveTask = async (
  taskId: number,
  taskData: Partial<Task>
): Promise<Task> => {
  try {
    console.log("🔄 보관함 할 일 수정 시도:", taskId, taskData);
    const response = await httpClient.put(`/archive/${taskId}`, taskData);
    console.log("✅ 보관함 할 일 수정 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 보관함 할 일 수정 실패:", error);
    throw new Error("보관함 할 일 수정에 실패했습니다.");
  }
};

/**
 * 보관함에 있는 할 일 목록 조회
 * GET /api/v1/archive/
 */
export const getArchiveTasks = async (): Promise<Task[]> => {
  try {
    console.log("🔍 보관함 목록 조회 시도...");
    const response = await httpClient.get("/archive");
    console.log("✅ 보관함 목록 조회 성공:", response.data);

    let tasks = response.data;

    // 응답 구조 확인 및 처리
    if (response.data && typeof response.data === "object") {
      if (response.data.data && Array.isArray(response.data.data)) {
        tasks = response.data.data;
      } else if (Array.isArray(response.data)) {
        tasks = response.data;
      }
    }

    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error("❌ 보관함 목록 조회 실패:", error);
    return [];
  }
};
