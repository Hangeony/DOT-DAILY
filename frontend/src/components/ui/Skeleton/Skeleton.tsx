import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={clsx("animate-pulse bg-gray-200 rounded", className)} />
  );
};

// 나의 하루 페이지용 스켈레톤 - 더 가벼운 버전
export const MyDayPageSkeleton = () => {
  return (
    <div className="w-full h-full max-w-md mx-auto min-h-screen bg-surface-base shadow-lg relative overflow-hidden flex flex-col">
      {/* 날짜 헤더 스켈레톤 */}
      <div className="flex-shrink-0 py-3 px-4 bg-surface-base z-10">
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-10 w-20 rounded-2xl" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>

      {/* 할일 그룹들 스켈레톤 - 실제와 비슷하게 */}
      <div className="flex-1 overflow-y-auto px-4 py-10 space-y-8 pb-32">
        {/* 오늘 무조건 그룹 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-3">
            {/* 할 일 아이템들 - 실제 모양과 비슷하게 */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-12 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-12 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* 오늘이면 굿 그룹 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-12 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* 잊지말자 그룹 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-18 mb-1" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-12 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 스켈레톤 */}
      <div className="flex-shrink-0 absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="flex justify-around py-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center py-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-3 w-8 mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* FAB 스켈레톤 */}
      <div className="absolute bottom-20 right-4">
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>
    </div>
  );
};

// 게스트 모드 페이지용 스켈레톤 - 더 가벼운 버전
export const GuestModePageSkeleton = () => {
  return (
    <div className="w-full h-full max-w-md mx-auto min-h-screen bg-surface-base shadow-lg relative overflow-hidden flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-sm">
        {/* 로고 스켈레톤 */}
        <Skeleton className="h-16 w-16 rounded-lg mx-auto" />

        {/* 제목 스켈레톤 */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>

        {/* 버튼들 스켈레톤 */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
};
