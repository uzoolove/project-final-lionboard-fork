import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // url 관련 metadata 설정시 사용될 기본 경로 지정
  metadataBase: new URL('https://lion-board.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/images/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>멋사 게시판 - 라이언 보드</title>

        <meta name="description" content="다양한 주제의 커뮤니티와 활발한 소통을 위한 플랫폼입니다. 관심사에 따라 참여하고, 의견을 나누세요." />
        <meta name="keywords" content="커뮤니티, 소통, 포럼, 관심사, 온라인 모임, 커뮤니티 서비스" />
        <meta name="author" content="Front-End Boot Camp" />

        <meta property="og:title" content="라이언 보드에 오신걸 환영합니다." />
        <meta property="og:description" content="유용한 정보를 나누고 공유하세요." />
        <meta property="og:image" content="/images/front-end.png" />
        <meta property="og:url" content="https://lion-board.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="라이언 보드" />

      </head>
      <body className="font-sans">
        <div id="root">

          <div className="flex flex-col min-h-screen dark:bg-gray-700 dark:text-gray-200 transition-color duration-500 ease-in-out">

            <Header />

            { children }
            
            <Footer />

          </div>

        </div>
      </body>
    </html>
  );
}
  


