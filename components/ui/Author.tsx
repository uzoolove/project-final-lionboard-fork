'use client'

import Link from "next/link";
import { Post, PostListItem } from "@/types";
import { useState, useRef, useEffect } from "react";

export default function Author({ post }: { post: Post | PostListItem }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const authorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authorRef.current && !authorRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={authorRef}>
      <span
        className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-orange-500 hover:underline font-medium"
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {post.user.name}
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-0 pb-1 z-50 whitespace-nowrap">
          <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg w-28 text-center">
            <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 transform rotate-45"></div>

            <div className="relative z-10 bg-white dark:bg-gray-800 rounded-md overflow-hidden">
              <Link
                href={`/guide/chat?user_id=${post.user._id}`}
                onClick={() => setShowTooltip(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-gray-600 dark:hover:text-white border-b dark:border-gray-700 last:border-0"
              >
                쪽지
              </Link>
              <Link
                href={`/guide/chat?post_id=${post._id}`}
                onClick={() => setShowTooltip(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                게시글 문의
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
