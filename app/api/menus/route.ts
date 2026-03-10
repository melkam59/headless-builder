import { NextResponse } from 'next/server'
import { db } from '@/db'
import { menus, menuItems } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const handle = searchParams.get('handle')

    let menuQuery = db.select().from(menus).orderBy(asc(menus.title))
    const allMenus = handle
      ? await db.select().from(menus).where(eq(menus.handle, handle))
      : await menuQuery

    const result = await Promise.all(
      allMenus.map(async (menu) => {
        const items = await db
          .select()
          .from(menuItems)
          .where(eq(menuItems.menuId, menu.id))
          .orderBy(asc(menuItems.position))

        const topLevel = items.filter((i) => !i.parentId)
        const nested = topLevel.map((item) => ({
          ...item,
          children: items.filter((c) => c.parentId === item.id),
        }))

        return { ...menu, items: nested }
      }),
    )

    if (handle) {
      return NextResponse.json(result[0] || null)
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/menus error:', error)
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, handle, items } = await request.json()

    const slug = handle || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const [menu] = await db
      .insert(menus)
      .values({ title, handle: slug })
      .returning()

    if (items && items.length > 0) {
      await insertMenuItems(menu.id, items)
    }

    return NextResponse.json(menu, { status: 201 })
  } catch (error) {
    console.error('POST /api/menus error:', error)
    return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 })
  }
}

async function insertMenuItems(
  menuId: number,
  items: { label: string; url: string; children?: { label: string; url: string }[] }[],
) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const [parent] = await db
      .insert(menuItems)
      .values({ menuId, label: item.label, url: item.url, position: i })
      .returning()

    if (item.children) {
      for (let j = 0; j < item.children.length; j++) {
        const child = item.children[j]
        await db.insert(menuItems).values({
          menuId,
          label: child.label,
          url: child.url,
          position: j,
          parentId: parent.id,
        })
      }
    }
  }
}
