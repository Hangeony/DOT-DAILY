import React from "react";
import Image from "next/image";

export interface EmotionStat {
  icon: string; // 이미지 경로
  label: string;
  count: number;
  color?: string; // tailwind text-mint-500 등 (아이콘에만 적용)
}

interface EmotionStatListProps {
  stats: EmotionStat[];
}

export const EmotionStatList: React.FC<EmotionStatListProps> = ({ stats }) => (
  <div className="space-y-3">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-3">
            <Image
              src={stat.icon}
              alt={stat.label}
              width={24}
              height={24}
              className={stat.color ?? ""}
            />
          </div>
          <span className="text-gray-700 font-medium">{stat.label}</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900">{stat.count}</span>
          <span className="text-sm text-gray-500 ml-1">번</span>
        </div>
      </div>
    ))}
  </div>
);
