import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { DropResult } from "@hello-pangea/dnd";

// Dynamic Import로 DragDrop 라이브러리 분리
const DragDropContext = dynamic(
  () => import("@hello-pangea/dnd").then((mod) => mod.DragDropContext),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    ),
  }
);

interface DragDropWrapperProps {
  onDragEnd: (result: DropResult) => void;
  children: ReactNode;
}

export default function DragDropWrapper({
  onDragEnd,
  children,
}: DragDropWrapperProps) {
  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
}

// TaskGroup만 Dynamic Import (GuestTaskGroup은 제거)
export const TaskGroup = dynamic(
  () => import("@/features/myday/components/TaskGroup"),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);
