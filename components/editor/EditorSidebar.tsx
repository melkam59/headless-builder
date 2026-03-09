'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TreeSection from './TreeSection';
import TreeItem from './TreeItem';
import {
  LayoutTemplate, Type, Image, Menu, Megaphone,
  ChevronLeft, Zap, Plus, Home, AlignLeft,
} from 'lucide-react';

interface EditorSidebarProps {
  selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
}

export default function EditorSidebar({
  selectedItem,
  setSelectedItem,
  expandedSections,
  toggleSection,
}: EditorSidebarProps) {
  return (
    <aside className="w-72 shrink-0 bg-white border-r border-zinc-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-100">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors mb-3 group w-fit">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 leading-none">Customize</p>
              <p className="text-xs text-zinc-400 mt-0.5">Horizon theme</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">Live</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-3 space-y-4">
          {/* Home page */}
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <Home className="w-3.5 h-3.5" /> Home page
            </div>

            {/* Header group */}
            <div className="mt-1 space-y-0.5">
              <TreeSection
                title="Header"
                icon={<AlignLeft className="w-3.5 h-3.5" />}
                isExpanded={expandedSections.header}
                onToggle={() => toggleSection('header')}
                isSelected={selectedItem === 'header'}
                onSelect={() => setSelectedItem('header')}
              >
                <TreeItem title="Announcement bar" icon={<Megaphone className="w-3.5 h-3.5" />} isSelected={selectedItem === 'announcementBar'} onClick={() => setSelectedItem('announcementBar')} level={1} />
                <TreeItem title="Header" icon={<LayoutTemplate className="w-3.5 h-3.5" />} isSelected={selectedItem === 'headerMain'} onClick={() => setSelectedItem('headerMain')} level={1}>
                  <TreeItem title="Logo" icon={<Image className="w-3.5 h-3.5" />} isSelected={selectedItem === 'logo'} onClick={() => setSelectedItem('logo')} level={2} />
                  <TreeItem title="Menu" icon={<Menu className="w-3.5 h-3.5" />} subtitle="Main menu" isSelected={selectedItem === 'menu'} onClick={() => setSelectedItem('menu')} level={2} />
                </TreeItem>
                <button className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 font-medium px-2 py-1 ml-5 mt-1 rounded-md hover:bg-violet-50 transition-colors">
                  <Plus className="w-3 h-3" /> Add section
                </button>
              </TreeSection>
            </div>
          </div>

          <Separator className="my-1" />

          {/* Template sections */}
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              <LayoutTemplate className="w-3.5 h-3.5" /> Template
            </div>
            <div className="space-y-0.5">
              {[
                { id: 'hero', label: 'Hero' },
                { id: 'collectionList', label: 'Collection List' },
                { id: 'productGrid', label: 'Product Grid' },
              ].map((s) => (
                <TreeSection
                  key={s.id}
                  title={s.label}
                  icon={<LayoutTemplate className="w-3.5 h-3.5" />}
                  isExpanded={!!expandedSections[s.id]}
                  onToggle={() => toggleSection(s.id)}
                  isSelected={selectedItem === s.id}
                  onSelect={() => setSelectedItem(s.id)}
                />
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          {/* Footer */}
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              <Type className="w-3.5 h-3.5" /> Footer
            </div>
            <TreeSection
              title="Footer"
              icon={<LayoutTemplate className="w-3.5 h-3.5" />}
              isExpanded={!!expandedSections.footer}
              onToggle={() => toggleSection('footer')}
              isSelected={selectedItem === 'footer'}
              onSelect={() => setSelectedItem('footer')}
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="p-3 border-t border-zinc-100">
        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white h-9 font-medium">
          Save Changes
        </Button>
      </div>
    </aside>
  );
}
