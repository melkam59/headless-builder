import { pgTable, serial, text, timestamp, jsonb, boolean, integer, unique, varchar } from 'drizzle-orm/pg-core'

export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  preset: text('preset').notNull().default('horizon'),
  globalSections: jsonb('global_sections').notNull().default('{"sections":{},"order":[]}'),
  settings: jsonb('settings').notNull().default('{}'),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  themeId: integer('theme_id').references(() => themes.id, { onDelete: 'cascade' }).notNull(),
  handle: text('handle').notNull(),
  title: text('title').notNull(),
  sections: jsonb('sections').notNull().default('{"sections":{},"order":[]}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  unique('theme_handle_unique').on(table.themeId, table.handle),
])

export const menus = pgTable('menus', {
  id: serial('id').primaryKey(),
  handle: varchar('handle', { length: 100 }).notNull().unique(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  menuId: integer('menu_id').references(() => menus.id, { onDelete: 'cascade' }).notNull(),
  label: text('label').notNull(),
  url: text('url').notNull().default('#'),
  position: integer('position').notNull().default(0),
  parentId: integer('parent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
