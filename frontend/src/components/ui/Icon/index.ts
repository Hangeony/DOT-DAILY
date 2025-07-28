// 아이콘 중앙 집중화 - 트리 쉐이킹 최적화
export {
  // 기본 UI 아이콘
  Plus,
  Check,
  Eye,
  EyeOff,
  Lock,

  // 액션 아이콘
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,

  // 날짜/시간 아이콘
  CalendarIcon,
  CalendarClock,

  // 네비게이션 아이콘
  ChevronLeft,
  ChevronRight,
  ChevronDown,

  // 통계 아이콘
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  LogOut,

  // 사용자 아이콘
  User,
  Users,

  // 추가 네비게이션 아이콘
  Home,
  BookOpen,
} from "lucide-react";

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
