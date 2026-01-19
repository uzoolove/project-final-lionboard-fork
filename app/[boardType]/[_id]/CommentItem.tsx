import Image from "next/image";
import Link from "next/link";

import { Reply } from "@/types";
import CommentDeleteForm from "@/app/[boardType]/[_id]/CommentDeleteForm";

export default function CommentItem({ reply }: { reply: Reply }) {
  return (
    <div className="shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Image
            width={32}
            height={32}
            className="w-8 mr-2 rounded-full"
            src={reply.user.image || '/images/favicon.svg'} 
            alt={reply.user.name || '프로필 이미지'}
          />
          <Link href="" className="text-orange-400">{reply.user.name}</Link>
        </div>
        <time className="text-gray-500" dateTime={reply.createdAt}>{reply.createdAt}</time>
      </div>
      <div className="flex justify-between items-start mb-2">
        <p className="whitespace-pre-wrap text-sm flex-1">{reply.content}</p>
        <CommentDeleteForm reply={ reply } />
      </div>
    </div>
  );
}