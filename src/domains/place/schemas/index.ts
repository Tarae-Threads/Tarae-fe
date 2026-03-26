import { z } from 'zod'

const placeCategorySchema = z.enum(['yarn_store', 'studio', 'cafe', 'popup'])

export const placeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: placeCategorySchema,
  region: z.string().min(1),
  district: z.string(),
  address: z.string().min(1),
  lat: z.number().min(33).max(39),
  lng: z.number().min(124).max(132),
  hours: z.string(),
  closedDays: z.array(z.string()),
  note: z.string(),
  tags: z.array(z.string()),
  brands: z.array(z.string()),
  links: z.object({
    instagram: z.string().optional(),
    website: z.string().optional(),
    naver_map: z.string().optional(),
  }),
  images: z.array(z.string()),
  updatedAt: z.string(),
})

export const placesArraySchema = z.array(placeSchema)
