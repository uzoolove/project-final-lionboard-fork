import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import useUserStore from '@/zustand/userStore';
import { NewNotification } from '@/app/guide/notification/_types/notification';
import useNotiStore from '@/app/guide/notification/_zustand/notiStore';

let globalNotiSocket: Socket | null = null;
let isConnecting = false;

export function useNoti() {
  const user = useUserStore(state => state.user);
  const userId = user?._id;

  const {
    notiSocket, setNotiSocket,
    notifications, setNotifications
  } = useNotiStore();

  useEffect(() => {
    if (!userId || notiSocket || isConnecting) return;

    // 싱글톤 패턴: globalNotiSocket을 사용하여 컴포넌트가 리렌더링되더라도 소켓이 불필요하게 여러 번 생성되지 않도록 관리함
    if (globalNotiSocket) {
      setNotiSocket(globalNotiSocket);
      return;
    }

    isConnecting = true;
    console.log('알림서버 연결 시도...');

    // 2. 소켓 연결 생성
    const socket = io(`${process.env.NEXT_PUBLIC_NOTI_URL}/${process.env.NEXT_PUBLIC_CLIENT_ID}`, {
      reconnectionAttempts: 5,
    });

    globalNotiSocket = socket;
    setNotiSocket(socket);

    // 3. 이벤트 리스너 등록
    socket.on('connect', () => {
      console.log('알림서버 연결 완료');
      isConnecting = false;
      // 서버에 사용자 ID 등록 (해당 사용자용 알림을 받기 위함)
      socket.emit('setUserId', userId); // 메시지 전송
    });

    socket.on('disconnect', () => {
      console.log('알림서버 연결 해제');
    });

    // 서버에서 'notification' 이벤트로 데이터를 보낼 때 처리
    socket.on('notification', (data: NewNotification) => {
      console.log('알림 수신:', data);
      if (data.newNoti) {
        // 새 알림 한 건 추가
        const currentNotis = useNotiStore.getState().notifications;
        setNotifications([...currentNotis, data.newNoti]);
      } else if (data.list) {
        // 전체 알림 목록으로 갱신
        setNotifications(data.list);
      }
    });

    socket.on('connect_error', (err) => {
      console.error('알림서버 연결 실패:', err.message);
      isConnecting = false;
    });

  }, [userId, notiSocket, setNotiSocket, setNotifications]);

  return { notifications, setNotifications };
}