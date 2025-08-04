"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const MyDayIcon = ({
  isActive,
  className,
}: {
  isActive: boolean;
  className?: string;
}) => (
  <svg fill="none" viewBox="0 0 24 24" className={className}>
    <path
      fill={isActive ? "#7f7f87" : "#c5c5cb"}
      d="M9 21q-2.5 0-4.25-1.75T3 15V9q0-2.5 1.75-4.25T9 3h6q2.5 0 4.25 1.75T21 9v6q0 2.5-1.75 4.25T15 21zm2-7.8-1.5-1.5a.95.95 0 0 0-.7-.275.95.95 0 0 0-.7.275.95.95 0 0 0-.275.7q0 .425.275.7l2.2 2.2q.3.3.7.3t.7-.3l4.6-4.6a.95.95 0 0 0 .275-.7.95.95 0 0 0-.275-.7.95.95 0 0 0-.7-.275.95.95 0 0 0-.7.275zM9 19h6q1.65 0 2.825-1.175T19 15V9q0-1.65-1.175-2.825T15 5H9Q7.35 5 6.175 6.175T5 9v6q0 1.65 1.175 2.825T9 19"
    />
  </svg>
);

const RetrospectIcon = ({
  isActive,
  className,
}: {
  isActive: boolean;
  className?: string;
}) => (
  <svg fill="none" viewBox="0 0 24 24" className={className}>
    <path
      fill={isActive ? "#7f7f87" : "#c5c5cb"}
      d="M9 16.5q-1.05 0-1.775-.725T6.5 14t.725-1.775T9 11.5t1.775.725T11.5 14t-.725 1.775T9 16.5M5 22q-.824 0-1.412-.587A1.93 1.93 0 0 1 3 20V6q0-.824.587-1.412A1.93 1.93 0 0 1 5 4h1V3q0-.424.287-.712A.97.97 0 0 1 7 2q.424 0 .713.288Q8 2.575 8 3v1h8V3q0-.424.288-.712A.97.97 0 0 1 17 2q.424 0 .712.288Q18 2.575 18 3v1h1q.824 0 1.413.588Q21 5.175 21 6v14q0 .824-.587 1.413A1.93 1.93 0 0 1 19 22zm0-2h14V10H5zM5 8h14V6H5z"
    />
  </svg>
);

const ArchiveIcon = ({
  isActive,
  className,
}: {
  isActive: boolean;
  className?: string;
}) => (
  <svg fill="none" viewBox="0 0 24 24" className={className}>
    <path
      fill={isActive ? "#7f7f87" : "#c5c5cb"}
      d="M4 20q-.824 0-1.412-.587A1.93 1.93 0 0 1 2 18V6q0-.824.587-1.412A1.93 1.93 0 0 1 4 4h5.175a1.98 1.98 0 0 1 1.4.575L12 6h9q.424 0 .712.287Q22 6.576 22 7q0 .424-.288.713A.97.97 0 0 1 21 8h-9.825l-2-2H4v12l1.975-6.575q.2-.65.738-1.038A2 2 0 0 1 7.9 10h12.9q1.024 0 1.613.813.587.812.312 1.762l-1.8 6a1.95 1.95 0 0 1-.738 1.038A2 2 0 0 1 19 20zm2.1-2H19l1.8-6H7.9z"
    />
  </svg>
);

const UserIcon = ({
  isActive,
  className,
}: {
  isActive: boolean;
  className?: string;
}) => (
  <svg fill="none" viewBox="0 0 24 24" className={className}>
    <path
      fill={isActive ? "#7f7f87" : "#c5c5cb"}
      d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562.437-.713 1.162-1.088a14.8 14.8 0 0 1 3.15-1.163A13.8 13.8 0 0 1 12 13q1.65 0 3.25.387 1.6.388 3.15 1.163.724.375 1.163 1.087Q20 16.35 20 17.2v.8q0 .824-.587 1.413A1.93 1.93 0 0 1 18 20H6q-.824 0-1.412-.587A1.93 1.93 0 0 1 4 18m2 0h12v-.8a.973.973 0 0 0-.5-.85q-1.35-.675-2.725-1.012a11.6 11.6 0 0 0-5.55 0Q7.85 15.675 6.5 16.35a.97.97 0 0 0-.5.85zm6-8q.825 0 1.412-.588Q14 8.826 14 8q0-.824-.588-1.412A1.93 1.93 0 0 0 12 6q-.825 0-1.412.588A1.93 1.93 0 0 0 10 8q0 .825.588 1.412Q11.175 10 12 10"
    />
  </svg>
);

const tabs = [
  {
    key: "myday",
    label: "나의 하루",
    href: "/",
    IconComponent: MyDayIcon,
  },
  {
    key: "retrospect",
    label: "오늘 회고",
    href: "/retrospect",
    IconComponent: RetrospectIcon,
  },
  {
    key: "archive",
    label: "보류함",
    href: "/archive",
    IconComponent: ArchiveIcon,
  },
  {
    key: "profile",
    label: "나의 정보",
    href: "/profile",
    IconComponent: UserIcon,
  },
];

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 bg-white border-t border-border-default">
      <nav className="h-20">
        <ul className="flex justify-around items-center h-full">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const IconComponent = tab.IconComponent;

            return (
              <li key={tab.key}>
                <Link
                  href={tab.href}
                  className="flex flex-col items-center text-xs"
                  aria-current={isActive ? "page" : undefined}
                >
                  <IconComponent isActive={isActive} className="w-6 h-6" />
                  <span
                    className={clsx(
                      "mt-1",
                      isActive ? "text-nav-active" : "text-nav-inactive"
                    )}
                  >
                    {tab.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
