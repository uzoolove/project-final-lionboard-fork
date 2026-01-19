import type { Post, PostListItem, Reply } from "@/types/post";
import type { User } from "@/types/user";

// 게시물 목록 조회 결과 타입
export interface PostListRes {
  ok: 1;
  item: PostListItem[];
}

// 게시물 상세 조회 결과 타입
export interface PostInfoRes {
  ok: 1;
  item: Post;
}

// 댓글 목록 조회 결과 타입
export interface ReplyListRes {
  ok: 1;
  item: Reply[];
}

// 댓글 등록 결과 타입
export interface ReplyInfoRes {
  ok: 1;
  item: Reply;
}

// 파일 업로드 결과 타입
export interface FileUploadRes {
  ok: 1;
  item: {
    name: string;
    path: string;
  }[];
}

// 회원 정보 타입
export interface UserInfoRes {
  ok: 1;
  item: User;
}

// 게시글, 댓글 삭제 결과 타입
export interface DeleteRes {
  ok: 1;
}

// 서버 검증 에러 타입
export interface ServerValidationError {
  type: string,
  value: string,
  msg: string,
  location: string
}

// 에러 타입
export interface ErrorRes {
  ok: 0;
  message: string;
  errors?: {
    [fieldName: string]: ServerValidationError;
  };
}