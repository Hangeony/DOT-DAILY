import { TitleFormatDate } from "../types/retrospect";
import { DailyEmotionMemo } from "../types/retrospect";

// 상수 정의
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const KOREAN_LOCALE = "ko-KR";

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환
 * @param date 변환할 날짜
 * @returns YYYY-MM-DD 형식의 문자열
 * @throws 유효하지 않은 날짜인 경우 에러
 */
export const formatDateToString = (date: Date): string => {
  // 날짜 유효성 검사
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("유효하지 않은 날짜입니다.");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * 제목용 날짜 포맷 (YYYY. MM 형식)
 * @param titleDate 제목용 날짜 객체
 * @returns YYYY. MM 형식의 문자열
 */
export const titleFormat = (titleDate: TitleFormatDate): string => {
  const month = titleDate.date.month + 1;
  const paddedMonth = month < 10 ? `0${month}` : month;

  return `${titleDate.date.year}. ${paddedMonth}`;
};

/**
 * 화면 표시용 날짜 포맷 (한국어 로케일)
 * @param date 표시할 날짜
 * @returns 한국어 형식의 날짜 문자열 (예: 2024년 1월 15일)
 * @throws 유효하지 않은 날짜인 경우 에러
 */
export const formatDisplayDate = (date: Date): string => {
  // 날짜 유효성 검사
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("유효하지 않은 날짜입니다.");
  }

  return new Date(date).toLocaleDateString(KOREAN_LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 연속 일수 계산
 * @param emotionMemos 감정 메모 배열
 * @returns 최대 연속 일수
 */
export const calculateConsecutiveDays = (
  emotionMemos: DailyEmotionMemo[]
): number => {
  // 빈 배열인 경우 0 반환
  if (emotionMemos.length === 0) {
    return 0;
  }

  // 날짜순으로 정렬 (오래된 순)
  const sortedMemos = [...emotionMemos].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  let maxStreak = 1; // 최대 연속 일수
  let currentStreak = 1; // 현재 연속 일수

  // 두 번째 메모부터 순회하며 연속 일수 계산
  for (let i = 1; i < sortedMemos.length; i++) {
    const prevDate = sortedMemos[i - 1].date;
    const currDate = sortedMemos[i].date;

    // 날짜 차이 계산
    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
    const diffDays = Math.ceil(diffTime / MILLISECONDS_PER_DAY);

    if (diffDays === 1) {
      // 연속된 날짜인 경우
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      // 연속이 끊긴 경우
      currentStreak = 1;
    }
  }

  return maxStreak;
};
