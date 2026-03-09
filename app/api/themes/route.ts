import { NextResponse } from 'next/server';
import { db } from '@/db';
import { themes, storeSettings, menuItems } from '@/db/schema';
import { eq, ne, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET — fetch active theme
export async function GET() {
  try {
    // Order by updatedAt desc to always get the most recently saved one
    const rows = await db
      .select()
      .from(themes)
      .where(eq(themes.isActive, 'true'))
      .orderBy(desc(themes.updatedAt))
      .limit(1);

    if (rows.length === 0) return NextResponse.json({ settings: null }, { status: 200 });
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('GET /api/themes error:', error);
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

// POST — upsert single active theme + sync structured tables
export async function POST(request: Request) {
  try {
    const { settings, themeId } = await request.json();
    let savedThemeId: number;

    if (themeId) {
      // Update the known theme
      await db
        .update(themes)
        .set({ settings, updatedAt: new Date() })
        .where(eq(themes.id, themeId));
      savedThemeId = themeId;
    } else {
      // Deactivate any existing active themes first
      await db.update(themes).set({ isActive: 'false' }).where(eq(themes.isActive, 'true'));

      // Create fresh active theme
      const [newTheme] = await db
        .insert(themes)
        .values({ name: 'Default Theme', settings, isActive: 'true' })
        .returning();
      savedThemeId = newTheme.id;
    }

    // ── Sync storeName ─────────────────────────────────────────────────────────
    const storeName = settings?.logo?.storeName;
    if (storeName !== undefined) {
      const [existing] = await db
        .select()
        .from(storeSettings)
        .where(eq(storeSettings.themeId, savedThemeId))
        .limit(1);

      if (existing) {
        await db
          .update(storeSettings)
          .set({ storeName, updatedAt: new Date() })
          .where(eq(storeSettings.themeId, savedThemeId));
      } else {
        await db.insert(storeSettings).values({ themeId: savedThemeId, storeName });
      }
    }

    // ── Sync menu items ────────────────────────────────────────────────────────
    if (Array.isArray(settings?.menu)) {
      await db.delete(menuItems).where(eq(menuItems.themeId, savedThemeId));

      const rows = settings.menu.flatMap((item: any, i: number) => [
        { themeId: savedThemeId, itemId: item.id, label: item.label, link: item.link, visible: String(item.visible ?? true), sortOrder: i, parentId: null },
        ...(item.submenu || []).map((sub: any, j: number) => ({
          themeId: savedThemeId, itemId: sub.id, label: sub.label, link: sub.link,
          visible: String(sub.visible ?? true), sortOrder: j, parentId: item.id,
        })),
      ]);

      if (rows.length > 0) await db.insert(menuItems).values(rows);
    }

    const [result] = await db.select().from(themes).where(eq(themes.id, savedThemeId)).limit(1);
    return NextResponse.json(result, { status: themeId ? 200 : 201 });
  } catch (error) {
    console.error('POST /api/themes error:', error);
    return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
  }
}
