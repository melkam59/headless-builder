'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SchemaSettingField } from '@/lib/types'

interface FieldRendererProps {
  field: SchemaSettingField
  value: any
  onChange: (v: any) => void
}

function MenuSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [menus, setMenus] = useState<{ handle: string; title: string }[]>([])

  useEffect(() => {
    fetch('/api/menus')
      .then((r) => r.json())
      .then((data) => setMenus(Array.isArray(data) ? data : []))
      .catch(() => setMenus([]))
  }, [])

  return (
    <Select value={value || ''} onValueChange={onChange}>
      <SelectTrigger className="text-sm">
        <SelectValue placeholder="Select a menu" />
      </SelectTrigger>
      <SelectContent>
        {menus.map((m) => (
          <SelectItem key={m.handle} value={m.handle}>
            {m.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-800">{field.label}</Label>
          <Input
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.type === 'url' ? 'https://...' : ''}
            className="text-sm"
          />
        </div>
      )

    case 'number':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-800">{field.label}</Label>
          <Input
            type="number"
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="text-sm"
          />
        </div>
      )

    case 'checkbox':
      return (
        <div className="flex items-center justify-between gap-4">
          <Label className="text-sm font-medium text-zinc-800">{field.label}</Label>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      )

    case 'color':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-800">{field.label}</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value ?? '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 rounded border border-zinc-200 cursor-pointer"
            />
            <Input
              value={value ?? '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="text-sm flex-1"
            />
          </div>
        </div>
      )

    case 'select':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-800">{field.label}</Label>
          <Select value={String(value)} onValueChange={onChange}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt.replace(/[-_]/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )

    case 'image':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-800">{field.label}</Label>
          <Input
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="text-sm"
          />
          {value && (
            <div className="mt-2 rounded-md border border-zinc-200 overflow-hidden">
              <img src={value} alt={field.label} className="w-full h-24 object-cover" />
            </div>
          )}
        </div>
      )

    case 'menu':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-800">{field.label}</Label>
          <MenuSelect value={value ?? ''} onChange={onChange} />
        </div>
      )

    default:
      return null
  }
}
