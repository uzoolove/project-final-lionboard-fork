'use client';

import { Post } from "@/types";
import { LinkButton } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";
import { updatePost } from "@/actions/post";
import { useActionState } from "react";
import useUserStore from "@/zustand/userStore";

export default function EditForm({ post }: { post: Post }) {

  const [postState, formAction] = useActionState(updatePost, null);

  const { user } = useUserStore();

  return (
    <form action={ formAction }>
      <div className="my-4">
        <input type="hidden" name="accessToken" value={ user?.token?.accessToken ?? ''} />
        <input type="hidden" name="_id" value={post._id} />
        <input type="hidden" name="type" value={post.type} />
        <label className="block text-lg content-center" htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          placeholder="제목을 입력하세요." 
          className="w-full py-2 px-4 border rounded-md dark:bg-gray-700 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          name="title"
          defaultValue={post.title}
        />

        <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">
          { postState?.ok === 0 && postState.errors?.title?.msg }
        </p>

      </div>
      <div className="my-4">
        <label className="block text-lg content-center" htmlFor="content">내용</label>
        <textarea 
          id="content"
          rows={15} 
          placeholder="내용을 입력하세요."
          className="w-full p-4 text-sm border rounded-lg border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          name="content"
          defaultValue={post.content}
        />

        <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">
          { postState?.ok === 0 && postState.errors?.content?.msg }
        </p>

      </div>
      <hr />
      <div className="flex justify-end my-6">
        <Button type="submit">수정</Button>
        <LinkButton href={`/${post.type}/${post._id}`}>취소</LinkButton>
      </div>
    </form>
  )
}