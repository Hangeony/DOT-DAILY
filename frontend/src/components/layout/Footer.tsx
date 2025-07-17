"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
const tabs = [
  {
    key: "myday",
    label: "나의 하루",
    href: "/",
    icon: {
      on: "/nav-myday-on.svg",
      off: "/nav-myday.svg",
    },
  },
  {
    key: "retrospect",
    label: "오늘 회고",
    href: "/retrospect",
    icon: {
      on: "/nav-retrospect-on.svg",
      off: "/nav-retrospect.svg",
    },
  },
  {
    key: "archive",
    label: "보류함",
    href: "/archive",
    icon: {
      on: "/nav-archive-on.svg",
      off: "/nav-archive.svg",
    },
  },
  {
    key: "profile",
    label: "나의 정보",
    href: "/profile",
    icon: {
      on: "/nav-user-on.svg",
      off: "/nav-user.svg",
    },
  },
];

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-border-default">
      <nav className="h-20">
        <ul className="flex justify-around items-center h-full">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;

            return (
              <li key={tab.key}>
                <Link
                  href={tab.href}
                  className="flex flex-col items-center text-xs"
                  aria-current={isActive ? "page" : undefined}
                >
                  <Image
                    src={isActive ? tab.icon.on : tab.icon.off}
                    alt={tab.label + " 아이콘"}
                    width={24}
                    height={24}
                    priority
                  />
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
