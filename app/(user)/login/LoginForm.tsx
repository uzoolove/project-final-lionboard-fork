'use client';

import { login } from "@/actions/user";
import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import useUserStore from "@/zustand/userStore";

export default function LoginForm() {
  const [userState, formAction, isPending] = useActionState(login, null);
  const router = useRouter();
  const redirect = useSearchParams().get('redirect');
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    if(userState?.ok){
      setUser({
        _id: userState.item._id,
        email: userState.item.email,
        name: userState.item.name,
        image: userState.item.image,
        token: {
          accessToken: userState.item.token?.accessToken || '',
          refreshToken: userState.item.token?.refreshToken || '',
        },
      });
      alert(`${userState.item.name}님 로그인이 완료되었습니다.`);
      router.replace(redirect || '/'); // 돌아갈 페이지가 있을 경우 이동하고 없으면 메인 페이지로 이동
    }
  }, [userState, router, redirect, setUser]);

  return (
    <>
      {redirect && ( // 특정 페이지에서 끌려 왔을 경우
        <div className="text-center py-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            로그인이 필요한 서비스입니다.
          </h3>
        </div>
      )}
      {userState?.ok === 0 && ( // 로그인 실패 메시지 출력
        <div className="text-center py-4">
          <p className="text-red-500 dark:text-red-400">{userState.message}</p>
        </div>
      )}
      <form action={formAction}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="이메일을 입력하세요"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400 dark:bg-gray-700"
            name="email"
            defaultValue="u1@market.com"
          />
          <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{userState?.ok === 0 && userState.errors?.email?.msg}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400 dark:bg-gray-700"
            name="password"
            defaultValue="11111111"
          />
          <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{userState?.ok === 0 && userState.errors?.password?.msg}</p>
          <Link href="#" className="block mt-6 ml-auto text-gray-500 text-sm dark:text-gray-300 hover:underline">비밀번호를 잊으셨나요?</Link>
        </div>
        <div className="mt-10 flex justify-center items-center">
          <Button disabled={isPending} type="submit">로그인</Button>
          <Link href="/signup" className="ml-8 text-gray-800 hover:underline">회원가입</Link>
        </div>
      </form>
    </>
    
  );
}