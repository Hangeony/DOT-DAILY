import { prisma } from '../prisma/client';
import { addDays, isBefore } from 'date-fns';

// KST 기준 날짜 문자열 반환 함수
function getKSTDateString(date = new Date()) {
  // UTC → KST 변환 (+9시간)
  const kstOffset = 9 * 60 * 60 * 1000; // 9시간(ms)
  const kstDate = new Date(date.getTime() + kstOffset);

  // yyyy-MM-dd 형태로 반환
  return kstDate.toISOString().split('T')[0];
}

export const processExpiredTodos = async () => {
  const now = new Date();
  const todayKST = getKSTDateString(now);

  console.log('[배치] 실행됨, 기준 날짜:', todayKST);

  // 만료된 pending/retry/archive 투두 찾기
  const expiredTodos = await prisma.todos.findMany({
    where: {
      status: { in: ['pending', 'retry', 'archive'] },
    },
  });

  // 오늘 이전 날짜인 것만 필터링 (KST 기준)
  const todoExpired = expiredTodos.filter(todo => {
    const todoDate = new Date(todo.date);
    const nowKST = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return isBefore(todoDate, nowKST);
  });

  console.log(`[배치] 만료된 투두 ${todoExpired.length}개`, todoExpired);

  if (todoExpired.length === 0) {
    console.log('[배치] 만료된 투두 없음');
    return { updatedCount: 0 };
  }

  // ✅ 상태 변경 및 날짜 이관
  await Promise.all(
    todoExpired.map(todo =>
      prisma.todos.update({
        where: { id: todo.id },
        data: {
          status: todo.status === 'archive' ? 'archive' : 'retry',
          retryCount: { increment: 1 },
          date: getKSTDateString(addDays(now, 1)), // 다음날로 이관
        },
      })
    )
  );

  console.log('[배치] 완료!!!!!');
  return { updatedCount: todoExpired.length };
};