'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import EditorSidebar from '@/components/editor/EditorSidebar'
import SettingsPanel from '@/components/editor/SettingsPanel'
import { mergeSections, isGlobalSection, extractDefaults } from '@/lib/theme-utils'
import type { StoredSectionsData, SchemaSection } from '@/lib/types'
import { schema } from '@/lib/sections'
import { cn } from '@/lib/utils'

type DeviceView = 'desktop' | 'tablet' | 'mobile'

const deviceIcons: Record<DeviceView, React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
}

const previewWidths: Record<DeviceView, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

const emptyStored: StoredSectionsData = { sections: {}, order: [] }

export default function EditorPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop')
  const themeIdRef = useRef<number | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const [globalSections, setGlobalSections] = useState<StoredSectionsData>(emptyStored)
  const [pageSections, setPageSections] = useState<StoredSectionsData>(emptyStored)
  const [themeSettings, setThemeSettings] = useState<Record<string, any>>({})

  const globalSectionsRef = useRef(globalSections)
  const pageSectionsRef = useRef(pageSections)
  globalSectionsRef.current = globalSections
  pageSectionsRef.current = pageSections

  const toggleSection = (id: string) =>
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))

  const buildMergedSections = useCallback((g: StoredSectionsData, p: StoredSectionsData) => {
    const globalSchema = schema.filter((s) => isGlobalSection(s.type))
    const pageSchema = schema.filter((s) => !isGlobalSection(s.type))
    const globalMerged = mergeSections(globalSchema, g)
    const pageMerged = mergeSections(pageSchema, p)
    const top = globalMerged.filter((s) => s.type !== 'footer')
    const bottom = globalMerged.filter((s) => s.type === 'footer')
    return [...top, ...pageMerged, ...bottom]
  }, [])

  const sendToPreview = useCallback((g: StoredSectionsData, p: StoredSectionsData) => {
    const merged = buildMergedSections(g, p)
    const iframe = document.querySelector('iframe')
    iframe?.contentWindow?.postMessage({ type: 'FULL_UPDATE', sections: merged }, '*')
  }, [buildMergedSections])

  const saveTheme = useCallback(async (g: StoredSectionsData, p: StoredSectionsData) => {
    try {
      await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId: themeIdRef.current,
          globalSections: g,
          pageSections: p,
          pageHandle: 'index',
          themeSettings,
        }),
      })
    } catch (e) { console.error(e) }
  }, [themeSettings])

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch('/api/themes')
        const data = await res.json()

        if (data.theme) {
          themeIdRef.current = data.theme.id
          setGlobalSections(data.globalSections)
          setPageSections(data.pageSections)
          setThemeSettings(data.theme.settings || {})
          globalSectionsRef.current = data.globalSections
          pageSectionsRef.current = data.pageSections
          setTimeout(() => sendToPreview(data.globalSections, data.pageSections), 600)
        } else {
          const defaults = extractDefaults(schema)
          const createRes = await fetch('/api/themes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              globalSections: defaults.globalSections,
              pageSections: defaults.pageSections,
              pageHandle: 'index',
            }),
          })
          const created = await createRes.json()
          themeIdRef.current = created.id
          setGlobalSections(defaults.globalSections)
          setPageSections(defaults.pageSections)
          globalSectionsRef.current = defaults.globalSections
          pageSectionsRef.current = defaults.pageSections
          setTimeout(() => sendToPreview(defaults.globalSections, defaults.pageSections), 600)
        }
      } catch (e) { console.error(e) }
      finally { setIsLoading(false) }
    }
    fetchTheme()
  }, [sendToPreview])

  const updateSectionSetting = (sectionId: string, fieldKey: string, value: any) => {
    const isGlobal = globalSections.sections[sectionId] !== undefined
    const setter = isGlobal ? setGlobalSections : setPageSections

    setter((prev) => {
      const section = prev.sections[sectionId]
      if (!section) return prev
      const next: StoredSectionsData = {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionId]: {
            ...section,
            settings: { ...section.settings, [fieldKey]: value },
          },
        },
      }

      if (isGlobal) globalSectionsRef.current = next
      else pageSectionsRef.current = next

      sendToPreview(
        isGlobal ? next : globalSectionsRef.current,
        isGlobal ? pageSectionsRef.current : next,
      )

      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveTheme(globalSectionsRef.current, pageSectionsRef.current)
      }, 500)

      return next
    })
  }

  const updateBlockSetting = (
    sectionId: string,
    blockPath: string[],
    fieldKey: string,
    value: any,
  ) => {
    const isGlobal = globalSections.sections[sectionId] !== undefined
    const setter = isGlobal ? setGlobalSections : setPageSections

    setter((prev) => {
      const section = prev.sections[sectionId]
      if (!section) return prev

      const updateNestedBlock = (
        blocks: Record<string, any>,
        path: string[],
      ): Record<string, any> => {
        if (path.length === 1) {
          const blockId = path[0]
          return {
            ...blocks,
            [blockId]: {
              ...blocks[blockId],
              settings: { ...blocks[blockId].settings, [fieldKey]: value },
            },
          }
        }
        const [current, ...rest] = path
        return {
          ...blocks,
          [current]: {
            ...blocks[current],
            blocks: updateNestedBlock(blocks[current].blocks || {}, rest),
          },
        }
      }

      const next: StoredSectionsData = {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionId]: {
            ...section,
            blocks: updateNestedBlock(section.blocks || {}, blockPath),
          },
        },
      }

      if (isGlobal) globalSectionsRef.current = next
      else pageSectionsRef.current = next

      sendToPreview(
        isGlobal ? next : globalSectionsRef.current,
        isGlobal ? pageSectionsRef.current : next,
      )

      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveTheme(globalSectionsRef.current, pageSectionsRef.current)
      }, 500)

      return next
    })
  }

  const selectedSectionId = selectedItem
  const selectedStoredSection = selectedSectionId
    ? globalSections.sections[selectedSectionId] || pageSections.sections[selectedSectionId]
    : null
  const selectedSchema = selectedStoredSection
    ? schema.find((s) => s.type === selectedStoredSection.type) || null
    : null

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Loading theme…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <EditorSidebar
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        globalSections={globalSections}
        pageSections={pageSections}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 bg-white border-b border-zinc-200 flex items-center justify-center gap-1 px-4">
          {(['desktop', 'tablet', 'mobile'] as DeviceView[]).map((d) => (
            <button
              key={d}
              onClick={() => setDeviceView(d)}
              title={d}
              className={cn(
                'p-2 rounded-md transition-colors capitalize text-sm flex items-center gap-1.5',
                deviceView === d ? 'bg-violet-50 text-violet-700' : 'text-zinc-500 hover:bg-zinc-100',
              )}
            >
              {deviceIcons[d]}
            </button>
          ))}
        </div>

        <div className="flex-1 flex items-start justify-center p-6 overflow-auto bg-zinc-100">
          <div
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-zinc-200"
            style={{ width: previewWidths[deviceView], height: 'calc(100vh - 7rem)', maxWidth: '100%' }}
          >
            <iframe src="/preview" className="w-full h-full" title="Theme Preview" />
          </div>
        </div>
      </main>

      <aside className="w-72 shrink-0 bg-white border-l border-zinc-200 flex flex-col shadow-sm">
        <div className="px-4 py-3 border-b border-zinc-100">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Settings</p>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4">
            <SettingsPanel
              sectionId={selectedSectionId}
              sectionSchema={selectedSchema}
              storedValues={selectedStoredSection?.settings || {}}
              storedBlocks={selectedStoredSection?.blocks}
              blockOrder={selectedStoredSection?.block_order}
              onFieldChange={(fieldKey, value) => {
                if (selectedSectionId) updateSectionSetting(selectedSectionId, fieldKey, value)
              }}
              onBlockFieldChange={(blockPath, fieldKey, value) => {
                if (selectedSectionId) updateBlockSetting(selectedSectionId, blockPath, fieldKey, value)
              }}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}
