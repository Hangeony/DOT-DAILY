import type { ReactNode } from "react";
import Header from "./Header";
import { Footer } from "./Footer";
import Fab from "../ui/Fab/Fab";
import { Plus } from "@/components/ui/Icon";

interface MobileLayoutProps {
  children: ReactNode;
  headerTitle: string;
  showFab?: boolean;
  onFabClick?: () => void;
}

export default function MobileLayout({
  children,
  headerTitle,
  showFab = false,
  onFabClick,
}: MobileLayoutProps) {
  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-surface-base shadow-lg relative overflow-hidden">
      <Header title={headerTitle} />
      <main className="pb-20 overflow-y-auto min-h-0 flex-1">{children}</main>
      <Footer />
      {/* FAB는 fixed 포지션으로 Footer와 독립적으로 위치 - 오른쪽 정렬 */}
      {showFab && (
        <div className="fixed bottom-[100px] z-50 max-w-md mx-auto left-0 right-0">
          <div className="flex justify-end pr-4">
            <Fab aria-label="새로운 할 일 추가" onClick={onFabClick}>
              <Plus className="w-6 h-6" />
            </Fab>
          </div>
        </div>
      )}
    </div>
  );
}
