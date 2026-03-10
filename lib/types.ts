export interface SchemaSettingField {
  type: string
  id: string
  label: string
  defaultValue: any
  options?: string[]
}

export interface SchemaBlock {
  type: string
  settings: Record<string, SchemaSettingField>
  blocks?: SchemaBlock[]
}

export interface SchemaSection {
  type: string
  settings: Record<string, SchemaSettingField>
  blocks?: SchemaBlock[]
}

export interface StoredBlockValues {
  type: string
  settings: Record<string, any>
  blocks?: Record<string, StoredBlockValues>
  block_order?: string[]
}

export interface StoredSectionValues {
  type: string
  settings: Record<string, any>
  blocks?: Record<string, StoredBlockValues>
  block_order?: string[]
}

export interface StoredSectionsData {
  sections: Record<string, StoredSectionValues>
  order: string[]
}

export interface ThemeRow {
  id: number
  name: string
  preset: string
  globalSections: StoredSectionsData
  settings: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PageRow {
  id: number
  themeId: number
  handle: string
  title: string
  sections: StoredSectionsData
  createdAt: Date
  updatedAt: Date
}
