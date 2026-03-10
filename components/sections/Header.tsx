'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Block {
  type: string
  settings: any
  blocks?: Block[]
}

interface HeaderProps {
  settings: any
  blocks?: Block[]
}

function LogoRenderer({ logoImage, logoWidth, storeName }: {
  logoImage: string
  logoWidth: number
  storeName: string
}) {
  return (
    <div className="flex-shrink-0">
      <a href="/">
        {logoImage ? (
          <img
            src={logoImage}
            alt={storeName}
            style={{ width: `${logoWidth}px`, height: 'auto', maxHeight: `${logoWidth}px`, objectFit: 'contain' }}
            className="block"
          />
        ) : (
          <span className="text-2xl font-bold text-gray-900">{storeName}</span>
        )}
      </a>
    </div>
  )
}

function MenuItemRenderer({ block }: { block: Block }) {
  const [isOpen, setIsOpen] = useState(false)
  const label = block.settings.label?.defaultValue || ''
  const link = block.settings.link?.defaultValue || '#'
  const hasSubmenu = block.blocks && block.blocks.length > 0

  if (!hasSubmenu) {
    return (
      <a href={link} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
        {label}
      </a>
    )
  }

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium px-0 h-auto">
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn('ml-1 w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
          {block.blocks?.map((submenuBlock, index) => (
            <SubmenuItemRenderer key={index} block={submenuBlock} />
          ))}
        </div>
      )}
    </div>
  )
}

function SubmenuItemRenderer({ block }: { block: Block }) {
  const label = block.settings.label?.defaultValue || ''
  const link = block.settings.link?.defaultValue || '#'
  const image = block.settings.image?.defaultValue || ''

  return (
    <a href={link} className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors">
      {image && <img src={image} alt={label} className="w-12 h-12 object-cover rounded mr-3" />}
      <span className="text-gray-700 hover:text-gray-900">{label}</span>
    </a>
  )
}

function MobileMenuItemRenderer({ block, onClose }: { block: Block; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const label = block.settings.label?.defaultValue || ''
  const link = block.settings.link?.defaultValue || '#'
  const hasSubmenu = block.blocks && block.blocks.length > 0

  if (!hasSubmenu) {
    return (
      <a href={link} onClick={onClose} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
        {label}
      </a>
    )
  }

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md h-auto font-normal"
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <div className="pl-4 mt-1">
          {block.blocks?.map((submenuBlock, index) => {
            const subLabel = submenuBlock.settings.label?.defaultValue || ''
            const subLink = submenuBlock.settings.link?.defaultValue || '#'
            return (
              <a key={index} href={subLink} onClick={onClose} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                {subLabel}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Header({ settings, blocks = [] }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logoImage = settings.logoImage?.defaultValue || ''
  const logoWidth = settings.logoWidth?.defaultValue || 120
  const logoPosition = settings.logoPosition?.defaultValue || 'left'
  const transparentHeader = settings.transparentHeader?.defaultValue || false
  const stickyHeader = settings.stickyHeader?.defaultValue || true
  const storeName = settings.storeName?.defaultValue || 'My Store'

  useEffect(() => {
    if (!stickyHeader) return
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [stickyHeader])

  return (
    <header className={cn(
      'transition-all duration-300 z-50',
      stickyHeader && 'sticky top-0',
      transparentHeader && !isScrolled ? 'bg-transparent' : 'bg-white shadow-sm',
      isScrolled && 'shadow-md',
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {logoPosition === 'left' && (
            <>
              <LogoRenderer logoImage={logoImage} logoWidth={logoWidth} storeName={storeName} />
              <div className="hidden md:flex md:items-center md:gap-6 flex-wrap">
                {blocks.map((block, index) => <MenuItemRenderer key={index} block={block} />)}
              </div>
            </>
          )}

          {logoPosition === 'center' && (
            <>
              <div className="flex-1 min-w-0" />
              <div className="flex items-center gap-6 flex-shrink-0">
                <LogoRenderer logoImage={logoImage} logoWidth={logoWidth} storeName={storeName} />
                <div className="hidden md:flex md:items-center md:gap-6">
                  {blocks.map((block, index) => <MenuItemRenderer key={index} block={block} />)}
                </div>
              </div>
              <div className="flex-1 min-w-0" />
            </>
          )}

          {logoPosition === 'right' && (
            <>
              <div className="hidden md:flex md:items-center md:gap-6 flex-wrap">
                {blocks.map((block, index) => <MenuItemRenderer key={index} block={block} />)}
              </div>
              <LogoRenderer logoImage={logoImage} logoWidth={logoWidth} storeName={storeName} />
            </>
          )}

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {blocks.map((block, index) => (
              <MobileMenuItemRenderer key={index} block={block} onClose={() => setMobileMenuOpen(false)} />
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
