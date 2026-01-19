'use server';

import { DeleteRes, ErrorRes, PostInfoRes, ReplyInfoRes } from "@/types";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

type ActionState = ErrorRes | null;

/**
* 게시글 등록
* @param {ActionState} prevState - 이전 상태(사용하지 않음)
* @param {FormData} formData - 게시글 정보를 담은 FormData 객체
* @returns {Promise<ActionState>} - 생성 결과 응답 객체
* @throws {Error} - 네트워크 오류 발생 시
* @description
* 게시글을 생성하고, 성공 시 해당 게시판으로 리다이렉트
* 실패 시 에러 메시지를 반환
*/
export async function createPost(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const accessToken = formData.get('accessToken');
  formData.delete('accessToken');
  
  // FormData를 일반 Object로 변환
  const body = Object.fromEntries(formData.entries());

  let res: Response;
  let data: PostInfoRes | ErrorRes;

  try{
    res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
    
  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }

  // redirect()는 예외를 throw 해서 처리하는 방식이라서 try 문에서 사용하면 catch로 처리되므로 제대로 동작하지 않음
  // 따라서 try 문 밖에서 사용해야 함
  if (data.ok) {
    revalidatePath(`/${body.type}`); // 게시글 목록 갱신
    redirect(`/${body.type}`); // 게시글 목록 페이지로 리다이렉트
  }else{
    return data; // 에러 응답 객체 반환
  }
}

/**
* 게시글 수정
* @param {ActionState} prevState - 이전 상태(사용하지 않음)
* @param {FormData} formData - 게시글 정보를 담은 FormData 객체
* @returns {Promise<ActionState>} - 수정 결과 응답 객체
* @description
* 게시글을 수정하고, 성공 시 해당 게시글 상세 페이지로 이동
* 실패 시 에러 메시지를 반환
*/
export async function updatePost(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const _id = formData.get('_id'); // 게시글 고유 ID
  const type = formData.get('type'); // 게시판 타입
  const accessToken = formData.get('accessToken'); // 인증 토큰

  const body = {
    title: formData.get('title'),
    content: formData.get('content'),
  };

  let res: Response;
  let data: PostInfoRes | ErrorRes;
  
  try{
    // 게시글 수정 API 호출
    res = await fetch(`${API_URL}/posts/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`, // 인증 토큰
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
    
  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }

  // 수정 성공 시 해당 게시글 상세 페이지로 이동
  if (data.ok) {
    // revalidateTag는 다음 요청시 일단 캐시된 데이터를 응답하고 캐시를 갱신하지만 updateTag는 즉시 만료 처리해서 다음 요청시 바로 새로운 데이터 확인 가능
    updateTag(`posts/${_id}`); // 게시글 상세 정보 캐시 무효화
    updateTag(`posts?type=${type}`); // 게시글 목록 캐시 무효화
    redirect(`/${type}/${_id}`);
  }else{
    return data;
  }
}

/**
* 게시글 삭제
* @param {ActionState} prevState - 이전 상태(사용하지 않음)
* @param {FormData} formData - 삭제할 게시글 정보를 담은 FormData 객체
* @returns {Promise<ActionState>} - 삭제 결과 응답 객체
* @throws {Error} - 네트워크 오류 발생 시
* @description
* 게시글을 삭제하고, 성공 시 해당 게시판 목록 페이지로 리다이렉트
* 실패 시 에러 메시지를 반환
*/
export async function deletePost(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const _id = formData.get('_id');
  const type = formData.get('type');
  const accessToken = formData.get('accessToken');

  let res: Response;
  let data: DeleteRes | ErrorRes;
  
  try{
    res = await fetch(`${API_URL}/posts/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    data = await res.json();
    
  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }

  if (data.ok) {
    updateTag(`posts/${_id}`);
    updateTag(`posts?type=${type}`);
    redirect(`/${type}`);
  }else{
    return data;
  }
}

type ReplyActionState = ReplyInfoRes | ErrorRes | null;
/**
* 댓글 등록
* @param {ReplyInfoRes | null} prevState - 이전 상태(사용하지 않음)
* @param {FormData} formData - 댓글 정보를 담은 FormData 객체
* @returns {Promise<ReplyInfoRes | ErrorRes>} - 생성 결과 응답 객체
* @description
* 댓글을 생성하고, 성공 시 해당 게시글의 댓글 목록을 갱신
*/
export async function createReply(prevState: ReplyActionState, formData: FormData): Promise<ReplyActionState> {
  const body = Object.fromEntries(formData.entries());
  console.log('createReply', body);
  let res: Response;
  let data: ReplyInfoRes | ErrorRes;

  try{
    res = await fetch(`${API_URL}/posts/${body._id}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        'Authorization': `Bearer ${body.accessToken}`,
      },
      body: JSON.stringify({ content: body.content }),
    });

    data = await res.json();

  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
  
  if (data.ok) {
    updateTag(`posts/${body._id}/replies`); // 댓글 목록 갱신
  }
  
  return data; // 에러 응답 객체 반환
}

type DeleteReplyActionState = DeleteRes | ErrorRes | null;
/**
* 댓글 삭제
* @param {DeleteReplyActionState} prevState - 이전 상태(사용하지 않음)
* @param {FormData} formData - 삭제할 댓글 정보를 담은 FormData 객체
* @returns {Promise<DeleteReplyActionState>} - 삭제 결과 응답 객체
* @description
* 댓글을 삭제하고, 성공 시 해당 게시글의 댓글 목록을 갱신
*/
export async function deleteReply(prevState: DeleteReplyActionState, formData: FormData): Promise<DeleteReplyActionState> {
  const _id = formData.get('_id');
  const replyId = formData.get('replyId');
  const accessToken = formData.get('accessToken');

  let res: Response;
  let data: DeleteRes | ErrorRes;
  
  try{
    res = await fetch(`${API_URL}/posts/${_id}/replies/${replyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    data = await res.json();
    
  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }

  if (data.ok) {
    updateTag(`posts/${_id}/replies`);
  }
  
  return data;
}

