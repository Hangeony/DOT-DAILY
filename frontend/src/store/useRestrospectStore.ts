import { create } from "zustand";
import {
  DailyEmotionMemo,
  YearMonth,
} from "@/features/retrospect/types/retrospect";

interface RetrospectState {
  selectedYearMonth: YearMonth;
  setSelectedYearMonth: (yearMonth: YearMonth) => void;
  emotionMemoList: DailyEmotionMemo[];
  setEmotionMemoList: (list: DailyEmotionMemo[]) => void;
  addEmotionMemo: (item: DailyEmotionMemo) => void;
  updateEmotionMemo: (item: DailyEmotionMemo) => void;
  deleteEmotionMemo: (date: Date) => void;
}
export const useRetrospectStore = create<RetrospectState>((set) => ({
  selectedYearMonth: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  },
  setSelectedYearMonth: (yearMonth) => set({ selectedYearMonth: yearMonth }),

  emotionMemoList: [],
  setEmotionMemoList: (list) => set({ emotionMemoList: list }),
  addEmotionMemo: (item) =>
    set((state) => {
      // 중복 데이터 방지 - 같은 날짜가 있으면 업데이트 (로컬 날짜 문자열로 비교)
      const existingIndex = state.emotionMemoList.findIndex(
        (memo) =>
          memo.date.toLocaleDateString("en-CA") ===
          item.date.toLocaleDateString("en-CA")
      );

      let newList;
      if (existingIndex >= 0) {
        // 기존 데이터 업데이트
        newList = [...state.emotionMemoList];
        newList[existingIndex] = item;
      } else {
        // 새 데이터 추가
        newList = [...state.emotionMemoList, item];
      }

      return {
        emotionMemoList: newList,
      };
    }),
  updateEmotionMemo: (item) =>
    set((state) => ({
      emotionMemoList: state.emotionMemoList.map((memo) =>
        memo.date.toDateString() === item.date.toDateString() ? item : memo
      ),
    })),
  deleteEmotionMemo: (date) =>
    set((state) => ({
      emotionMemoList: state.emotionMemoList.filter(
        (memo) => memo.date.toDateString() !== date.toDateString()
      ),
    })),
}));
