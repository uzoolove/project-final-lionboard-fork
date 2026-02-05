import ChatRoomItem from "./ChatRoomItem";
import { ChatRoomState } from "@/app/guide/chat/_types/chat";

interface ChatRoomListProps {
  rooms: ChatRoomState[];             // 표시할 채팅방 목록
  activeRoomId: number | undefined;   // 현재 선택되어 활성화된 방 ID
  onSelectRoom: (id: string) => void; // 방 선택 시 호출되는 콜백 함수
  onLeaveRoom: (id: string) => void;  // 방 나가기 버튼 클릭 시 호출되는 콜백 함수
}

export default function ChatRoomList({ rooms, activeRoomId, onSelectRoom, onLeaveRoom }: ChatRoomListProps) {
  return (
    <div className={`${activeRoomId ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col h-full border-r border-gray-200 dark:border-gray-700 shrink-0`}>
      {/* 목록 헤더 */}
      <div className="h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800/50">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">채팅 목록</h2>
      </div>

      {/* 검색바 */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="상대방 검색..."
            className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-orange-500 transition-shadow"
          />
          <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-400 text-center">
            <p className="text-sm">참여 중인 대화가 없습니다.</p>
          </div>
        ) : (
          rooms.map((room) => (
            <ChatRoomItem
              key={room._id}
              room={room}
              isActive={activeRoomId === room._id}
              onSelect={onSelectRoom}
              onLeave={onLeaveRoom}
            />
          ))
        )}
      </div>
    </div>
  );
}
