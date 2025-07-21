// 회고 관련 타입 정의
import { Emotion } from "@/constants/emotion";

export interface YearMonth {
  year: number;
  month: number;
}

export interface EmotionMemo {
  id: number;
  date: string;
  emotion: Emotion;
  memo: string;
  compareNote?: string;
}

export interface RetrospectState {
  emotionMemoList: EmotionMemo[];
  selectedDate: Date;
  addEmotionMemo: (memo: Omit<EmotionMemo, "id">) => void;
  setSelectedDate: (date: Date) => void;
}
