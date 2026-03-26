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
