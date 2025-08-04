import { create } from "zustand";

// 한국 시간대 기준으로 오늘 날짜를 가져오는 함수
const getTodayInKorea = (): Date => {
  const now = new Date();
  const koreaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  // 시간을 00:00:00으로 설정하여 날짜만 비교하도록 함
  koreaTime.setHours(0, 0, 0, 0);
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
