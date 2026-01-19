import type { User } from "@/types/user";

// 댓글 상세
export interface Reply {
  _id: number;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

// 댓글 생성 폼 타입
export type ReplyCreateForm = Pick<Reply, 'content'>;

// 게시글 타입
export type PostType = 'info' | 'free' | 'qna';

// 게시글 상세
export interface Post {
  _id: number;
  type: PostType;
  title: string;
  content: string;
  user: Pick<User, '_id' | 'name' | 'image'>;
  views: number;
  replies?: Reply[];
  createdAt: string;
  updatedAt: string;
}

// 목록에서 사용할 게시글 타입
export type PostListItem = Pick<Post, '_id' | 'type' | 'title' | 'user' | 'views' | 'createdAt'> & {
  repliesCount: number;
};

// 게시글 수정 폼 타입
export type PostUpdateForm = Pick<Post, 'title' | 'content'>;

// 게시글 생성 폼 타입
export type PostCreateForm = PostUpdateForm & {
  type: PostType;
};