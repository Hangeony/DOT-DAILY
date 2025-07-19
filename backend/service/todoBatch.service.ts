import { prisma } from '../prisma/client';
import { addDays, isBefore } from 'date-fns';
import { TZDate } from '@date-fns/tz';

//  KST 날짜 문자열 반환 함수
function getKSTDateString(date = new Date()) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

export const processExpiredTodos = async () => {
  const now = new Date();
  const todayKST = getKSTDateString(now);

  console.log('[배치] 실행됨, 기준 날짜:', todayKST);

  //  만료된 pending 투두 찾기
  const expiredTodos = await prisma.todos.findMany({
    where: {
      status: { in: ['pending', 'retry', 'archive'] },
      // date: { lte: todayKST }, // 오늘까지 포함
    },
  });
  
  // 1. 문자열 끼리 비교해서 어떤게 우선순위인지 모름
  //  내일부터 다시 짜봐야할 코드
  const todoExpired = expiredTodos.filter(data => {
    const tz = new TZDate(data.date, 'Asia/Seoul');
    const tz2 = new TZDate(now, 'Asia/Seoul');
    return isBefore(tz, tz2);
  });

  console.log(`[배치] 만료된 투두 ${expiredTodos.length}개`, expiredTodos);

  if (expiredTodos.length === 0) {
    console.log('[배치] 만료된 투두 없음');
    return { updatedCount: 0 };
  }

  //  상태 변경 및 날짜 이관
  await Promise.all(
    expiredTodos.map(todo =>
      prisma.todos.update({
        where: { id: todo.id },
        data: {
          status: todo.status === 'archive' ? 'archive' : 'retry',
          retryCount: { increment: 1 },
          date: getKSTDateString(addDays(now, 1)),
        },
      })
    )
  );

  console.log('[배치] 완료!!!!!');
  return { updatedCount: expiredTodos.length };
};
