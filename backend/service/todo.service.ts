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

//투두 업데이트 (공통 함수)
export const updateTodoService = async (
  todoId: number,
  userId: number,
  data: {
    title?: string;
    date?: string;
    status?: 'pending' | 'success' | 'retry' | 'archive';
    priority?: 'must' | 'should' | 'remind';
  },
  statusFilter?: string
) => {
  const where: any = { id: todoId, userId };
  if (statusFilter) {
    where.status = statusFilter;
  }

  return await prisma.todos.updateMany({
    where,
    data: {
      ...data,
      date: data.date ? data.date : undefined,
    },
  });
};

// 투두 삭제 (공통 함수)
export const deleteTodoService = async (
  todoId: number,
  userId: number,
  statusFilter?: string
) => {
  const where: any = { id: todoId, userId };
  if (statusFilter) {
    where.status = statusFilter;
  }

  return await prisma.todos.deleteMany({ where });
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

// 재시도로 이동 (retryCount 증가, 상태를 retry로 변경, 다음날로 이동)
export const moveToRetryService = async (todoId: number, userId: number) => {
  const todo = await prisma.todos.findFirst({
    where: { id: todoId, userId },
  });

  if (!todo) {
    return { count: 0 };
  }

  // 할 일의 현재 날짜 기준으로 다음날 계산
  const currentDate = new Date(todo.date);
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);
  const nextDateString = nextDate.toISOString().split('T')[0];

  return await prisma.todos.updateMany({
    where: { id: todoId, userId },
    data: {
      status: 'retry',
      retryCount: todo.retryCount + 1,
      date: nextDateString, // 할 일의 현재 날짜 기준 다음날로 이동
    },
  });
};
