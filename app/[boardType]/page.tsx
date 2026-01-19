import ListItem from "@/app/[boardType]/ListItem";
import Link from "next/link";
import { Metadata } from "next";
import { getPosts } from "@/lib/post";
import { Button, LinkButton } from "@/components/ui/Button";

export async function generateMetadata({ params }: { params: Promise<{ boardType: string }> }): Promise<Metadata> {
  const { boardType } = await params;
  return {
    title: `${boardType} - 라이언 보드`,
    description: `${boardType} 게시판입니다.`,
    openGraph: {
      title: `${boardType} - 라이언 보드`,
      description: `${boardType} 게시판입니다.`,
      url: `/${boardType}`,
      images: {
        url: '/images/front-end.png'
      }
    }
  };
}

export default async function ListPage({ params }: { params: Promise<{ boardType: string }> }) {
  const { boardType } = await params;
  
  // 게시판 타입에 따른 제목 설정
  let boardTitle = '';
  switch (boardType) {
    case 'info':
      boardTitle = '정보 공유';
      break;
    case 'free':
      boardTitle = '자유 게시판';
      break;
    case 'qna':
      boardTitle = '질문 게시판';
      break;
  }
  
  const res = await getPosts(boardType);

  return (
    <main className="flex-1 min-w-80 p-10">
      <div className="text-center py-4">
        <h2 className="pb-4 text-2xl font-bold text-gray-700 dark:text-gray-200">{boardTitle}</h2>
      </div>
      <div className="flex justify-end mr-4">
        
        <form action="#">
          <input
            className="dark:bg-gray-600 bg-gray-100 p-1 rounded"
            type="text"
            name="keyword"
          />
          <Button type="submit">검색</Button>
        </form>

        <LinkButton href={`/${boardType}/new`} needLogin>글작성</LinkButton>
      </div>
      <section className="pt-10">
        <table className="border-collapse w-full table-fixed">
          <colgroup>
            <col className="w-[10%] sm:w-[10%]" />
            <col className="w-[60%] sm:w-[30%]" />
            <col className="w-[30%] sm:w-[15%]" />
            <col className="w-0 sm:w-[10%]" />
            <col className="w-0 sm:w-[10%]" />
            <col className="w-0 sm:w-[25%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-solid border-gray-600">
              <th className="p-2 whitespace-nowrap font-semibold">번호</th>
              <th className="p-2 whitespace-nowrap font-semibold">제목</th>
              <th className="p-2 whitespace-nowrap font-semibold">글쓴이</th>
              <th className="p-2 whitespace-nowrap font-semibold hidden sm:table-cell">조회수</th>
              <th className="p-2 whitespace-nowrap font-semibold hidden sm:table-cell">댓글수</th>
              <th className="p-2 whitespace-nowrap font-semibold hidden sm:table-cell">작성일</th>
            </tr>
          </thead>
          <tbody>
            {res.ok ? (
              res.item.map((post) => (
                <ListItem key={post._id} boardType={boardType} post={post} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <p className="text-red-500 dark:text-red-400">{res.message}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <hr />

        <div>
          <ul className="flex justify-center gap-3 m-4">
            <li className="font-bold text-blue-700">
              <Link href={`/${boardType}?page=1`}>1</Link>
            </li>
            <li>
              <Link href={`/${boardType}?page=2`}>2</Link>
            </li>
          </ul>
        </div>

      </section>
    </main>
  );
}

