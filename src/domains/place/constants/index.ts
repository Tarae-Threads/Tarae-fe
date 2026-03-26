import type { PlaceCategory } from '../types'

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  yarn_store: '실 가게',
  studio: '공방',
  cafe: '뜨개카페',
  popup: '팝업',
}

export const CATEGORY_COLOR: Record<PlaceCategory, string> = {
  yarn_store: '#91472b',
  studio: '#53624f',
  cafe: '#68594a',
  popup: '#af5f41',
}

export const CATEGORY_BG: Record<PlaceCategory, string> = {
  yarn_store: '#ffdbcf',
  studio: '#d4e5cc',
  cafe: '#f4dfcb',
  popup: '#ffdbcf',
}

export const REGION_ORDER = ['서울', '경기', '인천', '강원', '충청', '경상', '전라', '제주']
