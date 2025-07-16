"use client";

import React, { useState, useMemo } from "react";
import { Menu } from "@headlessui/react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import { GuestTask, updateGuestTask, deleteGuestTask } from "@/lib/api/guestTasks";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useConfirm } from "@/components/ui/Modal/providers/ModalProvider";

interface GuestTaskItemProps {
  task: GuestTask;
  onEdit?: (task: GuestTask) => void;
  onUpdate?: () => void; // 부모 컴포넌트에서 상태 업데이트를 위한 콜백
}

// 완료 시 파티클 효과 컴포넌트 - 메모이제이션 적용
const CompletionParticles = React.memo(({ show }: { show: boolean }) => {
  const particles = useMemo(() => Array.from({ length: 4 }, (_, i) => i), []);

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((index) => {
            const randomX = (Math.random() - 0.5) * 100;
            const randomY = (Math.random() - 0.5) * 100;
            const randomRotate = Math.random() * 360;
            const emojis = ["✨", "🎉", "⭐"];
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];

            return (
              <motion.div
                key={index}
                className="absolute text-sm"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: randomX,
                  y: randomY,
                  opacity: 0,
                  scale: 1,
                  rotate: randomRotate,
                }}
                transition={{
                  type: "tween",
                  duration: 0.8,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                {emoji}
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
});

CompletionParticles.displayName = "CompletionParticles";

const GuestTaskItem = React.memo(function GuestTaskItem({
  task,
  onEdit = () => {},
  onUpdate,
}: GuestTaskItemProps) {
  const { showToast } = useToast();
  const [showParticles, setShowParticles] = useState(false);
  const confirm = useConfirm();

  const handleToggleStatus = async () => {
    const originalStatus = task.status;
    const newStatus = originalStatus === "success" ? "pending" : "success";

    try {
      const updatedTask = updateGuestTask(task.id, { status: newStatus });
      
      if (updatedTask) {
        if (onUpdate) {
          onUpdate(); // 부모 컴포넌트에서 상태 업데이트
        }

        if (newStatus === "success") {
          setShowParticles(true);
          setTimeout(() => setShowParticles(false), 1000);
          showToast("할 일을 완료했습니다! 🎉");
        } else {
          showToast("할 일 완료가 취소되었습니다.");
        }
      }
    } catch (error) {
      console.error("상태 변경 실패:", error);
      showToast("상태 변경에 실패했습니다 😞");
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm("정말로 이 할 일을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const success = deleteGuestTask(task.id);
      
      if (success && onUpdate) {
        onUpdate(); // 부모 컴포넌트에서 상태 업데이트
        showToast("할 일이 삭제되었습니다 🗑️");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      showToast("할 일 삭제에 실패했습니다 😞");
    }
  };

  const titleClassName = useMemo(
    () =>
      clsx(
        "text-sm font-medium transition-colors duration-200",
        task.status === "success"
          ? "line-through text-gray-500"
          : "text-gray-900"
      ),
    [task.status]
  );

  return (
    <div className="relative flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm will-change-auto">
      <CompletionParticles show={showParticles} />

      <div className="flex-shrink-0">
        <Checkbox
          checked={task.status === "success"}
          onCheckedChange={handleToggleStatus}
          variant={task.priority}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={titleClassName}>{task.title}</h3>
        {task.description && (
          <p className="text-xs text-gray-500 mt-1">{task.description}</p>
        )}
      </div>

      <Menu as="div" className="relative">
        <Menu.Button className="p-1 rounded hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onEdit(task)}
                className={clsx(
                  "flex items-center gap-2 w-full px-3 py-2 text-sm",
                  active ? "bg-gray-100" : ""
                )}
              >
                <Pencil className="w-4 h-4" />
                수정
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleDelete}
                className={clsx(
                  "flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600",
                  active ? "bg-red-50" : ""
                )}
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
});

export default GuestTaskItem; 