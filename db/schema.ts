import { pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

// Core theme table — stores the full theme settings blob (Shopify-style)
export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  settings: jsonb('settings').notNull(),
  isActive: text('is_active').default('false'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Store identity — querybale store name, separate from the JSONB blob
export const storeSettings = pgTable('store_settings', {
  id: serial('id').primaryKey(),
  themeId: integer('theme_id').references(() => themes.id, { onDelete: 'cascade' }),
  storeName: text('store_name').notNull().default('My Store'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Navigation menu items — structured so they're independently queryable
export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  themeId: integer('theme_id').references(() => themes.id, { onDelete: 'cascade' }),
  itemId: text('item_id').notNull(),        // e.g. "menu-1"
  label: text('label').notNull(),
  link: text('link').notNull(),
  visible: text('visible').default('true'),
  sortOrder: integer('sort_order').default(0),
  parentId: text('parent_id'),              // null = top-level, else parent itemId
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
