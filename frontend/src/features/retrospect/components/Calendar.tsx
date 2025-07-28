"use client";

import { useCallback, useMemo, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DayCellContentArg } from "@fullcalendar/core";
import "./Calendar.css";
import { getDailyEmotionMemos } from "../../../lib/api/retrospect";
import { formatDateToString } from "../../../utils/retrospectUtils";
import { useDateStore } from "@/store/useDateStore";
import { useRetrospectStore } from "@/store/useRestrospectStore";

interface CalendarProps {
  onDateModalOpen: () => void;
}

const Calendar = ({ onDateModalOpen }: CalendarProps) => {
  const { selectedDate, setSelectedDate } = useDateStore();
  const { emotionMemoList, setEmotionMemoList, selectedYearMonth } =
    useRetrospectStore();
  const calendarRef = useRef<FullCalendar>(null);

  const onDateClick = useCallback(
    (dateInfo: DateClickArg) => {
      // 개발 모드에서만 로그 출력
      if (process.env.NODE_ENV === "development") {
        console.log("📅 날짜 클릭:", formatDateToString(dateInfo.date));
      }
      setSelectedDate(dateInfo.date);
    },
    [selectedDate, setSelectedDate]
  );

  const onDateNavigation = useCallback(() => {
    onDateModalOpen();
  }, [onDateModalOpen]);

  const emotionByDateMap = useMemo(() => {
    return emotionMemoList.reduce(
      (acc: Record<string, string>, item: { date: Date; emotion: string }) => {
        acc[formatDateToString(item.date)] = item.emotion;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [emotionMemoList]);

  const onDayCellClassNames = useCallback(
    (dayCell: DayCellContentArg) => {
      const classes = [];
      const dateString = formatDateToString(dayCell.date);
      const emotion = emotionByDateMap[dateString];

      if (emotion) {
        classes.push(`emotion-${emotion}`);
      }

      if (
        formatDateToString(dayCell.date) === formatDateToString(selectedDate)
      ) {
        classes.push("selected-date");
      }

      return classes;
    },
    [emotionByDateMap, selectedDate]
  );

  const onDayCellContent = useCallback((dayCell: DayCellContentArg) => {
    return dayCell.dayNumberText.replace("일", "");
  }, []);

  useEffect(() => {
    const fetchEmotionMemos = async () => {
      try {
        const memos = await getDailyEmotionMemos(
          selectedYearMonth.year,
          selectedYearMonth.month
        );
        setEmotionMemoList(memos);
      } catch (error) {
        console.error("감정 메모 조회 실패:", error);
      }
    };

    fetchEmotionMemos();

    if (calendarRef.current) {
      const targetDate = new Date(
        selectedYearMonth.year,
        selectedYearMonth.month - 1,
        1
      );
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(targetDate);
    }
  }, [selectedYearMonth, setEmotionMemoList]);

  return (
    <section aria-label="회고 캘린더">
      <button
        onClick={onDateNavigation}
        className="flex gap-2 items-center text-xl font-bold mb-8"
      >
        {selectedYearMonth.year}. {selectedYearMonth.month}
        <img
          src="/dropdown.svg"
          alt="달력 선택"
          width={20}
          height={20}
          style={{ width: 20, height: 20 }}
        />
      </button>
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          height={320}
          headerToolbar={false}
          dateClick={onDateClick}
          dayCellClassNames={onDayCellClassNames}
          dayCellContent={onDayCellContent}
          showNonCurrentDates={false}
          fixedWeekCount={false}
          // 성능 최적화 옵션들
          eventDisplay="block"
          dayMaxEvents={false}
          navLinks={false}
          selectable={false}
          selectMirror={false}
          unselectAuto={true}
          eventStartEditable={false}
          eventDurationEditable={false}
          eventResizableFromStart={false}
          droppable={false}
          // 렌더링 최적화
          progressiveEventRendering={true}
          lazyFetching={true}
          // 메모리 최적화
          eventOrder="start,-duration,allDay,title"
          rerenderDelay={10}
        />
      </div>
    </section>
  );
};

export default Calendar;
