'use client';

import { Button } from "@/components/ui/Button";
import { deleteReply } from "@/actions/post";
import { Reply } from "@/types";
import useUserStore from "@/zustand/userStore";
import { useActionState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CommentDeleteForm({ reply }: { reply: Reply }) {
  const { type, _id } = useParams();
  const router = useRouter();

  const { user } = useUserStore();
  const [state, formAction, isPending] = useActionState(deleteReply, null);

  // 서버 액션 결과에 따라 처리
  useEffect(() => {
    if (state?.ok === 1) {
      // 성공 시: 서버 컴포넌트를 다시 렌더링하여 댓글 목록 갱신
      router.refresh();
    }
    if (state?.ok === 0) {
      // 실패 시: 사용자에게 메시지 표시
      alert(state?.message);
    }
  }, [state, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) event.preventDefault();
  };
  
  return (
    <form action={formAction} onSubmit={handleSubmit} className="inline ml-2">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="_id" value={_id} />
      <input type="hidden" name="replyId" value={reply._id} />
      <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
      <Button disabled={isPending} type="submit" bgColor="red" size="sm" ownerId={reply.user._id}>삭제</Button>
    </form>
  )
}