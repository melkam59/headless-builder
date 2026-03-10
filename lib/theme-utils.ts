import type {
  SchemaSection,
  SchemaBlock,
  SchemaSettingField,
  StoredSectionsData,
  StoredSectionValues,
  StoredBlockValues,
} from './types'

const GLOBAL_SECTION_TYPES = new Set(['header', 'footer', 'announcementBar'])

export function isGlobalSection(type: string): boolean {
  return GLOBAL_SECTION_TYPES.has(type)
}

function extractSettingDefaults(
  settings: Record<string, SchemaSettingField>,
): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, field] of Object.entries(settings)) {
    result[key] = field.defaultValue
  }
  return result
}

function extractBlockDefaults(
  schemaBlocks: SchemaBlock[],
): { blocks: Record<string, StoredBlockValues>; block_order: string[] } {
  const blocks: Record<string, StoredBlockValues> = {}
  const block_order: string[] = []

  schemaBlocks.forEach((block, i) => {
    const instanceId = `${block.type}-${i + 1}`
    const stored: StoredBlockValues = {
      type: block.type,
      settings: extractSettingDefaults(block.settings),
    }
    if (block.blocks && block.blocks.length > 0) {
      const nested = extractBlockDefaults(block.blocks)
      stored.blocks = nested.blocks
      stored.block_order = nested.block_order
    }
    blocks[instanceId] = stored
    block_order.push(instanceId)
  })

  return { blocks, block_order }
}

export function extractDefaults(schema: SchemaSection[]): {
  globalSections: StoredSectionsData
  pageSections: StoredSectionsData
} {
  const global: StoredSectionsData = { sections: {}, order: [] }
  const page: StoredSectionsData = { sections: {}, order: [] }

  schema.forEach((section, i) => {
    const instanceId = `${section.type}-${i + 1}`
    const stored: StoredSectionValues = {
      type: section.type,
      settings: extractSettingDefaults(section.settings),
    }
    if (section.blocks && section.blocks.length > 0) {
      const nested = extractBlockDefaults(section.blocks)
      stored.blocks = nested.blocks
      stored.block_order = nested.block_order
    }

    const target = isGlobalSection(section.type) ? global : page
    target.sections[instanceId] = stored
    target.order.push(instanceId)
  })

  return { globalSections: global, pageSections: page }
}

function mergeSettings(
  schemaSettings: Record<string, SchemaSettingField>,
  storedSettings: Record<string, any>,
): Record<string, SchemaSettingField> {
  const merged: Record<string, SchemaSettingField> = {}
  for (const [key, field] of Object.entries(schemaSettings)) {
    merged[key] = {
      ...field,
      defaultValue: storedSettings[key] !== undefined ? storedSettings[key] : field.defaultValue,
    }
  }
  return merged
}

function mergeBlocks(
  schemaBlocks: SchemaBlock[],
  storedBlocks: Record<string, StoredBlockValues> | undefined,
  blockOrder: string[] | undefined,
): SchemaBlock[] {
  if (!storedBlocks || !blockOrder) return schemaBlocks

  return blockOrder
    .map((instanceId) => {
      const stored = storedBlocks[instanceId]
      if (!stored) return null

      const schemaDef = schemaBlocks.find((b) => b.type === stored.type)
      if (!schemaDef) return null

      const merged: SchemaBlock = {
        type: stored.type,
        settings: mergeSettings(schemaDef.settings, stored.settings),
      }
      if (schemaDef.blocks && stored.blocks) {
        merged.blocks = mergeBlocks(schemaDef.blocks, stored.blocks, stored.block_order)
      }
      return merged
    })
    .filter(Boolean) as SchemaBlock[]
}

export function mergeSections(
  schema: SchemaSection[],
  stored: StoredSectionsData,
): SchemaSection[] {
  return stored.order
    .map((instanceId) => {
      const storedSection = stored.sections[instanceId]
      if (!storedSection) return null

      const schemaDef = schema.find((s) => s.type === storedSection.type)
      if (!schemaDef) return null

      const merged: SchemaSection = {
        type: storedSection.type,
        settings: mergeSettings(schemaDef.settings, storedSection.settings),
      }
      if (schemaDef.blocks && storedSection.blocks) {
        merged.blocks = mergeBlocks(
          schemaDef.blocks,
          storedSection.blocks,
          storedSection.block_order,
        )
      }
      return merged
    })
    .filter(Boolean) as SchemaSection[]
}
