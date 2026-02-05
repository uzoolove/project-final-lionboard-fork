import useChat from "@/app/guide/chat/_hooks/useChat";
import MessageBubble from "@/app/guide/chat/MessageBubble";
import useUserStore from "@/zustand/userStore";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ChatRoom() {
  const messagesEndRef = useRef<HTMLDivElement>(null); // 채팅창 하단 스크롤을 위한 Ref
  const router = useRouter();
  const pathname = usePathname();
  const [inputText, setInputText] = useState(''); // 메시지 입력창 상태
  // useChat 훅에서 채팅 관련 상태와 액션들을 가져옴
  const { activeRoomId, setActiveRoomId, rooms, messages, sendMessage, leaveRoom } = useChat();
  const user = useUserStore(state => state.user); // 현재 로그인한 사용자 정보

  // 메시지 변경 시 실행
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  // 현재 활성화된 방 정보 찾기
  const activeRoom = rooms.find(r =>
    activeRoomId !== undefined &&
    String(r._id) === String(activeRoomId)
  );

  // 현재 방의 멤버 중 내가 아닌 상대방 정보 추출
  const partner = activeRoom?.members.find(m => String(m._id) !== String(user._id));

  // 본인이 방의 개설자(ownerId)이면 '문의', 아니면 '답변'으로 표시
  const chatType = activeRoom?.ownerId === user._id ? '문의' : '답변';

  // 메시지 전송 핸들러
  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputText.trim() || !user) return;
    await sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className={`${!activeRoomId ? 'hidden md:flex' : 'flex'} flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-gray-900 border-none overflow-hidden`}>
      {activeRoomId && partner ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* 채팅방 상단 헤더: 상대방 정보 및 나가기 버튼 */}
          <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm z-10 shrink-0">

            <div className="flex items-center">
              <button
                onClick={() => {
                  setActiveRoomId(undefined);
                  router.replace(pathname);
                }}
                className="md:hidden mr-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="flex items-center">
                <Image
                  src={partner?.image || '/images/favicon.svg'}
                  alt={partner.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                />
                <div className="ml-3 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                      {partner?.name || '상대방'}
                    </h3>
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 font-medium">{chatType}</span>
                  </div>
                  {activeRoom?.roomName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px] md:max-w-[300px]">
                      <span className="text-gray-400 mr-1">게시글:</span>
                      {activeRoom.roomName}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (leaveRoom(activeRoomId)) {
                    router.replace(pathname);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                title="대화방 나가기"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>

          {/* 중간 영역: 채팅 메시지들이 표시되는 스크롤 영역 */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-gray-900">

            {!activeRoom || !messages.length ? (
              <div className="flex flex-col items-center justify-center h-full opacity-40">
                <p className="text-sm">아직 대화가 없습니다.</p>
                <p className="text-xs">첫 메시지를 보내 대화를 시작해보세요!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <MessageBubble
                  key={msg._id || index}
                  message={msg}
                  isMe={String(msg.senderId) === String(user._id)}
                  sender={partner || undefined}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 하단 영역: 메시지 입력 폼 */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-auto">

            <form
              onSubmit={handleSendMessage}
              className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors shadow-md"
                >
                  <svg
                    className="w-5 h-5 translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
          {/* 선택된 채팅방이 없을 때 표시되는 빈 화면 */}

          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-2">채팅을 시작해보세요</h3>
          <p className="text-sm max-w-xs">게시글의 상대방 닉네임을 클릭한 후 쪽지나 게시글 문의를 통해 대화를 시작할 수 있습니다.</p>
        </div>
      )}

    </div>
  );
}