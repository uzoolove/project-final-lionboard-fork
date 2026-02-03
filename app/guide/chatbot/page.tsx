'use client';

// 참고: https://developers.channel.io/ko/articles/시작하기-d27c51d1#옵션2-npm-모듈-사용

import { useEffect } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

export default function ChannelTalkGuidePage() {
  useEffect(() => {
    // SDK 스크립트 로드
    ChannelService.loadScript();

    // 초기화 설정
    ChannelService.boot({
      // 채널톡 > 채널 목록으로 가기 > 채널 설정 > 버튼 설치 및 설정 > 채널톡 버튼 설치 > Plugin Key 복사
      pluginKey: '5bc4dccb-f68c-4a0f-966b-1c4a2e195edc', // 본인의 키로 변경 필요
    });

    // 컴포넌트가 언마운트될 때 채널톡 위젯 종료
    // 다른 페이지에서도 계속 표시되도록 하려면 위젯을 종료하지 않아야 함
    return () => {
      ChannelService.shutdown();
    };
  }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">채널톡 가이드</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        채널톡 SDK를 Next.js App Router에서 사용하는 예제입니다.
        사용자 상담 서비스나 챗봇을 구현할 때 활용할 수 있습니다.
      </p>

      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <h2 className="text-xl font-semibold mb-2">테스트 방법</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-500">
          <li>오른쪽 하단에 채널톡 버튼이 나타나는지 확인합니다.</li>
          <li><code>pluginKey</code>에 실제 발급받은 키를 넣어야 정상 동작합니다.</li>
          <li>기본적으로 <code>useEffect</code>를 사용하여 클라이언트 사이드에서만 로드되도록 구현되어 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}

