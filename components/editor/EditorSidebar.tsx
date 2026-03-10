'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import TreeSection from './TreeSection'
import {
  LayoutTemplate, Type,
  ChevronLeft, Zap, Home, AlignLeft,
} from 'lucide-react'
import type { StoredSectionsData } from '@/lib/types'

interface EditorSidebarProps {
  selectedItem: string | null
  setSelectedItem: (item: string | null) => void
  globalSections: StoredSectionsData
  pageSections: StoredSectionsData
  expandedSections: Record<string, boolean>
  toggleSection: (sectionId: string) => void
}

const formatLabel = (type: string) =>
  type.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase()).trim()

export default function EditorSidebar({
  selectedItem,
  setSelectedItem,
  globalSections,
  pageSections,
  expandedSections,
  toggleSection,
}: EditorSidebarProps) {
  const headerSections = globalSections.order.filter((id) => {
    const s = globalSections.sections[id]
    return s && ['announcementBar', 'header'].includes(s.type)
  })

  const footerSections = globalSections.order.filter((id) => {
    const s = globalSections.sections[id]
    return s && s.type === 'footer'
  })

  const mainSections = pageSections.order

  return (
    <aside className="w-72 shrink-0 bg-white border-r border-zinc-200 flex flex-col shadow-sm">
      <div className="px-4 py-3 border-b border-zinc-100">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors mb-3 group w-fit">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 leading-none">Customize</p>
              <p className="text-xs text-zinc-400 mt-0.5">Horizon theme</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">Live</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-3 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <Home className="w-3.5 h-3.5" /> Home page
            </div>

            <div className="mt-1 space-y-0.5">
              <TreeSection
                title="Header"
                icon={<AlignLeft className="w-3.5 h-3.5" />}
                isExpanded={!!expandedSections['header-group']}
                onToggle={() => toggleSection('header-group')}
                isSelected={false}
                onSelect={() => {}}
              >
                {headerSections.map((id) => {
                  const section = globalSections.sections[id]
                  if (!section) return null
                  return (
                    <TreeSection
                      key={id}
                      title={formatLabel(section.type)}
                      icon={<LayoutTemplate className="w-3.5 h-3.5" />}
                      isExpanded={!!expandedSections[id]}
                      onToggle={() => toggleSection(id)}
                      isSelected={selectedItem === id}
                      onSelect={() => setSelectedItem(id)}
                    />
                  )
                })}
              </TreeSection>
            </div>
          </div>

          <Separator className="my-1" />

          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              <LayoutTemplate className="w-3.5 h-3.5" /> Sections
            </div>
            <div className="space-y-0.5">
              {mainSections.map((id) => {
                const section = pageSections.sections[id]
                if (!section) return null
                return (
                  <TreeSection
                    key={id}
                    title={formatLabel(section.type)}
                    icon={<LayoutTemplate className="w-3.5 h-3.5" />}
                    isExpanded={!!expandedSections[id]}
                    onToggle={() => toggleSection(id)}
                    isSelected={selectedItem === id}
                    onSelect={() => setSelectedItem(id)}
                  />
                )
              })}
            </div>
          </div>

          <Separator className="my-1" />

          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              <Type className="w-3.5 h-3.5" /> Footer
            </div>
            {footerSections.map((id) => {
              const section = globalSections.sections[id]
              if (!section) return null
              return (
                <TreeSection
                  key={id}
                  title={formatLabel(section.type)}
                  icon={<LayoutTemplate className="w-3.5 h-3.5" />}
                  isExpanded={!!expandedSections[id]}
                  onToggle={() => toggleSection(id)}
                  isSelected={selectedItem === id}
                  onSelect={() => setSelectedItem(id)}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-zinc-100">
        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white h-9 font-medium">
          Save Changes
        </Button>
      </div>
    </aside>
  )
}
