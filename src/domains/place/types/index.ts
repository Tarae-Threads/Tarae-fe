export type PlaceCategory =
  | "yarn_store"
  | "studio"
  | "cafe"
  | "dye_shop"
  | "craft_supply";

export type PlaceStatus = "open" | "relocated" | "closed" | "unverified";

export interface Place {
  /** 고유 식별자 */
  id: string;
  /** 장소 이름 */
  name: string;
  /** 장소 카테고리 (실가게, 공방, 카페, 염색소, 수예용품점) */
  category: PlaceCategory;
  /** 영업 상태 (영업중, 이전, 폐업, 미확인) */
  status: PlaceStatus;
  /** 지역 (시/도) */
  region: string;
  /** 세부 지역 (시/군/구) */
  district: string;
  /** 상세 주소 */
  address: string;
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
  /** 영업 시간 */
  hours: string;
  /** 휴무일 목록 */
  closedDays: string[];
  /** 비고 / 참고사항 */
  note: string;
  /** 태그 목록 */
  tags: string[];
  /** 취급 브랜드 목록 */
  brands: {
    /** 실 브랜드 */
    yarn: string[];
    /** 바늘 브랜드 */
    needle: string[];
    /** 부자재 브랜드 */
    notions: string[];
  };
  /** 외부 링크 */
  links: {
    /** 인스타그램 */
    instagram?: string;
    /** 웹사이트 */
    website?: string;
    /** 네이버 지도 */
    naver_map?: string;
  };
  /** 이미지 URL 목록 */
  images: string[];
  /** 최종 수정일 */
  updatedAt: string;
}
