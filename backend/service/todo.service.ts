import { prisma } from '../prisma/client';

interface ITodo {
  userId: number;
  title: string;
  date: string;
  status: 'pending' | 'success' | 'retry' | 'archive';
  priority: 'must' | 'should' | 'remind';
}

// 투두 저장
export const createTodoService = async (input: ITodo) => {
  return await prisma.todos.create({
    data: {
      title: input.title,
      date: input.date,
      status: input.status ?? 'pending',
      priority: input.priority ?? 'must',
      userId: input.userId,
    },
  });
};

// 투두 전체 조회
export const getAllTodosService = async (userId: number) => {
  return await prisma.todos.findMany({
    where: { userId, status: { in: ['pending', 'retry', 'success'] } },
    orderBy: { date: 'asc' },
  });
};

//투두 특정 날짜 조회
export const getTodosByDateService = async (userId: number, date: string) => {
  return await prisma.todos.findMany({
    where: { userId, date, status: { in: ['pending', 'retry', 'success'] } },
    orderBy: { createdAt: 'asc' },
  });
};

//투두 업데이트
export const updateTodoService = async (
  todoId: number,
  userId: number,
  data: {
    title?: string;
    date?: string;
    status?: 'pending' | 'success' | 'retry' | 'archive';
    priority?: 'must' | 'should' | 'remind';
  }
) => {
  return await prisma.todos.updateMany({
    where: { id: todoId, userId },
    data: {
      ...data,
      date: data.date ? data.date : undefined,
    },
  });
};

// 투두 삭제
export const deleteTodoService = async (todoId: number, userId: number) => {
  return await prisma.todos.deleteMany({
    where: { id: todoId, userId },
  });
};

// 투두 상태 변경
export const updateTodoStatusService = async (
  todoId: number,
  userId: number,
  status: 'pending' | 'success' | 'retry' | 'archive'
) => {
  return await prisma.todos.updateMany({
    where: { id: todoId, userId },
    data: { status },
  });
};

// 보관함으로 이동
export const moveToArchiveService = async (todoId: number, userId: number) => {
  return await prisma.todos.updateMany({
    where: { id: todoId, userId },
    data: { status: 'archive' },
  });
};

// 재시도로 이동 (retryCount 증가, 상태를 retry로 변경)
export const moveToRetryService = async (todoId: number, userId: number) => {
  const todo = await prisma.todos.findFirst({
    where: { id: todoId, userId },
  });

  if (!todo) {
    return { count: 0 };
  }

  return await prisma.todos.updateMany({
    where: { id: todoId, userId },
    data: {
      status: 'retry',
      retryCount: todo.retryCount + 1,
    },
  });
};

// 오늘로 이동 (날짜를 오늘로 변경, 상태를 pending으로 변경)
export const moveToTodayService = async (todoId: number, userId: number) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식

  return await prisma.todos.updateMany({
    where: { id: todoId, userId },
    data: {
      status: 'pending',
      date: today,
    },
  });
};

// 보관함 투두 목록 조회
export const getArchivedTodosService = async (userId: number) => {
  return await prisma.todos.findMany({
    where: { userId, status: 'archive' },
    orderBy: { createdAt: 'desc' },
  });
};

// 보관함 투두 수정
export const updateArchivedTodoService = async (
  todoId: number,
  userId: number,
  data: {
    title?: string;
    date?: string;
    priority?: 'must' | 'should' | 'remind';
  }
) => {
  return await prisma.todos.updateMany({
    where: { id: todoId, userId, status: 'archive' },
    data,
  });
};

// 보관함 투두 삭제
export const deleteArchivedTodoService = async (
  todoId: number,
  userId: number
) => {
  return await prisma.todos.deleteMany({
    where: { id: todoId, userId, status: 'archive' },
  });
};

// 복구: 보관함 → 오늘의 할일
export const restoreArchivedTodoService = async (
  todoId: number,
  userId: number
) => {
  // 1️⃣ 투두 가져오기
  const todo = await prisma.todos.findUnique({
    where: { id: todoId },
  });

  // 2️⃣ 유효성 검사
  if (!todo || todo.userId !== userId) {
    throw new Error('존재하지 않거나 접근 권한이 없습니다.');
  }

  // 3️⃣ 보관함 상태 확인
  if (todo.status !== 'archive') {
    throw new Error('보관함에 있는 투두만 복구할 수 있습니다.');
  }

  // 4️⃣ 복구 상태 결정
  const previousStatus = todo.retryCount > 0 ? 'retry' : 'pending';

  // 5️⃣ 업데이트
  const updated = await prisma.todos.update({
    where: { id: todoId },
    data: {
      status: previousStatus, // retry면 retry 유지
      date: new Date().toISOString().split('T')[0], // 오늘 날짜
    },
  });

  return updated;
};
