'use client'

import useChat from "@/app/guide/chat/_hooks/useChat";
import Link from "next/link";

export default function ChatNotification() {
  const { totalUnreadCount } = useChat(); // 전역 채팅 소켓 연결 유지 및 카운트

  return (
    <Link
      href="/guide/chat"
      className="ml-4 relative flex items-center w-8 h-8 justify-center text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-orange-600 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      {totalUnreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
        </span>
      )}
      <span className="sr-only">채팅함 이동 (알림 {totalUnreadCount}개)</span>
    </Link>
  );
}
