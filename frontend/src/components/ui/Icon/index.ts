// Tree Shaking 최적화 - 깔끔한 import
import {
  Plus,
  Check,
  Eye,
  EyeOff,
  Lock,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  CalendarIcon,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  LogOut,
  User,
  Users,
  Home,
  BookOpen,
} from "lucide-react";

// 개별 export로 Tree Shaking 최적화
export {
  Plus,
  Check,
  Eye,
  EyeOff,
  Lock,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  CalendarIcon,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  LogOut,
  User,
  Users,
  Home,
  BookOpen,
};

// 아이콘 타입 정의
export type IconComponent = React.ComponentType<{
  className?: string;
  size?: number;
  color?: string;
}>;

// 자주 사용되는 아이콘 사이즈 프리셋
export const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
} as const;
