import cron from 'node-cron';
import { processExpiredTodos } from '../service/todoBatch.service';

/**
 *  모든 배치 스케줄 등록
 */
export const startBatchJobs = () => {
  // 1. 자정마다 실행 (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('[배치] 자정 배치 작업 실행 시작');
    try {
      const result = await processExpiredTodos();
      console.log('[배치] 처리 결과:', result);
    } catch (error) {
      console.error('[배치] 처리 중 오류 발생:', error);
    }
  });

  // 2. 1분마다 실행 - 서버 살아있게 heartbeat 로그
  cron.schedule('*/1 * * * *', () => {
    console.log(
      `[서버 헬스체크] ${new Date().toISOString()} - 서버 정상 작동 중`
    );
  });
};
