import { create } from "zustand";
import { getTodayInKorea } from "@/utils/dateUtils";

type DateState = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export const useDateStore = create<DateState>((set) => ({
  selectedDate: getTodayInKorea(),
  setSelectedDate: (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    set({ selectedDate: normalizedDate });
  },
}));

// 스토어 리셋 함수 추가
export const resetDateStore = () => {
  useDateStore.setState({ selectedDate: getTodayInKorea() });
};
