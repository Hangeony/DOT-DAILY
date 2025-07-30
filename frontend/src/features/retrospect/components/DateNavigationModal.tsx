"use client";

import { useRetrospectStore } from "@/store/useRestrospectStore";
import { useState } from "react";
import Image from "next/image";

interface DateNavigationModalProps {
  onClose: () => void;
}

export default function DateNavigationModal({
  onClose,
}: DateNavigationModalProps) {
  const { selectedYearMonth, setSelectedYearMonth } = useRetrospectStore();
  const [selectedYear, setSelectedYear] = useState(selectedYearMonth.year);
  const [selectedMonth, setSelectedMonth] = useState(selectedYearMonth.month);

  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  const onPrevYear = () => setSelectedYear((prev: number) => prev - 1);
  const onNextYear = () => setSelectedYear((prev: number) => prev + 1);

  const onDateSelect = (month: number) => {
    setSelectedMonth(month);
    setSelectedYearMonth({ year: selectedYear, month });
    onClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">월 선택</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <Image
            src="/close.svg"
            alt="닫기"
            width={24}
            height={24}
            style={{ width: "24px", height: "24px" }}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-6">
        <button
          onClick={onPrevYear}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <Image
            src="/left.svg"
            alt="왼쪽"
            width={24}
            height={24}
            style={{ width: "24px", height: "24px" }}
          />
        </button>

        <div className="text-xl font-bold">{selectedYear}년</div>

        <button
          onClick={onNextYear}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <Image
            src="/right.svg"
            alt="오른쪽"
            width={24}
            height={24}
            style={{ width: "24px", height: "24px" }}
          />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 w-full">
        {months.map((month) => (
          <div key={month}>
            <button
              onClick={() => onDateSelect(month)}
              className={`
              w-full h-12
              rounded-full 
              font-medium
              ${
                selectedYear === selectedYearMonth.year &&
                selectedMonth === month
                  ? "bg-brand-primary text-white"
                  : "text-gray-900 hover:bg-gray-100"
              }
            `}
            >
              {month}월
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
