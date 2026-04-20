/**
 * 타래 브랜드 감성의 배너 배경 (SVG).
 *
 * - 따뜻한 브라운 그라데이션 + 부드러운 실 가닥 곡선 + 실타래(공) 모티프
 * - 부모가 `aspect-*` 로 비율을 잡고, 이 SVG 는 그 안을 꽉 채움
 * - `preserveAspectRatio="xMidYMid slice"` 라 데스크톱(8:3)·모바일(5:4) 어느 비율에서도
 *   중앙 핵심 비주얼이 살아있음
 */
export default function YarnBackground() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1600 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="yarn-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a55434" />
          <stop offset="55%" stopColor="#91472b" />
          <stop offset="100%" stopColor="#6b3520" />
        </linearGradient>

        <radialGradient id="yarn-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 베이스 그라데이션 */}
      <rect width="1600" height="600" fill="url(#yarn-bg)" />

      {/* 좌상·우하 부드러운 광점 */}
      <circle cx="260" cy="120" r="260" fill="url(#yarn-glow)" />
      <circle cx="1360" cy="520" r="320" fill="url(#yarn-glow)" />

      {/* 화면 전반을 가로지르는 실 가닥 */}
      <g
        stroke="#ffffff"
        strokeLinecap="round"
        fill="none"
      >
        <path
          d="M -80 160 Q 280 60 640 220 T 1700 180"
          strokeWidth="3"
          strokeOpacity="0.14"
        />
        <path
          d="M -80 300 Q 360 440 820 260 T 1700 340"
          strokeWidth="2"
          strokeOpacity="0.1"
        />
        <path
          d="M -80 460 Q 340 360 780 520 T 1700 420"
          strokeWidth="4"
          strokeOpacity="0.11"
        />
        <path
          d="M 120 -40 Q 240 200 160 420 T 220 660"
          strokeWidth="2"
          strokeOpacity="0.08"
        />
        <path
          d="M 1480 -40 Q 1340 260 1500 480 T 1480 660"
          strokeWidth="3"
          strokeOpacity="0.09"
        />
      </g>

      {/* 실타래 ① — 좌상단 작은 것 */}
      <g transform="translate(310, 170)">
        <circle r="62" fill="#ffffff" fillOpacity="0.08" />
        <circle r="62" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" />
        <g fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.2">
          <ellipse rx="52" ry="18" />
          <ellipse rx="52" ry="18" transform="rotate(30)" />
          <ellipse rx="52" ry="18" transform="rotate(60)" />
          <ellipse rx="52" ry="18" transform="rotate(90)" />
          <ellipse rx="52" ry="18" transform="rotate(120)" />
          <ellipse rx="52" ry="18" transform="rotate(150)" />
        </g>
      </g>

      {/* 실타래 ② — 우하단 큰 것 (핵심 비주얼) */}
      <g transform="translate(1300, 430)">
        <circle r="140" fill="#ffffff" fillOpacity="0.1" />
        <circle r="140" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.2" />
        <g fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.4">
          <ellipse rx="118" ry="36" />
          <ellipse rx="118" ry="36" transform="rotate(20)" />
          <ellipse rx="118" ry="36" transform="rotate(40)" />
          <ellipse rx="118" ry="36" transform="rotate(60)" />
          <ellipse rx="118" ry="36" transform="rotate(80)" />
          <ellipse rx="118" ry="36" transform="rotate(100)" />
          <ellipse rx="118" ry="36" transform="rotate(120)" />
          <ellipse rx="118" ry="36" transform="rotate(140)" />
          <ellipse rx="118" ry="36" transform="rotate(160)" />
        </g>

        {/* 실 끝 한 가닥이 타래에서 빠져나오는 디테일 */}
        <path
          d="M -130 10 Q -260 60 -380 -20 T -620 30"
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* 작은 포인트 구슬 */}
      <circle cx="840" cy="520" r="28" fill="#ffffff" fillOpacity="0.08" />
      <circle cx="840" cy="520" r="28" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1" />
    </svg>
  )
}
