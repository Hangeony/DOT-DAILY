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
import Image from "next/image";

interface CalendarProps {
  onDateModalOpen: () => void;
}

const Calendar = ({ onDateModalOpen }: CalendarProps) => {
  const { selectedDate, setSelectedDate } = useDateStore();
  const { emotionMemoList, setEmotionMemoList, selectedYearMonth } =
    useRetrospectStore();
  const calendarRef = useRef<FullCalendar>(null);

  const onDateClick = (dateInfo: DateClickArg) => {
    console.log("📅 날짜 클릭:", {
      clickedDate: dateInfo.date,
      clickedDateString: formatDateToString(dateInfo.date),
      currentSelectedDate: selectedDate,
      currentSelectedDateString: formatDateToString(selectedDate),
    });
    setSelectedDate(dateInfo.date);
  };

  const onDateNavigation = () => {
    onDateModalOpen();
  };

  const emotionByDateMap = useMemo(() => {
    return emotionMemoList.reduce((acc, item) => {
      acc[formatDateToString(item.date)] = item.emotion;
      return acc;
    }, {} as Record<string, string>);
  }, [emotionMemoList]);

  const onDayCellClassNames = useCallback(
    (dayCell: DayCellContentArg) => {
      const classes = [];

      if (
        formatDateToString(dayCell.date) === formatDateToString(selectedDate)
      ) {
        classes.push("selected");
      }

      const emotionType = emotionByDateMap[formatDateToString(dayCell.date)];
      if (emotionType) {
        classes.push(`emotion-${emotionType}`);
      }

      return classes;
    },
    [selectedDate, emotionByDateMap]
  );

  const onDayCellContent = (e: DayCellContentArg) => {
    return e.dayNumberText.replace("일", "");
  };

  useEffect(() => {
    const { year, month } = selectedYearMonth;

    const getEmotionMemos = async () => {
      const data = await getDailyEmotionMemos(year, month);
      setEmotionMemoList(data);
    };
    getEmotionMemos();

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
        <Image
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
        />
      </div>
    </section>
  );
};

export default Calendar;
