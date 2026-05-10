export interface CategoryRouteMeta {
  slug: string
  category: string
  emoji: string
  bg: string
  color: string
  intro: string
}

export const CATEGORY_ROUTES: CategoryRouteMeta[] = [
  {
    slug: 'knitting-shop',
    category: '뜨개샵',
    emoji: '🧶',
    bg: '#ffdbcf',
    color: '#91472b',
    intro:
      '실·바늘·도구를 한자리에서 살 수 있는 전국 뜨개샵을 지역별로 모았어요. 영업 시간과 취급 브랜드까지 한 번에 확인하세요.',
  },
  {
    slug: 'knitting-cafe',
    category: '뜨개카페',
    emoji: '☕',
    bg: '#f4dfcb',
    color: '#68594a',
    intro:
      '커피 한 잔과 함께 뜨개를 즐길 수 있는 뜨개카페 정보를 모았어요. 모임·클래스를 운영하는 곳도 함께 찾아보세요.',
  },
  {
    slug: 'knitting-workshop',
    category: '공방',
    emoji: '🪡',
    bg: '#d4e5cc',
    color: '#53624f',
    intro:
      '클래스·원데이 클래스·정기 모임을 운영하는 뜨개 공방을 한 곳에서 확인하세요. 처음 배우는 사람부터 숙련자까지.',
  },
  {
    slug: 'knitting-yarn',
    category: '손염색실',
    emoji: '🎨',
    bg: '#e8dced',
    color: '#6b5b73',
    intro:
      '국내 손염색실 작가와 브랜드를 만나볼 수 있는 곳을 모았어요. 시즌 한정·테스터 모집 정보도 함께 살펴보세요.',
  },
  {
    slug: 'knitting-supplies',
    category: '공예용품점',
    emoji: '✂️',
    bg: '#e8dfcc',
    color: '#7a6840',
    intro:
      '뜨개 외에도 다양한 공예 도구와 원사·부자재를 취급하는 공예용품점을 한자리에 모았어요.',
  },
]

export const CATEGORY_BY_SLUG: Record<string, CategoryRouteMeta> = Object.fromEntries(
  CATEGORY_ROUTES.map((c) => [c.slug, c]),
)

export const SITE_URL = 'https://www.taraethreads.com'
