/**
 * 한국 시간대 기준으로 오늘 날짜를 가져오는 함수
 */
export const getTodayInKorea = (): Date => {
  const now = new Date();
  const koreaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  koreaTime.setHours(0, 0, 0, 0);
  return koreaTime;
};
