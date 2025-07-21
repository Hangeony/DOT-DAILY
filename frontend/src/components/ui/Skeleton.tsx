import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

// 기본 스켈레톤
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={style}
    />
  );
};

// 텍스트 스켈레톤
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = "",
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
      />
    ))}
  </div>
);

// 카드 스켈레톤
export const CardSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}>
    <div className="flex items-center space-x-3 mb-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full mb-2" />
    <Skeleton className="h-3 w-3/4" />
  </div>
);

// 통계 카드 스켈레톤
export const StatCardSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`bg-gray-200 rounded-2xl p-3 text-center animate-pulse ${className}`}
  >
    <div className="flex justify-center mb-2">
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
    <Skeleton className="h-6 w-8 mx-auto mb-1" />
    <Skeleton className="h-3 w-12 mx-auto" />
  </div>
);

// 프로필 스켈레톤
export const ProfileSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-3xl shadow-sm p-6 border border-gray-200">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-6 w-48" />
      </div>
    </div>
  </div>
);

// 할 일 목록 스켈레톤
export const TaskListSkeleton: React.FC<{ count?: number }> = ({
  count = 3,
}) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-5 h-5 rounded" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-6 h-6 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// 감정 통계 스켈레톤
export const EmotionStatSkeleton: React.FC<{ count?: number }> = ({
  count = 5,
}) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
      >
        <div className="flex items-center">
          <Skeleton className="w-10 h-10 rounded-full mr-3" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="text-right">
          <Skeleton className="h-6 w-8" />
        </div>
      </div>
    ))}
  </div>
);

// 페이지 전체 스켈레톤
export const PageSkeleton: React.FC = () => (
  <div className="px-4 py-6 space-y-6">
    <ProfileSkeleton />

    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
      <Skeleton className="h-6 w-24 mb-6" />
      <div className="grid grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>

    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
      <Skeleton className="h-6 w-32 mb-6" />
      <EmotionStatSkeleton />
    </div>

    <Skeleton className="h-16 w-full rounded-3xl" />
  </div>
);
