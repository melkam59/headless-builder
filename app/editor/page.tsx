'use client';

import { useState } from 'react';
import EditorSidebar from '@/components/editor/EditorSidebar';
import SettingsPanel from '@/components/editor/SettingsPanel';

export default function EditorPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>('logo');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
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

  const getPreviewWidth = () => {
    switch (deviceView) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
    }
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
      <main className="flex-1 bg-gray-100 overflow-auto flex flex-col">
        {/* Device Preview Toolbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center gap-2">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`p-2 rounded-lg transition-colors ${
              deviceView === 'desktop' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Desktop view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <button
            onClick={() => setDeviceView('tablet')}
            className={`p-2 rounded-lg transition-colors ${
              deviceView === 'tablet' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Tablet view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <button
            onClick={() => setDeviceView('mobile')}
            className={`p-2 rounded-lg transition-colors ${
              deviceView === 'mobile' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Mobile view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex items-start justify-center p-8">
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300" 
            style={{ 
              width: getPreviewWidth(),
              height: 'calc(100vh - 8rem)',
              maxWidth: '100%'
            }}
          >
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
