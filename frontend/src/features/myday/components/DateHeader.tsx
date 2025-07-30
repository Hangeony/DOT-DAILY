"use client";

import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { clsx } from "clsx";
import { useDateStore } from "@/store/useDateStore";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { useEffect, useMemo, useCallback } from "react";
import React from "react";

const DateHeader = React.memo(() => {
  const { selectedDate, setSelectedDate } = useDateStore();

  const itemWidth = 90;
  const gap = 50;
  const centerIndex = 3;

  // 7개 날짜 배열 생성을 메모이제이션
  const dates = useMemo(() => {
    const arr = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [selectedDate]);

  const x = useMotionValue(0);
  const controls = useAnimation();

  const handleDragEnd = useCallback(
    async (_: unknown, info: { offset: { x: number } }) => {
      if (info.offset.x < -itemWidth / 2) {
        setSelectedDate(dates[centerIndex + 1]);
      } else if (info.offset.x > itemWidth / 2) {
        setSelectedDate(dates[centerIndex - 1]);
      } else {
        await controls.start({ x: 0 });
      }
    },
    [dates, setSelectedDate, controls, itemWidth, centerIndex]
  );

  useEffect(() => {
    // requestAnimationFrame을 사용하여 레이아웃 계산을 다음 프레임으로 지연
    const rafId = requestAnimationFrame(() => {
      controls.start({ x: 0 });
      x.set(0);
    });

    return () => cancelAnimationFrame(rafId);
  }, [selectedDate, controls, x]);

  const handleDateClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );

  return (
    <div className="relative w-full flex justify-center items-center py-3 px-2 overflow-x-hidden">
      <motion.div
        className="flex items-center justify-center w-full relative z-0 transform-gpu animate-optimized"
        style={{ x, touchAction: "pan-x", gap: `${gap}px` }}
        drag="x"
        dragElastic={0.2}
        animate={controls}
        onDragEnd={handleDragEnd}
      >
        {dates.map((date, idx) => {
          const isCenter = idx === centerIndex;
          const isToday = isSameDay(date, new Date());

          return (
            <div
              key={idx}
              className={clsx(
                "flex flex-row items-center transition-all cursor-pointer",
                {
                  // 중앙(선택된) 날짜 스타일
                  "bg-white text-text-strong rounded-2xl px-7 py-3 shadow-md shadow-black/10 font-bold text-lg overflow-visible":
                    isCenter,
                  // 사이드 날짜 스타일
                  "text-gray-400 font-medium text-base": !isCenter,
                }
              )}
              style={{
                minWidth: isCenter ? 80 : 60,
                opacity: isCenter ? 1 : 0.5,
                justifyContent: "center",
              }}
              onClick={() => handleDateClick(date)}
            >
              <span className="mr-2 whitespace-nowrap">
                {format(date, "M.d")}
              </span>
              <span className="whitespace-nowrap">
                {isToday ? "오늘" : format(date, "E", { locale: ko })}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* 좌우 그라데이션 오버레이 */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10"
        style={{
          background: "linear-gradient(to right, #f8fafc 70%, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10"
        style={{
          background: "linear-gradient(to left, #f8fafc 70%, transparent)",
        }}
      />
    </div>
  );
});

DateHeader.displayName = "DateHeader";

export default DateHeader;
