"use client";

import React, { useState } from "react";
import { ArchiveList } from "@/features/archive/components";
import MobileLayout from "@/components/layout/MobileLayout";
import {
  getArchiveTasks,
  moveToTodayFromArchive,
  deleteArchiveTask,
  updateArchiveTask,
} from "@/lib/api/tasks";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useDateStore } from "@/store/useDateStore";
import BottomSheetModal from "@/components/ui/Modal/components/BottomSheetModal";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button/Button";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArchiveTask {
  id: string;
  title: string;
  priority: 1 | 2 | 3;
  retryCount: number; // 📝 UI용 필드 (백엔드에는 없음)
  dueDate: string; // 'YY.MM.DD'
  archivedDate?: string; // 보류된 시기 추가
}

export default function ArchivePage() {
  const queryClient = useQueryClient();
  const { selectedDate } = useDateStore();
  const { showToast } = useToast();
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<1 | 2 | 3>(1);
  const { isGuest } = useAuthStore();
  const router = useRouter();

  // useQuery로 보관함 데이터 불러오기
  const { data: archiveTasks = [], isLoading } = useQuery({
    queryKey: ["archiveTasks"],
    queryFn: getArchiveTasks,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    enabled: !isGuest, // 게스트 모드가 아닐 때만 실행
  });

  const handleEdit = (id: string) => {
    const task = archiveTasks.find((t) => String(t.id) === id);
    if (!task) return;
    setEditTaskId(id);
    setEditTitle(task.title);
    // ✅ Task 인터페이스의 priority는 이미 string이므로 변환 필요
    setEditPriority(
      task.priority === "must" ? 1 : task.priority === "should" ? 2 : 3
    );
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editTaskId) return;
    try {
      let priorityStr: "must" | "should" | "remind" = "must";
      if (editPriority === 1) priorityStr = "must";
      else if (editPriority === 2) priorityStr = "should";
      else priorityStr = "remind";
      await updateArchiveTask(Number(editTaskId), {
        title: editTitle,
        priority: priorityStr,
      });
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["archiveTasks"] });
      showToast("보류함 할 일이 수정되었습니다 ✏️");
    } catch {
      showToast("보류함 할 일 수정에 실패했습니다 😞");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArchiveTask(Number(id));
      queryClient.invalidateQueries({ queryKey: ["archiveTasks"] });
      showToast("보류함 할 일이 삭제되었습니다 🗑️");
    } catch {
      showToast("보류함 할 일 삭제에 실패했습니다 😞");
    }
  };

  const handleMoveToToday = async (id: string) => {
    try {
      await moveToTodayFromArchive(Number(id));
      const todayKey = selectedDate.toISOString().split("T")[0];
      // 1. 보류함 캐시에서 즉시 제거 (optimistic)
      queryClient.setQueryData(["archiveTasks"], (old: ArchiveTask[] = []) =>
        old.filter((task) => String(task.id) !== id)
      );
      // 2. MyDay만 invalidate (archive는 setQueryData로 이미 반영됨)
      await queryClient.invalidateQueries({ queryKey: ["tasks", todayKey] });
      showToast("오늘 할 일로 이동했습니다 📅");
    } catch {
      showToast("오늘 할 일로 이동에 실패했습니다 😞");
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  // 게스트 모드일 때 로그인 필요 메시지 표시
  if (isGuest) {
    return (
      <MobileLayout headerTitle="보류함">
        <div className="px-4 py-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  보류함 기능
                </h1>
                <p className="text-gray-500 text-sm">
                  로그인하면 보류함 기능을 사용할 수 있어요
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">보류함이란?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">오늘 하기 어려운 할 일을 임시로 보관</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">나중에 다시 오늘 할 일로 가져올 수 있음</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">할 일 목록을 깔끔하게 관리</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">우선순위에 따라 할 일을 정리</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="font-kkonghae text-lg text-blue-800">💡 보류함 사용 팁</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>오늘 하기 어려운 할 일은 보류함에 보관하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>나중에 여유가 있을 때 다시 가져와서 처리하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>보류함에서도 할 일을 수정하거나 삭제할 수 있어요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>정말 필요 없는 할 일은 삭제해서 목록을 깔끔하게 유지하세요</span>
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleLogin}
            className="rounded-full py-3 text-lg font-bold"
          >
            로그인하고 보류함 사용하기
          </Button>
        </div>
      </MobileLayout>
    );
  }

  // archiveTasks 데이터를 UI용 형태로 변환
  const today = new Date();
  const archiveTaskList: ArchiveTask[] = archiveTasks.map((task) => ({
    id: String(task.id),
    title: task.title,
    priority: task.priority === "must" ? 1 : task.priority === "should" ? 2 : 3,
    retryCount: task.retryCount || 0, // 📝 백엔드에서 retryCount가 없으면 0으로 처리
    dueDate: task.date.slice(2).replace(/-/g, "."),
    archivedDate: today.toISOString().slice(2, 10).replace(/-/g, "."), // 현재 날짜를 보류된 시기로 설정
  }));

  return (
    <MobileLayout headerTitle="보류함">
      <div className="px-4 py-6 space-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-zinc-500">로딩 중...</div>
          </div>
        ) : (
          <ArchiveList
            tasks={archiveTaskList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMoveToToday={handleMoveToToday}
          />
        )}
      </div>
      <BottomSheetModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <div className="py-4">
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              오늘의 할 일을 적어주세요
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="할 일 제목"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">우선순위</label>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-full border ${
                  editPriority === 1
                    ? "bg-red-500 text-white"
                    : "bg-white text-red-500 border-red-500"
                }`}
                onClick={() => setEditPriority(1)}
              >
                1 무조건
              </button>
              <button
                className={`px-3 py-1 rounded-full border ${
                  editPriority === 2
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-emerald-500 border-emerald-500"
                }`}
                onClick={() => setEditPriority(2)}
              >
                2 오늘이면 굿
              </button>
              <button
                className={`px-3 py-1 rounded-full border ${
                  editPriority === 3
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 border-blue-500"
                }`}
                onClick={() => setEditPriority(3)}
              >
                3 잊지말자
              </button>
            </div>
          </div>
          <button
            className="w-full bg-indigo-600 text-white py-2 rounded-full font-semibold"
            onClick={handleEditSave}
            disabled={!editTitle.trim()}
          >
            저장하기
          </button>
        </div>
      </BottomSheetModal>
    </MobileLayout>
  );
}
