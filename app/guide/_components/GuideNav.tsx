"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GuideNav() {
  const pathname = usePathname();
  const menus = [
    { name: "결제", href: "/guide/payment" },
    { name: "챗봇(채널톡)", href: "/guide/chatbot" },
  ];

  return (
    <nav className="flex flex-col space-y-2">
      {menus.map((menu) => {
        const isActive = pathname === menu.href;
        return (
          <Link
            key={menu.href}
            href={menu.href}
            className={`block p-2 rounded transition ${isActive
              ? "bg-gray-200 text-gray-900 font-bold dark:bg-gray-700 dark:text-gray-100"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
          >
            {menu.name}
          </Link>
        );
      })}
    </nav>
  );
}
