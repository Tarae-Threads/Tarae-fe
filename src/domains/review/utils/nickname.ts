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
