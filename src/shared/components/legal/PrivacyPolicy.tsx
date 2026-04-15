"use client";

interface Props {
  onClose: (v?: unknown) => void;
}

export default function PrivacyPolicy({ onClose: _ }: Props) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar -mx-1 px-1 text-on-surface text-body-sm leading-relaxed space-y-6 pb-4">
      <section>
        <p className="text-on-surface-variant">
          타래(이하 &quot;서비스&quot;)는 이용자의 개인정보를 소중히 여기며,
          관련 법령을 준수합니다. 본 방침은 서비스 이용 시 수집되는 정보의
          종류·목적·보관 방법을 설명합니다.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          1. 수집하는 정보
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant">
          <li>
            <b className="text-on-surface">장소·이벤트 제보 시</b>: 제보 내용
            (장소명, 주소, 영업시간, 브랜드, 링크, 참고사항 등). 좌표는
            입력한 주소를 기반으로 변환됩니다.
          </li>
          <li>
            <b className="text-on-surface">리뷰 작성 시</b>: 닉네임, 이메일,
            비밀번호(해시 저장), 리뷰 내용.
          </li>
          <li>
            <b className="text-on-surface">자동 수집</b>: 페이지 URL, 참조 URL,
            기기 정보(OS·브라우저·화면 크기), 쿠키, IP 주소(익명화).
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          2. 이용 목적
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant">
          <li>장소·이벤트 데이터베이스 구축 및 지도 서비스 제공</li>
          <li>이용자 간 정보 공유(리뷰) 및 본인 확인(리뷰 삭제)</li>
          <li>서비스 개선을 위한 이용 통계·오류 분석</li>
        </ul>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          3. 쿠키 및 분석 도구 (Google Analytics)
        </h3>
        <p className="text-on-surface-variant mb-2">
          서비스는 이용 통계 분석을 위해 Google Analytics 4를 사용합니다.
          수집되는 정보는 페이지 방문, 클릭, 세션 정보이며 개인을 식별하지
          않는 형태로 집계됩니다. IP는 Google에 의해 일부 익명화됩니다.
        </p>
        <p className="text-on-surface-variant">
          수집을 원치 않으시면 브라우저 쿠키를 차단하거나{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium underline"
          >
            Google 분석 차단 브라우저 부가기능
          </a>
          을 설치하실 수 있습니다.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          4. 보관 기간
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant">
          <li>장소·이벤트·리뷰 데이터: 서비스 운영 기간 동안 보관</li>
          <li>리뷰 삭제 시: 즉시 파기</li>
          <li>Google Analytics 쿠키(`_ga`): 최대 2년</li>
          <li>이용 로그: 최대 6개월</li>
        </ul>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          5. 제3자 제공
        </h3>
        <p className="text-on-surface-variant">
          서비스는 이용자의 정보를 제3자에게 제공하지 않습니다. 다만 Google
          Analytics와 같이 서비스 운영에 필요한 처리 위탁은 분석 도구 제공사의
          자체 개인정보처리방침을 따릅니다.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          6. 이용자 권리
        </h3>
        <p className="text-on-surface-variant">
          작성한 리뷰는 작성 시 입력한 비밀번호로 직접 삭제하실 수 있습니다.
          제보한 장소·이벤트 데이터의 수정·삭제는 추후 문의 채널을 통해
          요청 가능합니다.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          7. 문의
        </h3>
        <p className="text-on-surface-variant">
          개인정보 처리에 관한 문의·의견은 운영팀에 전달해주세요.
          본 방침의 변경 사항은 이 페이지를 통해 공지됩니다.
        </p>
      </section>

      <p className="text-label-xs text-outline pt-2">
        최종 업데이트: 2026년 4월 15일
      </p>
    </div>
  );
}
