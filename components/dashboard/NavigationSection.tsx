'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus, Trash2, ChevronDown, ChevronRight, GripVertical, ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuItem {
  id?: number
  label: string
  url: string
  children?: MenuItem[]
}

interface Menu {
  id: number
  handle: string
  title: string
  items: MenuItem[]
}

export default function NavigationSection() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchMenus = async () => {
    try {
      const res = await fetch('/api/menus')
      const data = await res.json()
      setMenus(data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchMenus() }, [])

  const createMenu = async () => {
    if (!newTitle.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, items: [] }),
      })
      if (res.ok) {
        setNewTitle('')
        setIsCreating(false)
        await fetchMenus()
      }
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const deleteMenu = async (id: number) => {
    try {
      await fetch(`/api/menus/${id}`, { method: 'DELETE' })
      if (selectedMenuId === id) setSelectedMenuId(null)
      await fetchMenus()
    } catch (e) { console.error(e) }
  }

  const selectedMenu = menus.find((m) => m.id === selectedMenuId) || null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Navigation</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your store menus</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
          size="sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add menu
        </Button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
          <Label className="text-sm font-medium">Menu title</Label>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Main menu, Footer menu"
            onKeyDown={(e) => e.key === 'Enter' && createMenu()}
          />
          <div className="flex gap-2">
            <Button onClick={createMenu} disabled={saving} size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
              {saving ? 'Creating...' : 'Create'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setIsCreating(false); setNewTitle('') }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          {menus.length === 0 && !isCreating && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 text-center">
              <p className="text-sm text-zinc-400">No menus yet. Create one to get started.</p>
            </div>
          )}
          {menus.map((menu) => (
            <Button
              key={menu.id}
              variant="outline"
              onClick={() => setSelectedMenuId(menu.id)}
              className={cn(
                'w-full justify-start text-left h-auto px-4 py-3 flex-col items-start',
                selectedMenuId === menu.id
                  ? 'bg-violet-50 border-violet-200 text-violet-700'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700',
              )}
            >
              <p className="text-sm font-medium">{menu.title}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{menu.handle} · {menu.items.length} items</p>
            </Button>
          ))}
        </div>

        <div className="md:col-span-2">
          {selectedMenu ? (
            <MenuEditor menu={selectedMenu} onSave={fetchMenus} onDelete={() => deleteMenu(selectedMenu.id)} />
          ) : (
            <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
              <p className="text-sm text-zinc-400">Select a menu to edit its items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MenuEditor({ menu, onSave, onDelete }: { menu: Menu; onSave: () => void; onDelete: () => void }) {
  const [items, setItems] = useState<MenuItem[]>(menu.items)
  const [title, setTitle] = useState(menu.title)
  const [saving, setSaving] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    setItems(menu.items)
    setTitle(menu.title)
  }, [menu.id, menu.items, menu.title])

  const save = async () => {
    setSaving(true)
    try {
      await fetch(`/api/menus/${menu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, items }),
      })
      onSave()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const addItem = () => setItems([...items, { label: '', url: '#', children: [] }])

  const updateItem = (index: number, updates: Partial<MenuItem>) => {
    setItems(items.map((item, i) => (i === index ? { ...item, ...updates } : item)))
  }

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index))

  const addSubItem = (parentIndex: number) => {
    setItems(items.map((item, i) =>
      i === parentIndex
        ? { ...item, children: [...(item.children || []), { label: '', url: '#' }] }
        : item,
    ))
  }

  const updateSubItem = (parentIndex: number, childIndex: number, updates: Partial<MenuItem>) => {
    setItems(items.map((item, i) =>
      i === parentIndex
        ? { ...item, children: (item.children || []).map((c, j) => (j === childIndex ? { ...c, ...updates } : c)) }
        : item,
    ))
  }

  const removeSubItem = (parentIndex: number, childIndex: number) => {
    setItems(items.map((item, i) =>
      i === parentIndex
        ? { ...item, children: (item.children || []).filter((_, j) => j !== childIndex) }
        : item,
    ))
  }

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="p-4 border-b border-zinc-100 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Menu title</Label>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-700 h-auto p-0 text-xs">
            Delete menu
          </Button>
        </div>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Menu items</p>
          <Button onClick={addItem} variant="outline" size="sm" className="gap-1 h-7 text-xs">
            <Plus className="w-3 h-3" /> Add item
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-zinc-400 text-center py-4">No items yet. Add one above.</p>
        )}

        {items.map((item, index) => (
          <div key={index} className="border border-zinc-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 p-2.5 bg-zinc-50">
              <GripVertical className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
              <Button variant="ghost" size="icon" onClick={() => toggleExpand(index)} className="h-5 w-5 shrink-0">
                {expandedItems.has(index)
                  ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
              </Button>
              <Input
                value={item.label}
                onChange={(e) => updateItem(index, { label: e.target.value })}
                placeholder="Label"
                className="h-7 text-sm flex-1"
              />
              <Input
                value={item.url}
                onChange={(e) => updateItem(index, { url: e.target.value })}
                placeholder="/link"
                className="h-7 text-sm flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="h-5 w-5 text-zinc-400 hover:text-red-500 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            {expandedItems.has(index) && (
              <div className="p-2.5 pl-10 space-y-2 border-t border-zinc-100 bg-white">
                {(item.children || []).map((child, childIndex) => (
                  <div key={childIndex} className="flex items-center gap-2">
                    <ExternalLink className="w-3 h-3 text-zinc-300 shrink-0" />
                    <Input
                      value={child.label}
                      onChange={(e) => updateSubItem(index, childIndex, { label: e.target.value })}
                      placeholder="Sub-label"
                      className="h-7 text-sm flex-1"
                    />
                    <Input
                      value={child.url}
                      onChange={(e) => updateSubItem(index, childIndex, { url: e.target.value })}
                      placeholder="/link"
                      className="h-7 text-sm flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeSubItem(index, childIndex)} className="h-5 w-5 text-zinc-400 hover:text-red-500 shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addSubItem(index)}
                  className="gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium h-auto p-0"
                >
                  <Plus className="w-3 h-3" /> Add sub-item
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-100 flex justify-end">
        <Button onClick={save} disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white" size="sm">
          {saving ? 'Saving...' : 'Save menu'}
        </Button>
      </div>
    </div>
  )
}
