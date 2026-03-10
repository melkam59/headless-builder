import { NextResponse } from 'next/server'
import { db } from '@/db'
import { themes, pages } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { extractDefaults, mergeSections, isGlobalSection } from '@/lib/theme-utils'
import type { StoredSectionsData, SchemaSection } from '@/lib/types'
import { schema } from '@/lib/sections'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pageHandle = searchParams.get('page') || 'index'

    const [theme] = await db
      .select()
      .from(themes)
      .where(eq(themes.isActive, true))
      .orderBy(desc(themes.updatedAt))
      .limit(1)

    if (!theme) return NextResponse.json({ theme: null }, { status: 200 })

    const [page] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.themeId, theme.id), eq(pages.handle, pageHandle)))
      .limit(1)

    const globalStored = theme.globalSections as StoredSectionsData
    const pageStored = (page?.sections || { sections: {}, order: [] }) as StoredSectionsData

    const globalSchema = schema.filter((s) => isGlobalSection(s.type))
    const pageSchema = schema.filter((s) => !isGlobalSection(s.type))

    const globalMerged = mergeSections(globalSchema, globalStored)
    const pageMerged = mergeSections(pageSchema, pageStored)
    const topGlobals = globalMerged.filter((s) => s.type !== 'footer')
    const bottomGlobals = globalMerged.filter((s) => s.type === 'footer')

    return NextResponse.json({
      theme: { id: theme.id, name: theme.name, preset: theme.preset, settings: theme.settings },
      page: page ? { id: page.id, handle: page.handle, title: page.title } : null,
      globalSections: globalStored,
      pageSections: pageStored,
      mergedSections: [...topGlobals, ...pageMerged, ...bottomGlobals],
    })
  } catch (error) {
    console.error('GET /api/themes error:', error)
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { themeId, globalSections, pageSections, pageHandle = 'index', themeSettings } = body
    let savedThemeId: number

    if (themeId) {
      const updateData: Record<string, any> = { updatedAt: new Date() }
      if (globalSections) updateData.globalSections = globalSections
      if (themeSettings) updateData.settings = themeSettings
      await db.update(themes).set(updateData).where(eq(themes.id, themeId))
      savedThemeId = themeId
    } else {
      const defaults = extractDefaults(schema)
      await db.update(themes).set({ isActive: false }).where(eq(themes.isActive, true))

      const [newTheme] = await db
        .insert(themes)
        .values({
          name: 'Default Theme',
          preset: 'horizon',
          globalSections: globalSections || defaults.globalSections,
          settings: themeSettings || {},
          isActive: true,
        })
        .returning()
      savedThemeId = newTheme.id

      await db.insert(pages).values({
        themeId: savedThemeId,
        handle: 'index',
        title: 'Home',
        sections: pageSections || defaults.pageSections,
      })
    }

    if (pageSections && themeId) {
      const [existingPage] = await db
        .select()
        .from(pages)
        .where(and(eq(pages.themeId, savedThemeId), eq(pages.handle, pageHandle)))
        .limit(1)

      if (existingPage) {
        await db
          .update(pages)
          .set({ sections: pageSections, updatedAt: new Date() })
          .where(eq(pages.id, existingPage.id))
      } else {
        await db.insert(pages).values({
          themeId: savedThemeId,
          handle: pageHandle,
          title: pageHandle.charAt(0).toUpperCase() + pageHandle.slice(1),
          sections: pageSections,
        })
      }
    }

    const [result] = await db.select().from(themes).where(eq(themes.id, savedThemeId)).limit(1)
    return NextResponse.json(result, { status: themeId ? 200 : 201 })
  } catch (error) {
    console.error('POST /api/themes error:', error)
    return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 })
  }
}
