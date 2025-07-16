"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { clsx } from "clsx";
import React from "react";
import GuestTaskItem from "./GuestTaskItem";
import type { GuestTask } from "@/lib/api/guestTasks";
import { TaskListSkeleton } from "./TaskListSkeleton";

type Priority = "must" | "should" | "remind";

interface GuestTaskGroupProps {
  priority: Priority;
  title: string;
  tasks?: GuestTask[];
  droppableId: string;
  onEmptyClick?: () => void;
  isLoading?: boolean;
  onEdit?: (task: GuestTask) => void;
  onUpdate?: () => void; // 상태 업데이트를 위한 콜백
}

const priorityMap: Record<
  Priority,
  { color: string; number: number; emptyMessage: string }
> = {
  must: {
    color: "bg-priority-must",
    number: 1,
    emptyMessage: "오늘 꼭 해야 할 일을 등록해보세요",
  },
  should: {
    color: "bg-priority-should",
    number: 2,
    emptyMessage: "오늘 하면 좋을 일을 추가해보세요",
  },
  remind: {
    color: "bg-priority-remind",
    number: 3,
    emptyMessage: "잊지 말아야 할 일을 기록해보세요",
  },
};

const GuestTaskGroup = ({
  priority,
  title,
  tasks,
  droppableId,
  onEmptyClick,
  isLoading,
  onEdit,
  onUpdate,
}: GuestTaskGroupProps) => {
  const { color, number, emptyMessage } = priorityMap[priority];

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={clsx(
            "w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold",
            color
          )}
        >
          {number}
        </div>
        <h2 className="text-lg font-bold text-text-strong">{title}</h2>
      </div>
      {isLoading ? (
        <TaskListSkeleton />
      ) : (
        <Droppable droppableId={droppableId}>
          {(provided: DroppableProvided) => (
            <div
              className="space-y-2"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks && tasks.length > 0 ? (
                tasks.map((task, idx) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id}
                    index={idx}
                  >
                    {(
                      provided: DraggableProvided,
                      snapshot: DraggableStateSnapshot
                    ) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.7 : 1,
                        }}
                      >
                        <GuestTaskItem 
                          task={task} 
                          onEdit={onEdit} 
                          onUpdate={onUpdate}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <button
                  type="button"
                  className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed w-full focus:outline-none transition hover:brightness-95 active:scale-95"
                  style={{
                    background: "rgba(188, 232, 241, 0.12)",
                    borderColor: "#bce8f1",
                  }}
                  onClick={onEmptyClick}
                >
                  <span className="mb-2 text-2xl">📝</span>
                  <p className="font-kkonghae text-zinc-400 text-base">
                    {emptyMessage}
                  </p>
                </button>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </section>
  );
};

export default React.memo(GuestTaskGroup); 