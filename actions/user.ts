'use server';

import { ErrorRes, UserInfoRes } from "@/types";
import { uploadFile } from "@/lib/file";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

type UserActionState = UserInfoRes | ErrorRes | null;

/**
* 회원가입
* @param state - 이전 상태(사용하지 않음)
* @param formData - 회원가입 폼 데이터(FormData 객체)
* @returns 회원가입 결과 응답 객체
* @description
* 첨부파일(프로필 이미지)이 있으면 파일 업로드 후 받은 파일경로를 회원 정보에 추가해서 회원가입 API를 호출
*/
export async function createUser(state: UserActionState, formData: FormData): Promise<UserActionState> {
  let res: Response;
  let data: UserInfoRes | ErrorRes;

  try{
    // 첨부파일(프로필 이미지) 처리
    const attach = formData.get('attach') as File;
    let image;
    if(attach.size > 0){
      // 파일 업로드 API 호출
      const fileRes = await uploadFile(attach);
      if(fileRes.ok && fileRes.item.length > 0){
        image = fileRes.item[0].path;
      }else{
        return { ok: 0, message: '파일 업로드 실패' };
      }
    }

    // 회원가입 요청 바디 생성
    // API 참고: https://fesp-api.koyeb.app/market/apidocs/#/%ED%9A%8C%EC%9B%90/post_users_
    const body = {
      type: formData.get('type') || 'user',
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      ...(image ? { image } : {}),
    };

    // 회원가입 API 호출
    res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
    
  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }

  return data;
}

/**
* 로그인
* @param state - 이전 상태(사용하지 않음)
* @param formData - 로그인 폼 데이터(FormData 객체)
* @returns 로그인 결과 응답 객체
* @description
* 이메일/비밀번호로 로그인 API 호출
*/
export async function login(state: UserActionState, formData: FormData): Promise<UserActionState> {
  const body = Object.fromEntries(formData.entries());

  let res: Response;
  let data: UserInfoRes | ErrorRes;

  try{
    // 로그인 API 호출
    res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();

  }catch(error){ // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }
  
  return data;
}