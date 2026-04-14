// ── 뜨개 테마 랜덤 닉네임 생성 ──────────────────────────────
const ADJECTIVES = [
  "귀여운", "포근한", "알록달록한", "보송보송한", "동글동글한",
  "따뜻한", "솜사탕같은", "촘촘한", "느긋한", "탱글탱글한",
  "말랑말랑한", "반짝이는", "졸린", "수줍은", "부지런한",
  "몽글몽글한", "아기자기한", "꼬물꼬물한", "복슬복슬한",
  "한땀한땀", "정성스런", "새근새근", "도톰한", "폭신한",
  "나른한", "살랑살랑",
] as const;

const NOUNS = [
  "대바늘", "코바늘", "실뭉치", "털실",
   "양말",  "목도리", "장갑", "바늘꽂이", "뜨개인형", "블랭킷", "수세미",
  "비니", "가방", "조각보", "타래", "니트", "마커", "얀홀더",
  "스와치", "코잡이", "돗바늘", "단수링", "모헤어", "울실", "면사", "가위", "줄자", "꽈배기",
  "겉뜨기", "안뜨기", "사슬코", "짧은뜨기", "긴뜨기", "코막음", "게이지",
] as const;

export function generateRandomNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `${adj}${noun}#${num}`;
}

// 닉네임 해시 기반 파스텔 아바타 색 (earth-tone palette 유지)
const PALETTE = [
  { bg: "#ffdbcf", color: "#91472b" },
  { bg: "#d4e5cc", color: "#53624f" },
  { bg: "#f4dfcb", color: "#68594a" },
  { bg: "#e8dced", color: "#6b5b73" },
  { bg: "#e8dfcc", color: "#7a6840" },
];

export function nicknameToInitial(nickname: string): string {
  const trimmed = nickname.trim();
  if (!trimmed) return "?";
  return Array.from(trimmed)[0] ?? "?";
}

export function nicknameToPalette(nickname: string) {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = (hash * 31 + nickname.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "방금";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek}주 전`;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}
