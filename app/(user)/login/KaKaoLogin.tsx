import Image from "next/image";
import Script from "next/script";

export default function KaKaoLogin() {
  function loginWithKakao() {
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri: process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI!,
      });
    }
  }
  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.7/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY!);
          }
        }}
      />
      <button type="button" onClick={loginWithKakao} className="ml-2 flex items-center">
        <Image
          src="/images/kakao_login_medium.png"
          alt="카카오 로그인"
          width={56}
          height={28}
          className="h-7 w-auto"
        />
      </button>
    </>
  );
}