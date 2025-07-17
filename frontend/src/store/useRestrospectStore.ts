import { create } from 'zustand';
import { DailyEmotionMemo, YearMonth } from '@/features/retrospect/types/retrospect';

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
    month: new Date().getMonth() + 1
  },
  setSelectedYearMonth: (yearMonth) =>
    set({ selectedYearMonth: yearMonth }),

  emotionMemoList: [],
  setEmotionMemoList: (list) => set({ emotionMemoList: list }),
  addEmotionMemo: (item) =>
    set((state) => ({
      emotionMemoList: [...state.emotionMemoList, item]
    })),
  updateEmotionMemo: (item) =>
    set((state) => ({
      emotionMemoList: state.emotionMemoList.map(memo =>
        memo.date.toDateString() === item.date.toDateString() ? item : memo
      )
    })),
  deleteEmotionMemo: (date) =>
    set((state) => ({
      emotionMemoList: state.emotionMemoList.filter(memo =>
        memo.date.toDateString() !== date.toDateString()
      )
    })),
}));
