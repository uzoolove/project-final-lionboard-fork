import { ChatRoomState } from "@/app/guide/chat/_types/chat";
import useUserStore from "@/zustand/userStore";
import Image from "next/image";

interface ChatRoomItemProps {
  room: ChatRoomState;             // 채팅방 상태 정보 (방 정보, 마지막 메시지, 읽지 않은 수 등)
  isActive: boolean;               // 현재 활성화(선택)된 방인지 여부
  onSelect: (id: string) => void;  // 방 선택 시 실행될 핸들러
  onLeave: (id: string) => void;   // 방 나가기 버튼 클릭 시 실행될 핸들러
}

export default function ChatRoomItem({ room, isActive, onSelect, onLeave }: ChatRoomItemProps) {
  const { user: currentUser } = useUserStore();

  // 현재 로그인한 사용자를 제외한 상대방 정보 추출
  const partner = room.members.find(m => String(m._id) !== String(currentUser?._id));
  const displayName = partner?.name || '알 수 없는 사용자';
  const displayImage = partner?.image || '/images/favicon.svg';

  // 마지막 메시지 정보
  const lastMessage = room.lastMessage;

  // 채팅방 유형 정의 (본인이 만든 방일 경우 '문의', 상대방이 만든 방일 경우 '답변')
  const chatType = room.ownerId === currentUser?._id ? '문의' : '답변';

  // 읽지 않은 메시지 수
  const unreadCount = room.unreadCount || 0;

  // 마지막 메시지 내용 렌더링 함수
  const renderLastMessage = () => {
    if (!lastMessage) return '새로운 채팅방이 생성되었습니다.';
    return lastMessage.content || '새로운 메시지가 있습니다.';
  };

  // 채팅방 나가기 클릭 핸들러 (부모로 이벤트 전달)
  const handleLeave = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모의 onClick(onSelect) 방지
    onLeave(String(room._id));
  };

  return (
    <div
      onClick={() => onSelect(String(room._id))}
      className={`group relative flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isActive ? 'bg-orange-50 dark:bg-gray-700' : ''}`}
    >
      <button
        onClick={handleLeave}
        className="absolute top-2 right-2 p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity z-10"
        title="나가기"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative shrink-0">
        <Image
          src={displayImage}
          alt={displayName}
          width={40}
          height={40}
          className="w-12 h-12 rounded-full bg-gray-200 object-cover"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1 pr-5">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {displayName}
            </h3>
            <span className="shrink-0 text-[10px] px-1.2 py-0.3 rounded border bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
              {chatType}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-2 shrink-0">
            {lastMessage?.createdAt || room.updatedAt || ''}
          </span>
        </div>

        {room.roomName && (
          <div className="mb-1 min-w-0">
            <span className="text-[10px] text-gray-800 dark:text-gray-300 truncate font-medium block">
              <span className="text-gray-500 dark:text-gray-500 font-normal mr-1">게시글:</span>
              {room.roomName}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate pr-2">{renderLastMessage()}</p>
          {unreadCount > 0 && (
            <span className="shrink-0 inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 text-[10px] font-bold text-white bg-orange-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
