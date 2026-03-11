'use client'

import { MousePointer2, Plus, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
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
  onAddBlock?: (blockType: string) => void
  onRemoveBlock?: (blockId: string) => void
  onRemoveSection?: () => void
}

const formatLabel = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^_/, '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()).trim()

export default function SettingsPanel({
  sectionId,
  sectionSchema,
  storedValues,
  storedBlocks,
  blockOrder,
  onFieldChange,
  onBlockFieldChange,
  onAddBlock,
  onRemoveBlock,
  onRemoveSection,
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

  /** Block types allowed in this section */
  const allowedBlockTypes = sectionSchema.blocks ?? []

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-zinc-900">{formatLabel(sectionSchema.type)}</h2>
      <Separator />

      {/* Section-level settings */}
      {Object.entries(sectionSchema.settings).map(([key, field]) => (
        <FieldRenderer
          key={key}
          field={field as SchemaSettingField}
          value={storedValues[key] ?? (field as SchemaSettingField).defaultValue}
          onChange={(v) => onFieldChange(key, v)}
        />
      ))}

      {/* ── Blocks ── */}
      {allowedBlockTypes.length > 0 && (
        <>
          <Separator />

          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              {sectionSchema.type === 'header' ? 'Menu Items' : 'Content Blocks'}
            </h3>
          </div>

          {/* Existing blocks */}
          {blockOrder && storedBlocks && blockOrder.length > 0 && (
            <div className="space-y-2">
              {blockOrder.map((blockId) => {
                const block = storedBlocks[blockId]
                if (!block) return null
                const blockSchema = allowedBlockTypes.find((b) => b.type === block.type)
                if (!blockSchema) return null

                const labelField = block.settings?.label
                const displayLabel =
                  typeof labelField === 'string'
                    ? labelField
                    : (labelField?.value ?? labelField?.defaultValue ?? formatLabel(block.type))

                return (
                  <details key={blockId} className="group rounded-lg border border-zinc-200 overflow-hidden">
                    <summary className="flex items-center justify-between px-3 py-2.5 cursor-pointer select-none hover:bg-zinc-50 list-none">
                      <span className="text-xs font-medium text-zinc-700 truncate">
                        {displayLabel || formatLabel(block.type)}
                      </span>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        {/* Remove button */}
                        {onRemoveBlock && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              onRemoveBlock(blockId)
                            }}
                            className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {/* Chevron */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5 text-zinc-400 transition-transform group-open:rotate-180"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>

                    {/* Block settings */}
                    <div className="px-3 pb-3 pt-2 space-y-3 border-t border-zinc-100 bg-zinc-50/50">
                      {Object.entries(blockSchema.settings).map(([key, field]) => (
                        <FieldRenderer
                          key={key}
                          field={field as SchemaSettingField}
                          value={block.settings[key] ?? (field as SchemaSettingField).defaultValue}
                          onChange={(v) => onBlockFieldChange([blockId], key, v)}
                        />
                      ))}
                    </div>
                  </details>
                )
              })}
            </div>
          )}

          {/* Empty state */}
          {(!blockOrder || blockOrder.length === 0) && (
            <p className="text-xs text-zinc-400 text-center py-3">No menu items yet</p>
          )}

          {/* Add block buttons — one per unique block type */}
          {onAddBlock && (
            <div className="space-y-1.5">
              {allowedBlockTypes
                .filter((bt, idx, arr) => arr.findIndex((b) => b.type === bt.type) === idx)
                .map((bt) => (
                  <Button
                    key={bt.type}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs justify-start gap-1.5 border-dashed text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                    onClick={() => onAddBlock(bt.type)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add {formatLabel(bt.type)}
                  </Button>
                ))}
            </div>
          )}
        </>
      )}

      {/* Delete Section Button */}
      {onRemoveSection && (
        <>
          <Separator className="mt-6" />
          <Button
            variant="destructive"
            className="w-full mt-4 flex items-center justify-center gap-2"
            onClick={onRemoveSection}
          >
            <Trash2 className="w-4 h-4" /> Delete Section
          </Button>
        </>
      )}
    </div>
  )
}
