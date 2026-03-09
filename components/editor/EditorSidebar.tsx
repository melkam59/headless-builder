'use client';

import { Button } from '@/components/ui/button';
import TreeSection from './TreeSection';
import TreeItem from './TreeItem';

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
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Customize Theme</h1>
      </div>

      {/* Sections Tree */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          {/* Home page */}
          <div className="mb-4">
            <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home page
            </div>
          </div>

          {/* Header Section */}
          <TreeSection
            title="Header"
            icon="header"
            isExpanded={expandedSections.header}
            onToggle={() => toggleSection('header')}
            isSelected={selectedItem === 'header'}
            onSelect={() => setSelectedItem('header')}
          >
            <TreeItem
              title="Announcement bar"
              icon="announcement"
              isSelected={selectedItem === 'announcementBar'}
              onClick={() => setSelectedItem('announcementBar')}
              level={1}
            />
            <TreeItem
              title="Header"
              icon="header"
              isSelected={selectedItem === 'headerMain'}
              onClick={() => setSelectedItem('headerMain')}
              level={1}
            >
              <TreeItem
                title="Logo"
                icon="logo"
                isSelected={selectedItem === 'logo'}
                onClick={() => setSelectedItem('logo')}
                level={2}
              />
              <TreeItem
                title="Menu"
                icon="menu"
                subtitle="Main menu"
                isSelected={selectedItem === 'menu'}
                onClick={() => setSelectedItem('menu')}
                level={2}
              />
            </TreeItem>
            <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 ml-6 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add section
            </button>
          </TreeSection>

          {/* Template Section */}
          <div className="mt-4 mb-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
              Template
            </div>
          </div>

          <TreeSection
            title="Hero"
            icon="section"
            isExpanded={expandedSections.hero}
            onToggle={() => toggleSection('hero')}
            isSelected={selectedItem === 'hero'}
            onSelect={() => setSelectedItem('hero')}
          />

          <TreeSection
            title="Collection List"
            icon="section"
            isExpanded={false}
            onToggle={() => toggleSection('collectionList')}
            isSelected={selectedItem === 'collectionList'}
            onSelect={() => setSelectedItem('collectionList')}
          />

          <TreeSection
            title="Product Grid"
            icon="section"
            isExpanded={false}
            onToggle={() => toggleSection('productGrid')}
            isSelected={selectedItem === 'productGrid'}
            onSelect={() => setSelectedItem('productGrid')}
          />

          {/* Footer Section */}
          <div className="mt-4 mb-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
              Footer
            </div>
          </div>

          <TreeSection
            title="Footer"
            icon="section"
            isExpanded={expandedSections.footer}
            onToggle={() => toggleSection('footer')}
            isSelected={selectedItem === 'footer'}
            onSelect={() => setSelectedItem('footer')}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200">
        <Button className="w-full bg-black hover:bg-gray-800 text-white">
          Save Changes
        </Button>
      </div>
    </aside>
  );
}
