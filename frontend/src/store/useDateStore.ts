import { create } from 'zustand';

// 한국 시간대 기준으로 오늘 날짜를 가져오는 함수
const getTodayInKorea = (): Date => {
  const now = new Date();
  const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  return koreaTime;
};

type DateState = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};
export const useDateStore = create<DateState>((set) => ({
  selectedDate: getTodayInKorea(),
  setSelectedDate: (date) => set({ selectedDate: date }),
})); 