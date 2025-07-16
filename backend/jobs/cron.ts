import cron from 'node-cron';
import { processExpiredTodos } from '../service/todoBatch.service';

/**
 *  모든 배치 스케줄 등록
 */
export const startBatchJobs = () => {
  // '0 0 * * *' 자정마다 실행
  // 밑에 코드는 1분마다 실행 test '*/1 * * * *'
  cron.schedule('0 0 * * *', async () => {
    console.log('[배치] 자정 배치 작업 실행 시작');
    try {
      const result = await processExpiredTodos();
      console.log('[배치] 처리 결과:', result);
    } catch (error) {
      console.error('[배치] 처리 중 오류 발생:', error);
    }
  });
  // 다른 배치 스케줄 추가 가능
  // cron.schedule('0 3 * * *', someOtherBatchJob); // 매일 오전 3시에 실행
};
