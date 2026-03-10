'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import AnnouncementBar from '@/components/sections/AnnouncementBar'
import Header from '@/components/sections/Header'
import Hero from '@/components/sections/Hero'
import CollectionList from '@/components/sections/CollectionList'
import ProductGrid from '@/components/sections/ProductGrid'
import ImageWithText from '@/components/sections/ImageWithText'
import Testimonials from '@/components/sections/Testimonials'
import Newsletter from '@/components/sections/Newsletter'
import Footer from '@/components/sections/Footer'
import type { SchemaSection } from '@/lib/types'
import { schema } from '@/lib/sections'

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  announcementBar: AnnouncementBar,
  header: Header,
  hero: Hero,
  collectionList: CollectionList,
  productGrid: ProductGrid,
  imageWithText: ImageWithText,
  testimonials: Testimonials,
  newsletter: Newsletter,
  footer: Footer,
}

interface MenuApiItem {
  label: string
  url: string
  children?: MenuApiItem[]
}

function menuItemsToBlocks(items: MenuApiItem[]) {
  return items.map((item) => ({
    type: 'menuItem',
    settings: {
      label: { type: 'text', id: 'label', label: 'Label', defaultValue: item.label },
      link: { type: 'url', id: 'link', label: 'Link', defaultValue: item.url },
    },
    blocks: (item.children || []).map((child) => ({
      type: 'submenuItem',
      settings: {
        label: { type: 'text', id: 'label', label: 'Label', defaultValue: child.label },
        link: { type: 'url', id: 'link', label: 'Link', defaultValue: child.url },
        image: { type: 'image', id: 'image', label: 'Image', defaultValue: '' },
      },
    })),
  }))
}

function getMenuHandle(sections: SchemaSection[]): string {
  const header = sections.find((s) => s.type === 'header')
  return header?.settings?.menu?.defaultValue || 'main-menu'
}

function injectMenuBlocks(sections: SchemaSection[], menuBlocks: any[] | null): SchemaSection[] {
  if (!menuBlocks) return sections
  return sections.map((section) => {
    if (section.type === 'header') {
      return { ...section, blocks: menuBlocks }
    }
    return section
  })
}

export default function PreviewPage() {
  const [sections, setSections] = useState<SchemaSection[]>(schema)
  const menuBlocksRef = useRef<any[] | null>(null)
  const menuHandleRef = useRef<string>('main-menu')

  const fetchMenu = useCallback(async (handle: string) => {
    try {
      // Try the specified handle first
      if (handle) {
        const res = await fetch(`/api/menus?handle=${handle}`)
        const data = await res.json()
        if (data && data.items && data.items.length > 0) {
          const blocks = menuItemsToBlocks(data.items)
          menuBlocksRef.current = blocks
          return blocks
        }
      }
      // Fall back to first available menu
      const allRes = await fetch('/api/menus')
      const allMenus = await allRes.json()
      if (Array.isArray(allMenus) && allMenus.length > 0) {
        const first = allMenus.find((m: any) => m.items && m.items.length > 0)
        if (first) {
          const blocks = menuItemsToBlocks(first.items)
          menuBlocksRef.current = blocks
          return blocks
        }
      }
    } catch (e) {
      console.error('Failed to fetch menu:', e)
    }
    menuBlocksRef.current = null
    return null
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const themeRes = await fetch('/api/themes')
        const themeData = await themeRes.json()

        const merged = themeData.mergedSections || schema
        const handle = getMenuHandle(merged)
        menuHandleRef.current = handle

        const blocks = await fetchMenu(handle)
        setSections(injectMenuBlocks(merged, blocks))
      } catch (e) {
        console.error('Preview failed to fetch:', e)
      }
    }
    fetchData()

    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'FULL_UPDATE' && event.data.sections) {
        const updated = event.data.sections as SchemaSection[]
        const newHandle = getMenuHandle(updated)

        if (newHandle !== menuHandleRef.current) {
          menuHandleRef.current = newHandle
          const blocks = await fetchMenu(newHandle)
          setSections(injectMenuBlocks(updated, blocks))
        } else {
          setSections(injectMenuBlocks(updated, menuBlocksRef.current))
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [fetchMenu])

  return (
    <main className="min-h-screen">
      {sections.map((section, index) => {
        const Component = COMPONENT_MAP[section.type]
        if (!Component) return null
        return <Component key={`${section.type}-${index}`} settings={section.settings} blocks={section.blocks} />
      })}
    </main>
  )
}
