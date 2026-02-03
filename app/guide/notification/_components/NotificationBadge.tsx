'use client'

import { useNoti } from "@/app/guide/notification/_hooks/useNoti";
import useUserStore from "@/zustand/userStore";
import Link from 'next/link';
import { useState, useRef, useEffect } from "react";

export default function NotificationBadge() {
  const { notifications, setNotifications } = useNoti();
  const user = useUserStore(state => state.user);
  const [showNotiTooltip, setShowNotiTooltip] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);

  const toggleNotiTooltip = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowNotiTooltip(!showNotiTooltip);
  };

  const handleReadAll = async () => {
    if (notifications.length > 0) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'client-id': process.env.NEXT_PUBLIC_CLIENT_ID!,
            'Authorization': `Bearer ${user?.token?.accessToken}`
          }
        });
        const data = await res.json();
        if (res.ok && data.item) {
          setNotifications(data.item);
        }
      } catch (err) {
        console.error('전체 읽음 처리 실패:', err);
      }
    }
  };

  // 툴팁 상태 변화 감지 (열려있다 닫힐 때 읽음 처리)
  const prevShow = useRef(showNotiTooltip);
  useEffect(() => {
    if (prevShow.current === true && showNotiTooltip === false) {
      handleReadAll();
    }
    prevShow.current = showNotiTooltip;
  }, [showNotiTooltip]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setShowNotiTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={notiRef}>
      <Link
        href="#"
        onClick={toggleNotiTooltip}
        className="ml-4 relative flex items-center w-8 h-8 justify-center text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
            {notifications.length}
          </span>
        )}
        <span className="sr-only">알림함 목록</span>
      </Link>

      {showNotiTooltip && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 scale-100 opacity-100">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">새로운 알림</h3>
            <span className="text-[10px] text-gray-400">최근 {notifications.length}건</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">수신된 알림이 없습니다.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map((noti) => (
                  <li key={noti._id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                    <div className="flex justify-between items-start gap-2">
                      <Link href={`/${noti.extra?.boardType}/${noti.extra?.postId}`} onClick={() => setShowNotiTooltip(false)} className="flex-1">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                            {noti.content}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            {new Date(noti.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </Link>
                      <button
                        className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                        title="읽음 표시"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}