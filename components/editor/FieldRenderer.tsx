'use client'

import { useEffect, useRef, useState } from 'react'
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

function ImageUpload({ value, label, onChange }: { value: string; label: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') onChange(result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-zinc-800">{label}</Label>

      {value ? (
        /* ── Preview with replace / remove ── */
        <div className="relative group rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50">
          <div className="flex items-center justify-center h-20 p-2">
            <img
              src={value}
              alt={label}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-2.5 py-1 rounded bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-2.5 py-1 rounded bg-red-500 text-xs font-medium text-white hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* ── Drop zone ── */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`w-full rounded-lg border-2 border-dashed transition-colors py-5 flex flex-col items-center gap-1.5 cursor-pointer
            ${isDragging
              ? 'border-violet-400 bg-violet-50'
              : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-xs text-zinc-500">
            <span className="font-medium text-violet-600">Click to upload</span> or drag & drop
          </span>
          <span className="text-[10px] text-zinc-400">PNG, JPG, SVG, WebP</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
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

    case 'textarea':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-800">{field.label}</Label>
          <textarea
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
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
            <Input
              type="color"
              value={value ?? '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-8 p-1 cursor-pointer"
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
      return <ImageUpload value={value ?? ''} label={field.label} onChange={onChange} />

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
