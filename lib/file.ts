import { ErrorRes, FileUploadRes } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
* 파일 업로드
* @param formData - 업로드할 파일이 담긴 FormData 객체
* @returns 파일 업로드 결과를 반환하는 Promise
* @description
* 파일을 서버에 업로드하고, 업로드된 파일 정보를 반환
* API 참고: https://fesp-api.koyeb.app/market/apidocs/#/%ED%8C%8C%EC%9D%BC/post_files_
*/
export async function uploadFile(file: File): Promise<FileUploadRes | ErrorRes> {
  // 새로운 FormData 객체 생성 후 파일 추가
  const fileForm = new FormData();
  fileForm.append('attach', file);

  // API 서버에 파일 업로드 요청
  const res = await fetch(`${API_URL}/files`, {
    method: 'POST',
    headers: {
      'Client-Id': CLIENT_ID,
    },
    body: fileForm,
  });
  return res.json();
}