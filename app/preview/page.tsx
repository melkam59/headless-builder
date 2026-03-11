'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-50" />}>
      <PreviewContent />
    </Suspense>
  )
}

function PreviewContent() {
  const searchParams = useSearchParams()
  const pageHandle = searchParams.get('pageHandle') ?? 'index'
  
  const [sections, setSections] = useState<SchemaSection[]>(schema)

  useEffect(() => {
    // Load initial theme data
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/themes?page=${pageHandle}`)
        const data = await res.json()
        if (data.mergedSections) {
          setSections(data.mergedSections)
        }
      } catch (e) {
        console.error('Preview failed to fetch:', e)
      }
    }
    fetchData()

    // Listen for live updates from the editor
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'FULL_UPDATE' && event.data.sections) {
        setSections(event.data.sections as SchemaSection[])
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <main className="min-h-screen">
      {sections.map((section, index) => {
        const Component = COMPONENT_MAP[section.type]
        if (!Component) return null
        return (
          <Component
            key={`${section.type}-${index}`}
            settings={section.settings}
            blocks={section.blocks}
          />
        )
      })}
    </main>
  )
}
