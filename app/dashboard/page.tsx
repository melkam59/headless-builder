'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Store, FileText, Settings, Zap, ExternalLink, LayoutTemplate,
  ChevronRight, Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Section = 'themes' | 'pages' | 'preferences';

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'themes', label: 'Themes', icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: 'pages', label: 'Pages', icon: <FileText className="w-4 h-4" /> },
  { id: 'preferences', label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>('themes');

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-zinc-200 flex flex-col shadow-sm">
        {/* Brand */}
        <div className="px-4 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-zinc-900 text-sm">My Store</span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <nav className="p-2 space-y-0.5">
            {/* Sales channels */}
            <div className="px-2 pt-3 pb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Sales channels
            </div>

            <div className="mb-1">
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-800 rounded-md bg-zinc-100">
                <Store className="w-4 h-4 text-zinc-500" />
                Online Store
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-zinc-400" />
              </div>

              <div className="ml-5 mt-0.5 border-l border-zinc-200 pl-2 space-y-0.5">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors',
                      activeSection === item.id
                        ? 'bg-violet-50 text-violet-700 font-medium'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    )}
                  >
                    <span className={activeSection === item.id ? 'text-violet-500' : 'text-zinc-400'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-100">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <div className="p-8 max-w-5xl">
            {activeSection === 'themes' && <ThemesSection />}
            {activeSection === 'pages' && <PlaceholderSection title="Pages" desc="Manage your store pages." />}
            {activeSection === 'preferences' && <PlaceholderSection title="Preferences" desc="Configure your store settings." />}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

function ThemesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Themes</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage and customize your store theme</p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Theme card header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-zinc-900">Horizon Theme</h3>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
              </div>
              <p className="text-xs text-zinc-500">Current live theme</p>
            </div>
          </div>
          <Link href="/editor">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2" size="sm">
              <Settings className="w-3.5 h-3.5" /> Customize
            </Button>
          </Link>
        </div>

        {/* Preview iframe */}
        <div className="bg-zinc-100" style={{ height: '560px' }}>
          <iframe src="/preview" className="w-full h-full" title="Theme Preview" />
        </div>
      </div>
    </div>
  );
}

function PlaceholderSection({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        <p className="text-sm text-zinc-500 mt-1">{desc}</p>
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
        <p className="text-sm text-zinc-400">Coming soon…</p>
      </div>
    </div>
  );
}
