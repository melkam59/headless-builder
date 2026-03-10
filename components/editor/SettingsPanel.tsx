'use client'

import { MousePointer2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import FieldRenderer from './FieldRenderer'
import type { SchemaSection, SchemaSettingField, StoredBlockValues } from '@/lib/types'

interface SettingsPanelProps {
  sectionId: string | null
  sectionSchema: SchemaSection | null
  storedValues: Record<string, any>
  storedBlocks?: Record<string, StoredBlockValues>
  blockOrder?: string[]
  onFieldChange: (fieldKey: string, value: any) => void
  onBlockFieldChange: (blockPath: string[], fieldKey: string, value: any) => void
}

const formatLabel = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase()).trim()

export default function SettingsPanel({
  sectionId,
  sectionSchema,
  storedValues,
  storedBlocks,
  blockOrder,
  onFieldChange,
  onBlockFieldChange,
}: SettingsPanelProps) {
  if (!sectionId || !sectionSchema) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-3">
          <MousePointer2 className="w-5 h-5 text-zinc-400" />
        </div>
        <p className="text-sm font-medium text-zinc-700">Nothing selected</p>
        <p className="text-xs text-zinc-400 mt-1">Click a section on the left to edit its settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-zinc-900">{formatLabel(sectionSchema.type)}</h2>
      <Separator />
      {Object.entries(sectionSchema.settings).map(([key, field]) => (
        <FieldRenderer
          key={key}
          field={field as SchemaSettingField}
          value={storedValues[key] ?? (field as SchemaSettingField).defaultValue}
          onChange={(v) => onFieldChange(key, v)}
        />
      ))}

      {storedBlocks && blockOrder && sectionSchema.blocks && blockOrder.length > 0 && (
        <>
          <Separator />
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Blocks</h3>
          {blockOrder.map((blockId) => {
            const block = storedBlocks[blockId]
            if (!block) return null
            const blockSchema = sectionSchema.blocks?.find((b) => b.type === block.type)
            if (!blockSchema) return null

            return (
              <div key={blockId} className="space-y-3 rounded-lg border border-zinc-200 p-3">
                <p className="text-xs font-medium text-zinc-600">{formatLabel(block.type)}</p>
                {Object.entries(blockSchema.settings).map(([key, field]) => (
                  <FieldRenderer
                    key={key}
                    field={field as SchemaSettingField}
                    value={block.settings[key] ?? (field as SchemaSettingField).defaultValue}
                    onChange={(v) => onBlockFieldChange([blockId], key, v)}
                  />
                ))}

                {block.blocks && block.block_order && blockSchema.blocks && (
                  <div className="ml-2 border-l border-zinc-100 pl-3 space-y-3">
                    {block.block_order.map((nestedId) => {
                      const nested = block.blocks![nestedId]
                      if (!nested) return null
                      const nestedSchema = blockSchema.blocks?.find((b) => b.type === nested.type)
                      if (!nestedSchema) return null

                      return (
                        <div key={nestedId} className="space-y-2 rounded-md border border-zinc-100 p-2">
                          <p className="text-xs font-medium text-zinc-500">{formatLabel(nested.type)}</p>
                          {Object.entries(nestedSchema.settings).map(([key, field]) => (
                            <FieldRenderer
                              key={key}
                              field={field as SchemaSettingField}
                              value={nested.settings[key] ?? (field as SchemaSettingField).defaultValue}
                              onChange={(v) => onBlockFieldChange([blockId, nestedId], key, v)}
                            />
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
