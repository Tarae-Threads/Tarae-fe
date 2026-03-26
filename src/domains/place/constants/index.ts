import type { PlaceCategory, PlaceStatus } from '../types'

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  yarn_store: '뜨개샵',
  studio: '공방',
  cafe: '뜨개카페',
  dye_shop: '손염색실',
  craft_supply: '공예용품점',
}

export const CATEGORY_COLOR: Record<PlaceCategory, string> = {
  yarn_store: '#91472b',
  studio: '#53624f',
  cafe: '#68594a',
  dye_shop: '#6b5b73',
  craft_supply: '#7a6840',
}

export const CATEGORY_BG: Record<PlaceCategory, string> = {
  yarn_store: '#ffdbcf',
  studio: '#d4e5cc',
  cafe: '#f4dfcb',
  dye_shop: '#e8dced',
  craft_supply: '#e8dfcc',
}

export const STATUS_LABEL: Record<PlaceStatus, string> = {
  open: '운영중',
  relocated: '이전',
  closed: '폐업',
  unverified: '확인필요',
}

export const STATUS_COLOR: Record<PlaceStatus, string> = {
  open: '#53624f',
  relocated: '#af5f41',
  closed: '#ba1a1a',
  unverified: '#87736c',
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
