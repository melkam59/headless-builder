import { NextResponse } from 'next/server'
import { db } from '@/db'
import { themes, pages } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

/** GET /api/pages — list all pages for the active theme */
export async function GET() {
  try {
    const [theme] = await db
      .select()
      .from(themes)
      .where(eq(themes.isActive, true))
      .orderBy(desc(themes.updatedAt))
      .limit(1)

    if (!theme) return NextResponse.json([], { status: 200 })

    const allPages = await db
      .select({
        id: pages.id,
        handle: pages.handle,
        title: pages.title,
        createdAt: pages.createdAt,
        updatedAt: pages.updatedAt,
      })
      .from(pages)
      .where(eq(pages.themeId, theme.id))
      .orderBy(desc(pages.updatedAt))

    return NextResponse.json(allPages)
  } catch (error) {
    console.error('GET /api/pages error:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

/** POST /api/pages — create a new page { title, handle } */
export async function POST(request: Request) {
  try {
    const { title, handle } = await request.json()

    if (!title || !handle) {
      return NextResponse.json({ error: 'title and handle are required' }, { status: 400 })
    }

    const [theme] = await db
      .select()
      .from(themes)
      .where(eq(themes.isActive, true))
      .orderBy(desc(themes.updatedAt))
      .limit(1)

    if (!theme) return NextResponse.json({ error: 'No active theme' }, { status: 404 })

    // Check for duplicate handle
    const [existing] = await db
      .select({ id: pages.id })
      .from(pages)
      .where(and(eq(pages.themeId, theme.id), eq(pages.handle, handle)))
      .limit(1)

    if (existing) {
      return NextResponse.json({ error: 'A page with this handle already exists' }, { status: 409 })
    }

    const [newPage] = await db
      .insert(pages)
      .values({
        themeId: theme.id,
        handle,
        title,
        sections: { sections: {}, order: [] },
      })
      .returning()

    return NextResponse.json(newPage, { status: 201 })
  } catch (error) {
    console.error('POST /api/pages error:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}

/** DELETE /api/pages?handle=about — delete a page */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const handle = searchParams.get('handle')

    if (!handle || handle === 'index') {
      return NextResponse.json({ error: 'Cannot delete this page' }, { status: 400 })
    }

    const [theme] = await db
      .select()
      .from(themes)
      .where(eq(themes.isActive, true))
      .orderBy(desc(themes.updatedAt))
      .limit(1)

    if (!theme) return NextResponse.json({ error: 'No active theme' }, { status: 404 })

    await db
      .delete(pages)
      .where(and(eq(pages.themeId, theme.id), eq(pages.handle, handle)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/pages error:', error)
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
