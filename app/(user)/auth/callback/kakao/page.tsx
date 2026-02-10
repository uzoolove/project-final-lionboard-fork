'use client';

import { kakaoLogin } from "@/actions/user";
import useUserStore from "@/zustand/userStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function KakaoLogin() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    async function login() {
      if (code) {
        console.log(code);

        const res = await kakaoLogin(code);

        if (res?.ok) {
          setUser({
            _id: res.item._id,
            email: res.item.email,
            name: res.item.name,
            image: res.item.image,
            token: {
              accessToken: res.item.token?.accessToken || '',
              refreshToken: res.item.token?.refreshToken || '',
            },
          });
          alert(`${res.item.name}님 환영합니다.`);
          router.replace('/');
        } else {
          alert(res?.message || '로그인에 실패했습니다.');
          router.replace('/login');
        }
      }
    }

    login();
  }, [code, router, setUser]);

  return (
    <div className="py-20 text-center">
      <h1 className="text-xl font-bold mb-4">카카오 로그인 처리 중...</h1>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}