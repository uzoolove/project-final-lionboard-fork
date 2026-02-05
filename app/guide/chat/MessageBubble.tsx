import { ChatMessage } from "@/app/guide/chat/_types/chat";
import { User } from "@/types";
import Image from "next/image";

interface MessageBubbleProps {
  message: ChatMessage; // 표시할 메시지 객체
  isMe: boolean;        // 본인이 보낸 메시지인지 여부
  sender?: User;        // 메시지 발신인 정보 (상대방 메시지인 경우에만 주로 사용)
}

export default function MessageBubble({ message, isMe, sender }: MessageBubbleProps) {
  // 프로필 이미지 경로 (없으면 기본 이미지)
  const displayImage = sender?.image || '/images/favicon.svg';

  // 시간 포맷팅 함수 (MM-DD HH:mm 형식)
  const formatTime = (createdAt: string) => {
    return createdAt ? createdAt.substring(5) : '';
  };

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {/* 상대방 메시지일 경우에만 프로필 이미지 표시 */}
        {!isMe && (
          <Image
            src={displayImage}
            alt="Profile"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full bg-gray-200 mb-1 object-cover shrink-0"
          />
        )}
        {/* 메시지 말풍선 */}
        <div className={`px-4 py-2 rounded-2xl shadow-sm relative ${isMe
            ? 'bg-orange-500 text-white rounded-br-none'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'
          }`}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">{message.content}</p>

          {/* 메시지 부가 정보 (시간, 읽음 상태) */}
          <div className={`absolute bottom-0 ${isMe ? '-left-36' : '-right-36'} flex flex-col ${isMe ? 'items-end' : 'items-start'} w-32 mb-1 gap-1`}>
            {/* 내가 보낸 메시지인데 상대방이 아직 안 읽었을 때만 '1' 표시 */}
            {isMe && message.readUserIds && message.readUserIds.length < 2 && (
              <span className="text-[10px] font-bold text-orange-400">1</span>
            )}
            <span className="text-[9px] text-gray-400 whitespace-nowrap">
              {formatTime(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>

  );
}
