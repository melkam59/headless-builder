'use client';

import { useState } from 'react';
import EditorSidebar from '@/components/editor/EditorSidebar';
import SettingsPanel from '@/components/editor/SettingsPanel';

export default function EditorPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>('logo');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: true,
    headerMain: true,
  });

  const [themeSettings, setThemeSettings] = useState({
    logo: {
      image: '',
      width: 120,
      hideOnHomePage: false,
      position: 'left' as 'left' | 'center' | 'right',
      padding: { top: 24, bottom: 26, left: 4, right: 0 },
    },
    header: {
      stickyHeader: true,
      transparentHeader: false,
    },
    menu: [
      {
        id: 'menu-1',
        label: 'Shop',
        link: '/collections/all',
        submenu: [
          { id: 'sub-1', label: 'New Arrivals', link: '/collections/new' },
          { id: 'sub-2', label: 'Best Sellers', link: '/collections/best-sellers' },
        ],
      },
      {
        id: 'menu-2',
        label: 'About',
        link: '/about',
        submenu: [],
      },
      {
        id: 'menu-3',
        label: 'Contact',
        link: '/contact',
        submenu: [],
      },
    ],
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop',
      height: 'large',
      overlayOpacity: 30,
    },
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const updateSettings = (updates: any) => {
    setThemeSettings(prev => {
      const newSettings = { ...prev, ...updates };
      
      // Send updates to preview iframe with retry
      const sendToIframe = () => {
        const iframe = document.querySelector('iframe');
        if (iframe?.contentWindow) {
          try {
            iframe.contentWindow.postMessage({
              type: 'UPDATE_THEME',
              section: selectedItem,
              settings: updates
            }, '*');
          } catch (error) {
            console.error('Failed to send message to iframe:', error);
          }
        }
      };
      
      // Send immediately and after a short delay to ensure iframe is ready
      sendToIframe();
      setTimeout(sendToIframe, 100);
      
      return newSettings;
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <EditorSidebar
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />

      {/* Center - Preview */}
      <main className="flex-1 bg-gray-100 overflow-auto">
        <div className="h-full flex items-start justify-center p-8">
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
            <iframe
              src="/preview"
              className="w-full h-full"
              title="Theme Preview"
            />
          </div>
        </div>
      </main>

      {/* Right Sidebar - Settings Panel */}
      <aside className="w-80 bg-white border-l border-gray-200 overflow-auto">
        <div className="p-4">
          <SettingsPanel
            selectedItem={selectedItem}
            settings={themeSettings}
            onUpdate={updateSettings}
          />
        </div>
      </aside>
    </div>
  );
}
