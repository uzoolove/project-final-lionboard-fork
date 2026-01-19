import CommentItem from "@/app/[boardType]/[_id]/CommentItem";
import CommentNew from "@/app/[boardType]/[_id]/CommentNew";
import { getReplies } from "@/lib/post";

export default async function CommentList({ boardType, _id }: { boardType: string, _id: string }) {
  const res = await getReplies(_id);
  console.log('CommentList', res);
  return (
    <section className="mb-8">
      <h4 className="mt-8 mb-4 ml-2">댓글 {res.ok ? res.item.length : 0}개</h4>
      {res.ok ? (
        res.item.map((reply) => (
          <CommentItem key={reply._id} reply={reply} />
        ))
      ) : (
        <p>{res.message}</p>
      )}

      <CommentNew boardType={boardType} _id={_id} />
    </section>
  );
}