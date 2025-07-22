import { prisma } from '../prisma/client';

// 보관함 투두 목록 조회
export const getArchivedTodos = async (userId: number) => {
  return await prisma.todos.findMany({
    where: { userId, status: 'archive' },
    orderBy: { createdAt: 'desc' },
  });
};

// 보관함 투두 수정
export const updateArchivedTodo = async (
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
export const deleteArchivedTodo = async (todoId: number, userId: number) => {
  return await prisma.todos.deleteMany({
    where: { id: todoId, userId, status: 'archive' },
  });
};

// 복구: 보관함 → 오늘의 할일
export const restoreArchivedTodo = async (todoId: number, userId: number) => {
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
