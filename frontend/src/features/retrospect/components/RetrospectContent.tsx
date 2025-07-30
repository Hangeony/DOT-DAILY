import { EMOTIONS } from "@/constants/emotion";
import { useDateStore } from "@/store/useDateStore";
import { formatDisplayDate } from "../../../utils/retrospectUtils";
import { useMemo } from "react";
import { useRetrospectStore } from "@/store/useRestrospectStore";
import { useFullScreenModal } from "@/components/ui/Modal/providers/FullScreenModalProvider";
import { useRetrospectModal } from "../../../hooks/useRestrospectModal";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

const RetrospectContent = () => {
  const { selectedDate } = useDateStore();
  const { emotionMemoList } = useRetrospectStore();
  const { openModal } = useFullScreenModal();
  const { onDelete } = useRetrospectModal();

  const selectedEmotionMemo = useMemo(() => {
    // 모든 날짜 비교 시도 - 로컬 날짜 문자열로 비교
    const found = emotionMemoList.find((item) => {
      // 로컬 시간대 기준으로 YYYY-MM-DD 형식으로 비교
      const itemDateStr = item.date.toLocaleDateString("en-CA"); // YYYY-MM-DD 형식
      const selectedDateStr = selectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD 형식
      const isMatch = itemDateStr === selectedDateStr;

      return isMatch;
    });

    return found;
  }, [emotionMemoList, selectedDate]);

  const emotion = selectedEmotionMemo?.emotion || "";
  const memo = selectedEmotionMemo?.memo || "";
  const emotionLabel = EMOTIONS.find((e) => e.id === emotion)?.label;

  const onEdit = () => {
    openModal("retrospectForm");
  };

  return (
    <article
      aria-label="회고 내용"
      className="
        bg-zinc-100
        rounded-lg
        min-h-[160px]
        p-4
      "
    >
      <header className="mb-3 flex justify-between items-center">
        <div className="text-zinc-700 font-kkonghae">
          {formatDisplayDate(selectedDate)}
        </div>
        {emotion && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-full hover:bg-zinc-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="회고 수정"
            >
              <Pencil className="w-4 h-4 text-zinc-500" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-full hover:bg-zinc-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="회고 삭제"
            >
              <Trash2 className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        )}
      </header>

      {emotion ? (
        <div className="space-y-3">
          <figure className="flex gap-3 items-center">
            <Image
              src={`/${emotion}-on.svg`}
              alt={`${emotionLabel} 이모션`}
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <figcaption className="font-kkonghae">{emotionLabel}</figcaption>
          </figure>
          {memo && (
            <div className="bg-white rounded-lg p-3">
              <p className="text-zinc-700 font-kkonghae text-sm leading-relaxed">
                {memo}
              </p>
            </div>
          )}
        </div>
      ) : (
        <figure className="flex flex-col gap-3 items-center justify-center h-24">
          <Image
            src="/good-off.svg"
            alt="회고 이모션"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <figcaption className="font-kkonghae text-zinc-600 text-center text-sm">
            작성된 회고가 없어요
          </figcaption>
        </figure>
      )}
    </article>
  );
};

export default RetrospectContent;
