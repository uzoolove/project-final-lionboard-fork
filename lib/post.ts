import { ErrorRes, PostInfoRes, PostListRes, ReplyListRes } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
* 게시판 타입에 해당하는 게시글 목록 조회
* @param {string} boardType - 게시판 타입(예: notice, free 등)
* @returns {Promise<PostListRes | ErrorRes>} - 게시글 목록 응답 객체
*/
export async function getPosts(boardType: string): Promise<PostListRes | ErrorRes> {
  try{
    const res = await fetch(`${API_URL}/posts?type=${boardType}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'force-cache',
      next: {
        tags: [`posts?type=${boardType}`],
      }
    });
    return res.json();
  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 게시물 목록 조회에 실패했습니다.' };
  }
}

/**
* 특정 게시글의 상세 정보 조회
* @param {string} _id - 게시글 ID
* @returns {Promise<PostInfoRes | ErrorRes>} - 게시글 상세 정보 응답 객체
*/
export async function getPost(_id: string): Promise<PostInfoRes | ErrorRes> {
  try{
    const res = await fetch(`${API_URL}/posts/${_id}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'force-cache',
      next: {
        tags: [`posts/${_id}`],
      },
    });
    return res.json();
  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 게시물 상세 조회에 실패했습니다.' };
  }
}

/**
* 특정 게시글의 댓글 목록 조회
* @param {string} _id - 게시글 ID
* @returns {Promise<ReplyListRes | ErrorRes>} - 댓글 목록 응답 객체
*/
export async function getReplies(_id: string): Promise<ReplyListRes | ErrorRes> {
  console.log('getReplies', _id);
  try{
    const res = await fetch(`${API_URL}/posts/${_id}/replies`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'force-cache',
      next: {
        tags: [`posts/${_id}/replies`],
      },
    });
    return res.json();
  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 댓글 목록 조회에 실패했습니다.' };
  }
}