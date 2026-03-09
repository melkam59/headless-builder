'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditorSidebar from '@/components/editor/EditorSidebar';
import SettingsPanel from '@/components/editor/SettingsPanel';
import { cn } from '@/lib/utils';

const defaultSettings = {
  logo: { storeName: 'My Store', image: '', width: 120, hideOnHomePage: false, position: 'left' as const, padding: { top: 24, bottom: 26, left: 4, right: 0 } },
  header: { stickyHeader: true, transparentHeader: false },
  menu: [
    { id: 'menu-1', label: 'Shop', link: '/collections/all', visible: true, submenu: [
      { id: 'sub-1', label: 'New Arrivals', link: '/collections/new', visible: true },
      { id: 'sub-2', label: 'Best Sellers', link: '/collections/best-sellers', visible: true },
    ]},
    { id: 'menu-2', label: 'About', link: '/about', visible: true, submenu: [] },
    { id: 'menu-3', label: 'Contact', link: '/contact', visible: true, submenu: [] },
  ],
  hero: { backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop', height: 'large', overlayOpacity: 30 },
};

type DeviceView = 'desktop' | 'tablet' | 'mobile';

const deviceIcons: Record<DeviceView, React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
};

const previewWidths: Record<DeviceView, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function EditorPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>('logo');
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const themeIdRef = useRef<number | null>(null);   // ref avoids stale-closure race condition
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ header: true, headerMain: true });
  const [themeSettings, setThemeSettings] = useState(defaultSettings);

  const toggleSection = (id: string) =>
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch('/api/themes');
        const data = await res.json();
        if (data.settings) {
          setThemeSettings(data.settings);
          themeIdRef.current = data.id;
          // Send loaded settings to preview on mount
          setTimeout(() => {
            const iframe = document.querySelector('iframe');
            if (iframe?.contentWindow) {
              iframe.contentWindow.postMessage({ type: 'UPDATE_THEME', section: 'logo', settings: data.settings }, '*');
              iframe.contentWindow.postMessage({ type: 'UPDATE_THEME', section: 'menu', settings: data.settings }, '*');
              iframe.contentWindow.postMessage({ type: 'UPDATE_THEME', section: 'hero', settings: data.settings }, '*');
            }
          }, 600);
        }
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchTheme();
  }, []);

  const saveTheme = useCallback(async (settings: typeof defaultSettings) => {
    try {
      const res = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, themeId: themeIdRef.current }),
      });
      const data = await res.json();
      if (!themeIdRef.current && data.id) {
        themeIdRef.current = data.id;
      }
    } catch (e) { console.error(e); }
  }, []);

  const updateSettings = (updates: any) => {
    setThemeSettings((prev) => {
      const next = { ...prev, ...updates };
      // Debounce saves — 500ms after last change
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveTheme(next), 500);
      // Send to preview immediately
      const iframe = document.querySelector('iframe');
      iframe?.contentWindow?.postMessage({ type: 'UPDATE_THEME', section: selectedItem, settings: updates }, '*');
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Loading theme…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <EditorSidebar
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />

      {/* Preview panel */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Device toolbar */}
        <div className="h-12 bg-white border-b border-zinc-200 flex items-center justify-center gap-1 px-4">
          {(['desktop', 'tablet', 'mobile'] as DeviceView[]).map((d) => (
            <button
              key={d}
              onClick={() => setDeviceView(d)}
              title={d}
              className={cn(
                'p-2 rounded-md transition-colors capitalize text-sm flex items-center gap-1.5',
                deviceView === d ? 'bg-violet-50 text-violet-700' : 'text-zinc-500 hover:bg-zinc-100'
              )}
            >
              {deviceIcons[d]}
            </button>
          ))}
        </div>

        {/* Preview area */}
        <div className="flex-1 flex items-start justify-center p-6 overflow-auto bg-zinc-100">
          <div
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-zinc-200"
            style={{ width: previewWidths[deviceView], height: 'calc(100vh - 7rem)', maxWidth: '100%' }}
          >
            <iframe src="/preview" className="w-full h-full" title="Theme Preview" />
          </div>
        </div>
      </main>

      {/* Settings panel */}
      <aside className="w-72 shrink-0 bg-white border-l border-zinc-200 flex flex-col shadow-sm">
        <div className="px-4 py-3 border-b border-zinc-100">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Settings</p>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4">
            <SettingsPanel
              selectedItem={selectedItem}
              settings={themeSettings}
              onUpdate={updateSettings}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
