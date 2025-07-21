import { prisma } from '../prisma/client';

export const getUserStatsService = async (userId: number, period?: string) => {
  // 기간별 필터링 조건 설정
  let dateFilter = {};
  if (period === 'month') {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    dateFilter = {
      createdAt: {
        gte: oneMonthAgo,
      },
    };
  } else if (period === 'week') {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    dateFilter = {
      createdAt: {
        gte: oneWeekAgo,
      },
    };
  }

  // 유저 정보 가져오기
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      email: true,
    },
  });

  // 상태별 투두 갯수 가져오기
  const todoCounts = await prisma.todos.groupBy({
    by: ['status'],
    where: {
      userId,
      ...dateFilter, // 기간 필터링 추가
    },
    _count: true,
  });

  console.log(' todoCounts 결과:');
  console.table(todoCounts);

  // 모든 상태 초기화 후 누락된 상태는 0으로 채우기
  const allStatuses = ['pending', 'retry', 'success', 'archive'];
  const todos = allStatuses.reduce(
    (acc, status) => {
      const found = todoCounts.find(item => item.status === status);
      acc[status] = found ? found._count : 0;
      return acc;
    },
    {} as Record<string, number>
  );

  //  retryCount 총합 구하기
  const retryCountAggregate = await prisma.todos.aggregate({
    where: {
      userId,
      ...dateFilter, // 기간 필터링 추가
    },
    _sum: { retryCount: true },
  });
  const totalRetryCount = retryCountAggregate._sum.retryCount || 0;

  console.log(`totalRetryCount: ${totalRetryCount}`);

  // 감정 스티커 개수 가져오기
  const stickerCounts = await prisma.dailyReviews.groupBy({
    by: ['stickerId'],
    where: {
      userId,
      ...dateFilter, // 기간 필터링 추가
    },
    _count: true,
  });

  const stickers = await prisma.stickers.findMany();

  const stickerStats = stickers.map(sticker => {
    const count =
      stickerCounts.find(s => s.stickerId === sticker.id)?._count || 0;
    return {
      stickerId: sticker.id,
      label: sticker.label,
      emoji: sticker.emoji,
      count,
    };
  });

  // 최종 반환
  return {
    user: {
      username: user?.username,
      email: user?.email,
    },
    todos, // 상태별 투두 개수
    totalRetryCount, // retryCount 총합
    stickers: stickerStats, // 스티커 통계
  };
};
