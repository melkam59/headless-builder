import { notFound } from 'next/navigation'
import AnnouncementBar from '@/components/sections/AnnouncementBar'
import Header from '@/components/sections/Header'
import Hero from '@/components/sections/Hero'
import CollectionList from '@/components/sections/CollectionList'
import ProductGrid from '@/components/sections/ProductGrid'
import ImageWithText from '@/components/sections/ImageWithText'
import Testimonials from '@/components/sections/Testimonials'
import Newsletter from '@/components/sections/Newsletter'
import Footer from '@/components/sections/Footer'
import { db } from '@/db'
import { themes, pages } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { mergeSections, isGlobalSection } from '@/lib/theme-utils'
import type { StoredSectionsData } from '@/lib/types'
import { schema } from '@/lib/sections'

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  announcementBar: AnnouncementBar,
  header: Header,
  hero: Hero,
  collectionList: CollectionList,
  productGrid: ProductGrid,
  imageWithText: ImageWithText,
  testimonials: Testimonials,
  newsletter: Newsletter,
  footer: Footer,
}

interface Props {
  params: Promise<{ handle: string }>
}

export default async function PublicPage({ params }: Props) {
  const { handle } = await params

  // Fetch the active theme
  const [theme] = await db
    .select()
    .from(themes)
    .where(eq(themes.isActive, true))
    .orderBy(desc(themes.updatedAt))
    .limit(1)

  if (!theme) notFound()

  // Fetch the requested page
  const [page] = await db
    .select()
    .from(pages)
    .where(and(eq(pages.themeId, theme.id), eq(pages.handle, handle)))
    .limit(1)

  if (!page) notFound()

  const globalStored = theme.globalSections as StoredSectionsData
  const pageStored = page.sections as StoredSectionsData

  const globalSchema = schema.filter((s) => isGlobalSection(s.type))
  const pageSchema = schema.filter((s) => !isGlobalSection(s.type))

  const globalMerged = mergeSections(globalSchema, globalStored)
  const pageMerged = mergeSections(pageSchema, pageStored)

  const topGlobals = globalMerged.filter((s) => s.type !== 'footer')
  const bottomGlobals = globalMerged.filter((s) => s.type === 'footer')
  const allSections = [...topGlobals, ...pageMerged, ...bottomGlobals]

  return (
    <main className="min-h-screen">
      <title>{page.title}</title>
      {allSections.map((section, index) => {
        const Component = COMPONENT_MAP[section.type]
        if (!Component) return null
        return (
          <Component
            key={`${section.type}-${index}`}
            settings={section.settings}
            blocks={section.blocks}
          />
        )
      })}
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { handle } = await params
  const [theme] = await db
    .select()
    .from(themes)
    .where(eq(themes.isActive, true))
    .limit(1)

  if (!theme) return {}

  const [page] = await db
    .select({ title: pages.title })
    .from(pages)
    .where(and(eq(pages.themeId, theme.id), eq(pages.handle, handle)))
    .limit(1)

  return {
    title: page?.title ?? handle,
  }
}
