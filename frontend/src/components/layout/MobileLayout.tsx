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
    <div className="w-full min-h-screen flex flex-col">
      <Header title={headerTitle} />
      <main className="flex-1 overflow-y-auto pb-20 min-h-0">{children}</main>
      <Footer />
      {showFab && (
        <div className="fixed bottom-[100px] z-40 max-w-md mx-auto left-0 right-0 ios-fab-fix">
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
