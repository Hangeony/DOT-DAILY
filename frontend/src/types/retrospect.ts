// 회고 관련 타입 정의
import { Emotion } from "@/constants/emotion";

export interface YearMonth {
  year: number;
  month: number;
}

export interface DailyEmotionMemo {
  date: Date;
  emotion: Emotion["id"];
  memo: string;
  compareNote?: string;
}

export interface TitleFormatDate {
  date: {
    year: number;
    month: number;
    day: number;
  };
}
