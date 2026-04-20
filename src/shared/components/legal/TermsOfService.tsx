"use client";

/*
 * 이용약관 초안 — 출시 전 법무 검토 필요.
 * 기준: 일반적 UGC(사용자 생성 콘텐츠) 서비스 표준 문구.
 */

interface Props {
  onClose: (v?: unknown) => void;
}

export default function TermsOfService({ onClose: _ }: Props) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar -mx-1 px-1 text-on-surface text-body-sm leading-relaxed space-y-6 pb-4">
      <section>
        <p className="text-on-surface-variant">
          본 약관은 타래(이하 &quot;서비스&quot;)를 이용함에 있어 서비스와
          이용자 간의 권리·의무 및 책임 사항을 규정하는 것을 목적으로 합니다.
          이용자는 서비스를 이용함으로써 본 약관에 동의한 것으로 봅니다.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          1. 용어의 정의
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant">
          <li>
            <b className="text-on-surface">서비스</b>: 타래가 제공하는 뜨개
            관련 장소·이벤트 정보 및 지도·리뷰·제보 기능 일체.
          </li>
          <li>
            <b className="text-on-surface">이용자</b>: 본 약관에 동의하고
            서비스를 이용하는 모든 자.
          </li>
          <li>
            <b className="text-on-surface">게시물</b>: 이용자가 서비스에
            작성·업로드한 리뷰, 장소·이벤트 제보 등 일체의 정보.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          2. 서비스의 제공
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant">
          <li>장소·이벤트 지도 탐색 및 상세 정보 제공</li>
          <li>이용자 제보를 통한 장소·이벤트 데이터 수집 및 큐레이션</li>
          <li>리뷰 작성·조회·삭제 기능</li>
          <li>서비스는 운영상·기술상 필요에 따라 사전 공지 후 변경·중단될 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          3. 이용자의 의무
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant">
          <li>타인의 권리·명예·신용을 침해하는 게시물 작성 금지</li>
          <li>허위·과장 정보, 광고·홍보성 게시물, 스팸 작성 금지</li>
          <li>서비스 운영을 방해하거나 비정상적인 방법으로 접근하는 행위 금지</li>
          <li>저작권 등 제3자의 지식재산권을 침해하는 게시물 작성 금지</li>
          <li>타인의 개인정보를 무단 수집·공개하는 행위 금지</li>
        </ul>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          4. 게시물의 관리
        </h3>
        <p className="text-on-surface-variant mb-2">
          서비스는 이용자가 작성한 게시물이 본 약관 또는 관련 법령에 위배된다고
          판단하는 경우, 사전 통지 없이 해당 게시물을 수정·삭제하거나 이용을
          제한할 수 있습니다.
        </p>
        <p className="text-on-surface-variant">
          이용자가 작성한 리뷰는 작성 시 설정한 비밀번호로 직접 삭제할 수
          있으며, 장소·이벤트 제보 정보의 수정·삭제는 문의 채널을 통해 요청할 수 있습니다.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          5. 게시물의 이용 권한
        </h3>
        <p className="text-on-surface-variant">
          이용자가 서비스에 제보·작성한 장소·이벤트 정보 및 리뷰는, 서비스
          운영·홍보·데이터베이스 구축을 위해 비독점적·무상으로 이용·복제·수정·배포될
          수 있습니다. 이용자는 자신이 작성·제보한 정보에 대해 제3자의 권리를
          침해하지 않음을 보증합니다.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          6. 정보의 정확성 및 면책
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant">
          <li>
            서비스가 제공하는 장소·이벤트 정보(영업시간·휴무일·주소·브랜드
            취급 여부 등)는 이용자의 제보 및 공개 자료를 기반으로 수집되며,
            실제와 다를 수 있습니다. 방문 전 반드시 해당 장소에 직접 확인하시기
            바랍니다.
          </li>
          <li>
            서비스는 정보의 정확성·최신성을 보장하지 않으며, 정보 이용으로 인한
            손해에 대해 관련 법령이 허용하는 범위에서 책임을 지지 않습니다.
          </li>
          <li>
            이용자가 작성한 리뷰의 내용에 대한 책임은 작성한 이용자 본인에게
            있습니다.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          7. 서비스 중단 및 변경
        </h3>
        <p className="text-on-surface-variant">
          서비스는 시스템 점검, 장애, 불가항력 등의 사유로 일시 중단될 수
          있으며, 서비스 개편·정책 변경에 따라 일부 또는 전부가 변경·종료될 수
          있습니다. 중요한 변경 사항은 서비스 내 공지 또는 본 페이지를 통해
          사전 안내합니다.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          8. 약관의 변경
        </h3>
        <p className="text-on-surface-variant">
          본 약관은 관련 법령·서비스 정책의 변경 등의 사유로 개정될 수 있으며,
          개정된 약관은 본 페이지에 게시함으로써 효력이 발생합니다. 개정 후에도
          서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">
          9. 준거법 및 분쟁 해결
        </h3>
        <p className="text-on-surface-variant">
          본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련한 분쟁은
          민사소송법상 관할 법원에서 해결합니다.
        </p>
      </section>

      <p className="text-label-xs text-outline pt-2">
        최종 업데이트: 2026년 4월 20일
      </p>
    </div>
  );
}
