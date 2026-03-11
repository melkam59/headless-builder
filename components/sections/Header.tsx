'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Block {
  type: string
  settings: Record<string, any>
  blocks?: Block[]
}

interface HeaderProps {
  settings: Record<string, any>
  blocks?: Block[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Read a setting value — handles both merged (defaultValue) and raw (value) shapes */
function getSetting<T>(field: any, fallback: T): T {
  if (field === undefined || field === null) return fallback
  if (typeof field === 'object' && 'defaultValue' in field) {
    return (field.value !== undefined ? field.value : field.defaultValue) as T
  }
  return field as T
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({
  logoImage,
  logoWidth,
  storeName,
}: {
  logoImage: string
  logoWidth: number
  storeName: string
}) {
  return (
    <a
      href="/"
      className="flex-shrink-0 block overflow-hidden"
      style={{ maxWidth: `${logoWidth}px` }}
    >
      {logoImage ? (
        <img
          src={logoImage}
          alt={storeName}
          style={{ width: `${logoWidth}px`, height: 'auto', maxHeight: `${logoWidth}px` }}
          className="block object-contain"
        />
      ) : (
        <span className="text-xl font-bold text-gray-900 whitespace-nowrap truncate block">
          {storeName}
        </span>
      )}
    </a>
  )
}

// ─── Desktop nav menu ─────────────────────────────────────────────────────────

function DesktopMenu({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) return null

  return (
    <nav
      className="hidden md:flex items-center gap-1 overflow-x-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      {blocks.map((block, index) => (
        <NavItem key={index} block={block} />
      ))}
    </nav>
  )
}

function NavItem({ block }: { block: Block }) {
  const [isOpen, setIsOpen] = useState(false)
  const label = getSetting<string>(block.settings.label, '')
  const link = getSetting<string>(block.settings.link, '#')
  const openInNewTab = getSetting<boolean>(block.settings.openInNewTab, false)
  const hasSubmenu = block.blocks && block.blocks.length > 0

  if (!label) return null

  if (!hasSubmenu) {
    return (
      <a
        href={link}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
      >
        {label}
      </a>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap">
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 min-w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          {block.blocks?.map((sub, i) => {
            const subLabel = getSetting<string>(sub.settings.label, '')
            const subLink = getSetting<string>(sub.settings.link, '#')
            const subNewTab = getSetting<boolean>(sub.settings.openInNewTab, false)
            if (!subLabel) return null
            return (
              <a
                key={i}
                href={subLink}
                target={subNewTab ? '_blank' : undefined}
                rel={subNewTab ? 'noopener noreferrer' : undefined}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                {subLabel}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Mobile nav ───────────────────────────────────────────────────────────────

function MobileMenu({
  blocks,
  onClose,
}: {
  blocks: Block[]
  onClose: () => void
}) {
  return (
    <div className="md:hidden border-t border-gray-100 py-3">
      {blocks.map((block, index) => (
        <MobileNavItem key={index} block={block} onClose={onClose} />
      ))}
    </div>
  )
}

function MobileNavItem({ block, onClose }: { block: Block; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const label = getSetting<string>(block.settings.label, '')
  const link = getSetting<string>(block.settings.link, '#')
  const openInNewTab = getSetting<boolean>(block.settings.openInNewTab, false)
  const hasSubmenu = block.blocks && block.blocks.length > 0

  if (!label) return null

  if (!hasSubmenu) {
    return (
      <a
        href={link}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        onClick={onClose}
        className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
      >
        {label}
      </a>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pl-4">
          {block.blocks?.map((sub, i) => {
            const subLabel = getSetting<string>(sub.settings.label, '')
            const subLink = getSetting<string>(sub.settings.link, '#')
            const subNewTab = getSetting<boolean>(sub.settings.openInNewTab, false)
            if (!subLabel) return null
            return (
              <a
                key={i}
                href={subLink}
                target={subNewTab ? '_blank' : undefined}
                rel={subNewTab ? 'noopener noreferrer' : undefined}
                onClick={onClose}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                {subLabel}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Actions (cart, search) ───────────────────────────────────────────────────

function NavActions({ onMobileMenuToggle, mobileMenuOpen }: {
  onMobileMenuToggle: () => void
  mobileMenuOpen: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      {/* Search — desktop only */}
      <Button variant="ghost" size="icon" className="hidden md:flex w-9 h-9" aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </Button>

      {/* Cart */}
      <Button variant="ghost" size="icon" className="w-9 h-9" aria-label="Cart">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </Button>

      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMobileMenuToggle}
        className="md:hidden w-9 h-9"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </Button>
    </div>
  )
}

// ─── Main Header ─────────────────────────────────────────────────────────────

export default function Header({ settings, blocks = [] }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logoImage = getSetting<string>(settings.logoImage, '')
  const logoWidth = getSetting<number>(settings.logoWidth, 120)
  const logoPosition = getSetting<string>(settings.logoPosition, 'left')
  const transparentHeader = getSetting<boolean>(settings.transparentHeader, false)
  const stickyHeader = getSetting<boolean>(settings.stickyHeader, true)
  const storeName = getSetting<string>(settings.storeName, 'My Store')

  // Only menu_item blocks go into the nav
  const menuBlocks = blocks.filter((b) => b.type === 'menu_item')

  useEffect(() => {
    if (!stickyHeader) return
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [stickyHeader])

  const logoEl = (
    <Logo logoImage={logoImage} logoWidth={logoWidth} storeName={storeName} />
  )
  const menuEl = <DesktopMenu blocks={menuBlocks} />

  return (
    <header
      className={cn(
        'transition-all duration-300 z-50',
        stickyHeader && 'sticky top-0',
        transparentHeader && !isScrolled ? 'bg-transparent' : 'bg-white',
        isScrolled ? 'shadow-md' : 'shadow-sm',
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*
          3-column grid:  [left — 1fr] [center — auto] [right — 1fr]

          ‣ left and right are equal-width flex containers that grow/shrink together,
            so the center column stays geometrically centered at all times.
          ‣ logo-position drives which element goes in which zone:
              left   → logo left,   menu center,  actions right
              center → menu left,   logo center,  actions right
              right  → menu left,   (gap) center, logo+actions right
        */}
        <div className="grid items-center h-16" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

          {/* ── Left zone ── */}
          <div className="flex items-center justify-start min-w-0 gap-6">
            {logoPosition === 'left' && logoEl}
            {(logoPosition === 'center' || logoPosition === 'right') && menuEl}
          </div>

          {/* ── Center zone — always truly centered ── */}
          <div className="flex items-center justify-center px-4">
            {logoPosition === 'center' && logoEl}
            {logoPosition === 'left' && menuEl}
            {/* right: nothing in center — keeps symmetry */}
          </div>

          {/* ── Right zone ── */}
          <div className="flex items-center justify-end gap-1 min-w-0">
            {logoPosition === 'right' && (
              <div className="mr-2">{logoEl}</div>
            )}
            <NavActions
              onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
              mobileMenuOpen={mobileMenuOpen}
            />
          </div>
        </div>

        {/* Mobile expanded menu */}
        {mobileMenuOpen && (
          <MobileMenu
            blocks={menuBlocks}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}
      </nav>
    </header>
  )
}
