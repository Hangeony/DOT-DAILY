import type { ReactNode } from "react";
import Header from "./Header";
import { Footer } from "./Footer";
import Fab from "../ui/Fab/Fab";
import { Plus } from "lucide-react";

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
      <main className="pb-20 overflow-y-auto h-full">{children}</main>
      <Footer />
      {/* FAB는 전체 화면 기준으로 위치 */}
      {showFab && (
        <div className="absolute bottom-28 right-4 z-50 pr-4">
          <Fab aria-label="새로운 할 일 추가" onClick={onFabClick}>
            <Plus className="w-6 h-6" />
          </Fab>
        </div>
      )}
    </div>
  );
}
