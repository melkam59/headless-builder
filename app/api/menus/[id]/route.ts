import { NextResponse } from 'next/server'
import { db } from '@/db'
import { menus, menuItems } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const menuId = parseInt(id, 10)
    const [menu] = await db.select().from(menus).where(eq(menus.id, menuId)).limit(1)
    if (!menu) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const items = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.menuId, menuId))
      .orderBy(asc(menuItems.position))

    const topLevel = items.filter((i) => !i.parentId)
    const nested = topLevel.map((item) => ({
      ...item,
      children: items.filter((c) => c.parentId === item.id),
    }))

    return NextResponse.json({ ...menu, items: nested })
  } catch (error) {
    console.error('GET /api/menus/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const menuId = parseInt(id, 10)
    const { title, handle, items } = await request.json()

    const updateData: Record<string, any> = { updatedAt: new Date() }
    if (title) updateData.title = title
    if (handle) updateData.handle = handle

    await db.update(menus).set(updateData).where(eq(menus.id, menuId))

    if (items) {
      await db.delete(menuItems).where(eq(menuItems.menuId, menuId))
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

    const [updated] = await db.select().from(menus).where(eq(menus.id, menuId)).limit(1)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/menus/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const menuId = parseInt(id, 10)
    await db.delete(menus).where(eq(menus.id, menuId))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/menus/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 })
  }
}
