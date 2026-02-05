import ChatMain from './ChatMain';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '채팅 - 라이언 보드',
  description: '판매자와 구매자가 실시간으로 소통하는 채팅 서비스입니다.',
};

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ post_id?: string; user_id?: string }> }) {
  const { post_id, user_id } = await searchParams;

  return (
    <ChatMain
      postId={post_id}
      userId={user_id}
    />
  );
}
