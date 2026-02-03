'use client';

// 포트원 플레이 그라운드: https://sdk-playground.portone.io
// 포트원 개발자센터: https://developers.portone.io/opi/ko/readme?v=v2

import Script from 'next/script'; // 외부 JS 파일 로딩에 사용
import { Button } from '@/components/ui/Button';
import * as PortOne from '@portone/browser-sdk/v2';

// declare: 지정한 타입은 런타임시에 실제로 존재하므로 타입 체크시에 에러를 내지 않도록 선언
declare global { // 젼역 네임스페이스를 확장
  interface Window { // 기존의 window 객체의 타입을 확장
    IMP: {
      init: (imp: string) => void;
      certification: (req: CertificationRequest, callback?: (res: CertificationResponse) => void) => void;
    }; // IMP라는 속성의 타입을 추가
  }
}

// 본인 인증 요청 타입
interface CertificationRequest {
  channelKey: string;
  merchant_uid: string;
}

// 본인 인증 결과 타입
interface CertificationResponse {
  success: boolean;
  error_code: string;
  error_msg: string;
  imp_uid: string;
  merchant_uid: string;
  pg_provider: string;
  pg_type: string;
}

export default function PaymentPage() {

  // 본인 인증 요청
  // 참고: https://developers.portone.io/opi/ko/extra/identity-verification/v1/all/readme?v=v1
  function requestCert() {
    // window 객체는 브라우저에서만 사용 가능하므로, SSR 시에는 사용하지 않음.
    if (typeof window !== 'undefined') {
      // 고객사 식별 코드(테스트용이므로 값을 수정하면 안됨)
      window.IMP.init('imp29272276');
    }
    try {
      window.IMP.certification({
        channelKey: 'channel-key-5130c33b-27ed-4b00-b62a-47c0045ceb91',
        merchant_uid: `test_mktoht6z-${crypto.randomUUID()}`
      }, (res: CertificationResponse) => {
        console.log('인증 결과:', res);
        /*
          imp_uid를 사용하여 포트원의 REST API를 호출하면 다음과 같은 정보가 조회 되지만 테스트 환경에서는 불가능
          name: 이름
          gender: 성별
          birthday: 생년월일(YYYY-MM-DD)
          phone :휴대폰 번호
        */
      });
    } catch (error) {
      console.error('인증 실패:', error);
    }
  }

  // 결제 요청
  // 실제 결제가 이루어지지만 23시30 ~ 24:00 사이에 환불 됩니다.
  // 참고: https://developers.portone.io/opi/ko/integration/start/v2/checkout?v=v2증 SDK가 로드되지 않았습니다.') (res: CertificationRespons
  async function requestPay() {
    try {
      const response = await PortOne.requestPayment({
        // Store ID 설정(테스트용이므로 값을 수정하면 안됨)
        storeId: 'store-e4038486-8d83-41a5-acf1-844a009e0d94',
        // 채널 키 설정(테스트용이므로 값을 수정하면 안됨)
        channelKey: 'channel-key-4ca6a942-3ee0-48fb-93ef-f4294b876d28',
        // paymentId는 결제 건을 구분하는 문자열로, 결제 요청 및 조회에 필요합니다.
        // 같은 paymentId에 대해 여러 번의 결제 시도가 가능하나, 
        // 최종적으로 결제에 성공하는 것은 단 한 번만 가능합니다. (중복 결제 방지)
        paymentId: `payment-${crypto.randomUUID()}`, // 임시 문자열을 지정해서 중복되지 않게
        // 상품명
        orderName: '나이키 와플 트레이너 2 SD',
        // 결제 금액
        totalAmount: 100,
        // 결제 통화
        currency: 'KRW',
        // 결제 방법
        payMethod: 'CARD',
      });
      console.log('결제 결과:', response);
    } catch (error) {
      console.error('결제 실패:', error);
    }
  }

  return (
    <div className="max-w-4xl">
      <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="afterInteractive" />

      <h1 className="text-3xl font-bold mb-8">결제 및 본인인증 가이드</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

        <div className="flex flex-col p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-semibold mb-2">본인인증 (V1)</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            포트원 본인인증 V1 SDK를 사용하여 이름, 휴대폰 번호 등을 인증합니다.
          </p>
          <div>
            <Button onClick={requestCert}>
              인증하기
            </Button>
          </div>
        </div>

        <div className="flex flex-col p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-semibold mb-2">결제하기 (V2)</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            포트원 통합 결제 V2 SDK를 사용하여 신용카드 결제를 테스트합니다.
          </p>
          <div>
            <Button onClick={requestPay}>
              결제하기
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <h2 className="text-xl font-semibold mb-4">구현 가이드 및 주의사항</h2>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">1. SDK 로드 (Next.js)</h3>
            <p><code>next/script</code>의 <code>Script</code> 컴포넌트를 사용하여 <code>afterInteractive</code> 전략으로 로드합니다. 전역 <code>window.IMP</code> 객체를 사용하기 위해 <code>declare global</code> 선언이 필요합니다.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">2. 테스트 환경</h3>
            <ul className="list-disc list-inside ml-2">
              <li>실제 결제가 이루어지나, 테스트 모드이므로 매일 밤 11시 30분 ~ 자정 사이에 자동 환불됩니다.</li>
              <li>상용 서비스 적용 시 반드시 실제 상용 <code>storeId</code>와 <code>channelKey</code>로 변경해야 합니다.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">3. 검증 로직</h3>
            <p>클라이언트 결제 완료 후, 반드시 서버 사이드에서 포트원 REST API를 호출하여 **결제 금액 위변조 여부를 검증**해야 합니다.</p>
          </div>
        </div>
      </div>
    </div>

  );
}
