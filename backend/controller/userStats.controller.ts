import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getUserStatsService } from '../service/userStats.service';

export const getUserStatsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const period = req.query.period as string | undefined; // week | month | undefined

    const stats = await getUserStatsService(userId, period);

    res.status(StatusCodes.OK).json({
      success: true,
      message: '유저 통계 조회 성공',
      data: stats,
    });
    return;
  } catch (error) {
    console.error('[getUserStatsController] 오류 발생:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '통계 조회 중 오류가 발생했습니다.',
    });
    return;
  }
};
