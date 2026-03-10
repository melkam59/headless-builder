import announcementBar from '@/templates/sections/announcement-bar.json'
import header from '@/templates/sections/header.json'
import hero from '@/templates/sections/hero.json'
import collectionList from '@/templates/sections/collection-list.json'
import productGrid from '@/templates/sections/product-grid.json'
import imageWithText from '@/templates/sections/image-with-text.json'
import testimonials from '@/templates/sections/testimonials.json'
import newsletter from '@/templates/sections/newsletter.json'
import footer from '@/templates/sections/footer.json'
import type { SchemaSection } from '@/lib/types'

export const schema: SchemaSection[] = [
  announcementBar,
  header,
  hero,
  collectionList,
  productGrid,
  imageWithText,
  testimonials,
  newsletter,
  footer,
] as unknown as SchemaSection[]
