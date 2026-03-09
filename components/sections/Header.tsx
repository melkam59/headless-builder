'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Block {
  type: string;
  settings: any;
  blocks?: Block[];
}

interface HeaderProps {
  settings: any;
  blocks?: Block[];
}

export default function Header({ settings, blocks = [] }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoImage = settings.logoImage?.defaultValue || '';
  const logoWidth = settings.logoWidth?.defaultValue || 120;
  const logoPosition = settings.logoPosition || 'left';
  const logoPadding = settings.logoPadding || { top: 24, bottom: 26, left: 4, right: 0 };
  const transparentHeader = settings.transparentHeader?.defaultValue || false;
  const stickyHeader = settings.stickyHeader?.defaultValue || true;

  useEffect(() => {
    if (!stickyHeader) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyHeader]);

  const headerClasses = `
    ${stickyHeader ? 'sticky top-0' : ''}
    ${transparentHeader && !isScrolled ? 'bg-transparent' : 'bg-white shadow-sm'}
    ${isScrolled ? 'shadow-md' : ''}
    transition-all duration-300 z-50
  `;

  return (
    <header className={headerClasses}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Left Position: Logo left, Menu right */}
          {logoPosition === 'left' && (
            <>
              <div className="flex-shrink-0">
                <a href="/">
                  {logoImage ? (
                    <img
                      src={logoImage}
                      alt="Logo"
                      style={{ 
                        width: `${logoWidth}px`,
                        marginTop: `${logoPadding.top}px`,
                        marginBottom: `${logoPadding.bottom}px`,
                        marginLeft: `${logoPadding.left}px`,
                        marginRight: `${logoPadding.right}px`,
                      }}
                      className="h-auto"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">Store</span>
                  )}
                </a>
              </div>
              <div className="flex-1" />
              <div className="hidden md:flex md:items-center md:space-x-8">
                {blocks.map((block, index) => (
                  <MenuItemRenderer key={index} block={block} />
                ))}
              </div>
            </>
          )}

          {/* Center Position: Logo and Menu side by side in center */}
          {logoPosition === 'center' && (
            <>
              <div className="flex-1" />
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <a href="/">
                    {logoImage ? (
                      <img
                        src={logoImage}
                        alt="Logo"
                        style={{ 
                          width: `${logoWidth}px`,
                          marginTop: `${logoPadding.top}px`,
                          marginBottom: `${logoPadding.bottom}px`,
                          marginLeft: `${logoPadding.left}px`,
                          marginRight: `${logoPadding.right}px`,
                        }}
                        className="h-auto"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">Store</span>
                    )}
                  </a>
                </div>
                <div className="hidden md:flex md:items-center md:space-x-8">
                  {blocks.map((block, index) => (
                    <MenuItemRenderer key={index} block={block} />
                  ))}
                </div>
              </div>
              <div className="flex-1" />
            </>
          )}

          {/* Right Position: Menu left, Logo right */}
          {logoPosition === 'right' && (
            <>
              <div className="hidden md:flex md:items-center md:space-x-8">
                {blocks.map((block, index) => (
                  <MenuItemRenderer key={index} block={block} />
                ))}
              </div>
              <div className="flex-1" />
              <div className="flex-shrink-0">
                <a href="/">
                  {logoImage ? (
                    <img
                      src={logoImage}
                      alt="Logo"
                      style={{ 
                        width: `${logoWidth}px`,
                        marginTop: `${logoPadding.top}px`,
                        marginBottom: `${logoPadding.bottom}px`,
                        marginLeft: `${logoPadding.left}px`,
                        marginRight: `${logoPadding.right}px`,
                      }}
                      className="h-auto"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">Store</span>
                  )}
                </a>
              </div>
            </>
          )}

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {blocks.map((block, index) => (
              <MobileMenuItemRenderer
                key={index}
                block={block}
                onClose={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

function MenuItemRenderer({ block }: { block: Block }) {
  const [isOpen, setIsOpen] = useState(false);
  const label = block.settings.label?.defaultValue || '';
  const link = block.settings.link?.defaultValue || '#';
  const hasSubmenu = block.blocks && block.blocks.length > 0;

  if (!hasSubmenu) {
    return (
      <a
        href={link}
        className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
      >
        {label}
      </a>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center">
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
          {block.blocks?.map((submenuBlock, index) => (
            <SubmenuItemRenderer key={index} block={submenuBlock} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubmenuItemRenderer({ block }: { block: Block }) {
  const label = block.settings.label?.defaultValue || '';
  const link = block.settings.link?.defaultValue || '#';
  const image = block.settings.image?.defaultValue || '';

  return (
    <a
      href={link}
      className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
    >
      {image && (
        <img src={image} alt={label} className="w-12 h-12 object-cover rounded mr-3" />
      )}
      <span className="text-gray-700 hover:text-gray-900">{label}</span>
    </a>
  );
}

function MobileMenuItemRenderer({
  block,
  onClose,
}: {
  block: Block;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const label = block.settings.label?.defaultValue || '';
  const link = block.settings.link?.defaultValue || '#';
  const hasSubmenu = block.blocks && block.blocks.length > 0;

  if (!hasSubmenu) {
    return (
      <a
        href={link}
        onClick={onClose}
        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
      >
        {label}
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="pl-4 mt-1">
          {block.blocks?.map((submenuBlock, index) => {
            const subLabel = submenuBlock.settings.label?.defaultValue || '';
            const subLink = submenuBlock.settings.link?.defaultValue || '#';
            return (
              <a
                key={index}
                href={subLink}
                onClick={onClose}
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
              >
                {subLabel}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
