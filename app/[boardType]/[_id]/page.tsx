import CommentList from "@/app/[boardType]/[_id]/CommentList";
import { Metadata } from "next";
import { getPost } from "@/lib/post";
import { LinkButton } from "@/components/ui/Button";
import DeleteForm from "@/app/[boardType]/[_id]/DeleteForm";

export async function generateMetadata({ params }: { params: Promise<{ boardType: string, _id: string }> }): Promise<Metadata | undefined> {
  const { boardType, _id } = await params;
  const res = await getPost(_id);

  if (!res.ok) {
    return; // undefined를 반환하면 가까운 상위의 metadata를 사용
  }

  const post = res.item;

  return {
    title: `${post.title}`,
    description: `${post.content.substring(0, 160)}`,
    openGraph: {
      title: `${post.title}`,
      description: `${post.content.substring(0, 160)}`,
      url: `/${boardType}/${_id}`,
      images: {
        url: '/images/front-end.png'
      }
    }
  };
}

export default async function InfoPage({ params }: { params: Promise<{ boardType: string, _id: string }> }) {
  const { boardType, _id } = await params;
  const res = await getPost(_id);

  if (!res.ok) {
    return <div>{res.message}</div>;
  }

  const post = res.item;

  return (
    <main className="flex-1 container mx-auto mt-4 px-4">

      <section className="mb-8 p-4">
        <div className="font-semibold text-xl">제목 : {post.title}</div>
        <div className="text-right text-gray-400">
          <div>작성자 : {post.user.name}</div>
          <div>{post.createdAt}</div>
        </div>
        <div className="mb-4">
          <div>
            <p className="w-full p-2 whitespace-pre-wrap">{post.content}</p>
          </div>
          <hr />
        </div>
        <div className="flex justify-end my-4">
          <LinkButton href={`/${boardType}`}>목록</LinkButton>
          <LinkButton href={`/${boardType}/${_id}/edit`} bgColor="gray" ownerId={post.user._id}>수정</LinkButton>
          <DeleteForm boardType={boardType} _id={_id} ownerId={post.user._id} />
        </div>
      </section>

      <CommentList post={post} />

    </main>
  );
}