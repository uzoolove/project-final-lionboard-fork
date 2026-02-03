'use client';
import { createReply } from "@/actions/post";
import { Button, LinkButton } from "@/components/ui/Button";
import { Post } from "@/types";
import useUserStore from "@/zustand/userStore";
import { useActionState } from "react";

export default function CommentNew({ post }: { post: Post }) {
  const [state, formAction, isPending] = useActionState(createReply, null);
  const { user } = useUserStore();

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h4 className="mb-4">새로운 댓글을 추가하세요.</h4>
      {!user ? (
        <p><LinkButton href={`/login?redirect=/${post.type}/${post._id}`} size="sm">로그인</LinkButton> 후 이용해주세요.</p>
      ) : (
        <form action={formAction}>
          <input type="hidden" name="_id" value={post._id} />
          <input type="hidden" name="type" value={post.type} />
          <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
          <input type="hidden" name="targetId" value={post.user._id} />
          <div className="mb-4">
            <textarea
              rows={3}
              cols={40}
              className="block p-2 w-full text-sm border rounded-lg border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="내용을 입력하세요."
              name="content"></textarea>

            <p className="ml-2 mt-1 text-sm text-red-500">
              {state?.ok === 0 && state.errors?.content?.msg}
            </p>

          </div>
          <Button disabled={isPending} type="submit">댓글 등록</Button>
        </form>
      )}
    </div>
  );
}