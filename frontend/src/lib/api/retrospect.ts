import { httpClient } from "@/lib/api/http";
import { DailyEmotionMemo } from "../../features/retrospect/types/retrospect";
import { formatDateToString } from "../../utils/retrospectUtils";
import { EMOTION_TO_STICKER_ID } from "@/constants/emotion";
const createMemoPayload = (memo: {
  emotion: string;
  memo: string;
  compareNote?: string;
}) => {
  const stickerId = EMOTION_TO_STICKER_ID[memo.emotion];

  return {
    stickerId,
    memo: memo.memo,
    compareNote: memo.compareNote ?? "",
  };
};

export const getDailyEmotionMemos = async (year: number, month: number) => {
  const response = await httpClient.get("daily-reviews/month", {
    params: { year, month },
  });

  const result = response.data.data.map(
    (item: { date: string; sticker: { key: string }; memo: string }) => ({
      date: new Date(item.date),
      emotion: item.sticker.key,
      memo: item.memo,
    })
  );

  return result;
};

export const addDailyEmotionMemo = async (memo: DailyEmotionMemo) => {
  const payload = {
    date: formatDateToString(memo.date),
    ...createMemoPayload(memo),
  };

  const response = await httpClient.post("daily-reviews", payload);

  return response.data;
};

export const updateDailyEmotionMemo = async (memo: DailyEmotionMemo) => {
  const reviewDate = formatDateToString(memo.date);
  const payload = createMemoPayload(memo);

  await httpClient.put(`daily-reviews/${reviewDate}`, payload);
};

export const deleteDailyEmotionMemo = async (date: Date) => {
  const reviewDate = formatDateToString(date);
  await httpClient.delete(`daily-reviews/${reviewDate}`);
};
