// BE CategoryInfo.name 기반 매핑 (한국어 키)
export const CATEGORY_LABEL: Record<string, string> = {
  '뜨개샵': '뜨개샵',
  '공방': '공방',
  '뜨개카페': '뜨개카페',
  '손염색실': '손염색실',
  '공예용품점': '공예용품점',
}

export const CATEGORY_COLOR: Record<string, string> = {
  '뜨개샵': '#91472b',
  '공방': '#53624f',
  '뜨개카페': '#68594a',
  '손염색실': '#6b5b73',
  '공예용품점': '#7a6840',
}

export const CATEGORY_BG: Record<string, string> = {
  '뜨개샵': '#ffdbcf',
  '공방': '#d4e5cc',
  '뜨개카페': '#f4dfcb',
  '손염색실': '#e8dced',
  '공예용품점': '#e8dfcc',
}

// BE status 매핑
export const STATUS_LABEL: Record<string, string> = {
  OPEN: '운영중',
  RELOCATED: '이전',
  CLOSED: '폐업',
  UNVERIFIED: '확인필요',
}

export const STATUS_COLOR: Record<string, string> = {
  OPEN: '#53624f',
  RELOCATED: '#af5f41',
  CLOSED: '#ba1a1a',
  UNVERIFIED: '#87736c',
}

export const REGION_ORDER = ['서울', '경기', '인천', '강원', '충청', '경상', '전라', '제주']

export const REGION_CENTER: Record<string, { lat: number; lng: number; zoom: number }> = {
  '서울': { lat: 37.5665, lng: 126.978, zoom: 11 },
  '경기': { lat: 37.27, lng: 127.0, zoom: 9 },
  '인천': { lat: 37.4563, lng: 126.7052, zoom: 11 },
  '강원': { lat: 37.8228, lng: 128.1555, zoom: 9 },
  '충청': { lat: 36.6357, lng: 127.0, zoom: 9 },
  '경상': { lat: 35.8714, lng: 128.6014, zoom: 9 },
  '전라': { lat: 35.1595, lng: 126.8526, zoom: 9 },
  '제주': { lat: 33.4996, lng: 126.5312, zoom: 10 },
}
