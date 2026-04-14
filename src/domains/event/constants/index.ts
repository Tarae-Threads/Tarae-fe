import type { EventType } from "../types";

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  SALE: "세일 정보",
  EVENT_POPUP: "행사 / 팝업",
  TESTER_RECRUIT: "테스터 모집",
};

export const EVENT_TYPE_COLOR: Record<EventType, string> = {
  TESTER_RECRUIT: "#91472b",
  SALE: "#53624f",
  EVENT_POPUP: "#68594a",
};

export const EVENT_TYPE_BG: Record<EventType, string> = {
  TESTER_RECRUIT: "#ffdbcf",
  SALE: "#d4e5cc",
  EVENT_POPUP: "#f4dfcb",
};

export const WEEKDAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export const STORAGE_KEYS = {
  TESTER_APPLICATIONS: "tarae_tester_applications",
} as const;
