export type PlaceCategory = 'yarn_store' | 'studio' | 'cafe' | 'popup'

export interface Place {
  id: string
  name: string
  category: PlaceCategory
  region: string
  district: string
  address: string
  lat: number
  lng: number
  hours: string
  closedDays: string[]
  note: string
  tags: string[]
  brands: string[]
  links: {
    instagram?: string
    website?: string
    naver_map?: string
  }
  images: string[]
  updatedAt: string
}

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
