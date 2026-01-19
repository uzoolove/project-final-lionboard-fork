import { Metadata } from "next";
import LoginForm from "@/app/(user)/login/LoginForm";

export const metadata: Metadata = {
  title: '로그인 - 라이언 보드',
  openGraph: {
    title: '로그인 - 라이언 보드',
    description: '로그인 페이지',
    url: '/login'
  }
};

export default async function LoginPage() {
  return (
    <main className="min-w-80 flex grow items-center justify-center py-8">
      <div className="p-8 border border-gray-200 rounded-lg w-full max-w-md dark:bg-gray-600 dark:border-0">
        <div className="text-center py-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">로그인</h2>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}